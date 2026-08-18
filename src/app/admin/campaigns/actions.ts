"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit/log";
import { generateCampaignCopy, getCampaignRecommendation } from "@/lib/campaigns/copy";
import { createClient } from "@/lib/supabase/server";
import type { Channel } from "@/lib/supabase/database.types";

const campaignTypes = [
  "appointment_reminder",
  "missed_appointment",
  "feedback_request",
  "wellness_check",
  "screening_campaign",
] as const;
const channels = ["email", "sms", "whatsapp", "voice"] as const;
const audiences = [
  "recent_appointments",
  "missed_appointments",
  "feedback_needed",
  "whatsapp_opt_ins",
  "all_patients",
] as const;

const text = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

const assertAdmin = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Admin access is required.");
  }

  return { supabase, userId: user.id };
};

export const createCampaign = async (formData: FormData) => {
  const name = text(formData.get("name"));
  const campaignType = text(formData.get("campaign_type"));
  const audience = text(formData.get("audience"));
  const channel = text(formData.get("channel"));
  const goal = text(formData.get("goal"));
  const message = text(formData.get("message"));

  if (!name) {
    throw new Error("Campaign name is required.");
  }

  if (!campaignTypes.includes(campaignType as (typeof campaignTypes)[number])) {
    throw new Error("Choose a valid campaign type.");
  }

  if (!audiences.includes(audience as (typeof audiences)[number])) {
    throw new Error("Choose a valid audience.");
  }

  if (!channels.includes(channel as (typeof channels)[number])) {
    throw new Error("Choose a valid channel.");
  }

  const { supabase, userId } = await assertAdmin();
  const generatedMessage =
    message ||
    generateCampaignCopy({
      name,
      campaignType,
      audience,
      channel,
      goal,
    });

  const { data: campaign, error } = await supabase
    .from("campaigns")
    .insert({
      name,
      campaign_type: campaignType,
      audience,
      channel: channel as Channel,
      goal: goal || null,
      message: generatedMessage,
      ai_recommendation: getCampaignRecommendation(campaignType),
      status: "draft",
      created_by: userId,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    actorId: userId,
    actorType: "admin",
    eventType: "campaign_created",
    entityType: "campaign",
    entityId: campaign.id,
    summary: `Created campaign ${name}`,
    metadata: {
      campaign_type: campaignType,
      audience,
      channel,
    },
  });

  revalidatePath("/admin/campaigns");
  revalidatePath("/admin");
  revalidatePath("/admin/analytics");
};

export const queueCampaign = async (formData: FormData) => {
  const campaignId = text(formData.get("campaign_id"));
  const { supabase, userId } = await assertAdmin();

  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .select("id, name, audience, channel, message, status")
    .eq("id", campaignId)
    .single();

  if (campaignError || !campaign) {
    throw new Error(campaignError?.message || "Campaign not found.");
  }

  const recipients = await getCampaignRecipients(supabase, campaign.audience);
  const limitedRecipients = recipients.slice(0, 25);

  if (limitedRecipients.length === 0) {
    throw new Error("No matching recipients found for this audience.");
  }

  const { error: recipientError } = await supabase
    .from("campaign_recipients")
    .insert(
      limitedRecipients.map((recipient) => ({
        campaign_id: campaign.id,
        patient_id: recipient.patient_id,
        recipient_name: recipient.name,
        recipient_phone: recipient.phone,
        recipient_email: recipient.email,
        status: "queued",
      })),
    );

  if (recipientError) {
    throw new Error(recipientError.message);
  }

  const { error: outboxError } = await supabase.from("communication_outbox").insert(
    limitedRecipients.map((recipient) => ({
      patient_id: recipient.patient_id,
      channel: campaign.channel as Channel,
      recipient_name: recipient.name,
      recipient_phone: recipient.phone,
      recipient_email: recipient.email,
      subject: `MediDove: ${campaign.name}`,
      message: campaign.message.replaceAll(
        "{{patient_name}}",
        recipient.name || "there",
      ),
      status: "queued",
      provider:
        campaign.channel === "voice"
          ? "elevenlabs"
          : campaign.channel === "sms" || campaign.channel === "whatsapp"
            ? "twilio"
            : "manual_email",
      metadata: {
        campaign_id: campaign.id,
        campaign_name: campaign.name,
        queued_from: "campaign_dashboard",
      },
    })),
  );

  if (outboxError) {
    throw new Error(outboxError.message);
  }

  const { error: updateError } = await supabase
    .from("campaigns")
    .update({
      status: "queued",
      recipient_count: limitedRecipients.length,
      queued_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", campaign.id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  await writeAuditLog(supabase, {
    actorId: userId,
    actorType: "admin",
    eventType: "campaign_queued",
    entityType: "campaign",
    entityId: campaign.id,
    summary: `Queued ${limitedRecipients.length} recipients for ${campaign.name}`,
    metadata: {
      recipient_count: limitedRecipients.length,
      channel: campaign.channel,
    },
  });

  revalidatePath("/admin/campaigns");
  revalidatePath("/admin/outreach");
  revalidatePath("/admin/analytics");
};

const getCampaignRecipients = async (
  supabase: Awaited<ReturnType<typeof createClient>>,
  audience: string,
) => {
  if (audience === "recent_appointments") {
    const { data } = await supabase
      .from("appointments")
      .select("patient_id, patient_name, patient_email, patient_phone")
      .not("patient_phone", "is", null)
      .order("created_at", { ascending: false })
      .limit(50);

    return dedupeRecipients(
      (data || []).map((item) => ({
        patient_id: item.patient_id,
        name: item.patient_name,
        phone: item.patient_phone,
        email: item.patient_email,
      })),
    );
  }

  if (audience === "missed_appointments") {
    const { data } = await supabase
      .from("appointments")
      .select("patient_id, patient_name, patient_email, patient_phone")
      .eq("status", "cancelled")
      .not("patient_phone", "is", null)
      .order("created_at", { ascending: false })
      .limit(50);

    return dedupeRecipients(
      (data || []).map((item) => ({
        patient_id: item.patient_id,
        name: item.patient_name,
        phone: item.patient_phone,
        email: item.patient_email,
      })),
    );
  }

  if (audience === "feedback_needed") {
    const { data } = await supabase
      .from("appointments")
      .select("patient_id, patient_name, patient_email, patient_phone")
      .eq("status", "completed")
      .not("patient_phone", "is", null)
      .order("created_at", { ascending: false })
      .limit(50);

    return dedupeRecipients(
      (data || []).map((item) => ({
        patient_id: item.patient_id,
        name: item.patient_name,
        phone: item.patient_phone,
        email: item.patient_email,
      })),
    );
  }

  if (audience === "whatsapp_opt_ins") {
    const { data } = await supabase
      .from("consent_logs")
      .select("patient_id, phone, email, profiles(full_name)")
      .eq("channel", "whatsapp")
      .eq("consented", true)
      .not("phone", "is", null)
      .order("created_at", { ascending: false })
      .limit(50);

    return dedupeRecipients(
      (data || []).map((item) => {
        const profile = Array.isArray(item.profiles)
          ? item.profiles[0]
          : item.profiles;

        return {
          patient_id: item.patient_id,
          name: profile?.full_name || "Patient",
          phone: item.phone,
          email: item.email,
        };
      }),
    );
  }

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, phone")
    .eq("role", "patient")
    .not("phone", "is", null)
    .order("created_at", { ascending: false })
    .limit(50);

  return dedupeRecipients(
    (data || []).map((item) => ({
      patient_id: item.id,
      name: item.full_name || "Patient",
      phone: item.phone,
      email: null,
    })),
  );
};

const dedupeRecipients = (
  recipients: {
    patient_id: string | null;
    name: string | null;
    phone: string | null;
    email: string | null;
  }[],
) => {
  const seen = new Set<string>();

  return recipients.filter((recipient) => {
    const key = recipient.patient_id || recipient.phone || recipient.email;

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });
};
