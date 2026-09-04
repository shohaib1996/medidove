"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit/log";
import { dispatchOutboxRecordById } from "@/lib/communications/dispatch";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

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

  return user.id;
};

export const replyToAiLead = async (formData: FormData) => {
  const leadId = text(formData.get("lead_id"));
  const subject = text(formData.get("subject")) || "Re: your message to MediDove";
  const message = text(formData.get("message"));

  if (!leadId || !message) {
    throw new Error("A message is required to reply.");
  }

  const userId = await assertAdmin();
  const admin = createAdminClient();

  const { data: lead, error: leadError } = await admin
    .from("ai_leads")
    .select("id, name, email, status")
    .eq("id", leadId)
    .single();

  if (leadError || !lead) {
    throw new Error(leadError?.message || "Lead not found.");
  }

  if (!lead.email) {
    throw new Error("This lead has no email address on file.");
  }

  await admin.from("consent_logs").insert({
    email: lead.email,
    channel: "email",
    consented: true,
    reason: "Implied consent: reply to an inbound AI chat inquiry.",
  });

  const { data: outboxRow, error: outboxError } = await admin
    .from("communication_outbox")
    .insert({
      channel: "email",
      recipient_name: lead.name,
      recipient_email: lead.email,
      subject,
      message,
      status: "queued",
      provider: process.env.OUTBOUND_EMAIL_PROVIDER?.trim() || "smtp",
      metadata: {
        queued_from: "admin_ai_leads",
        lead_id: lead.id,
        consent_basis: "inbound_reply",
      },
    })
    .select("id")
    .single();

  if (outboxError || !outboxRow) {
    throw new Error(outboxError?.message || "Unable to queue the reply.");
  }

  const dispatch = await dispatchOutboxRecordById(outboxRow.id);

  await writeAuditLog(admin, {
    actorId: userId,
    actorType: "admin",
    eventType: "ai_lead_replied",
    entityType: "ai_leads",
    entityId: leadId,
    summary: `Sent reply to AI chat lead ${lead.name || lead.email} (${lead.email}).`,
    metadata: { outcome: dispatch.outcome, provider: dispatch.result.provider },
  });

  if (dispatch.outcome === "sent" && lead.status === "new") {
    await admin.from("ai_leads").update({ status: "contacted" }).eq("id", leadId);
  }

  revalidatePath("/admin/ai-leads");
  revalidatePath("/admin");
  revalidatePath("/admin/outreach");
  revalidatePath("/admin/analytics");
  revalidatePath("/admin/audit");

  if (dispatch.outcome !== "sent") {
    throw new Error(
      dispatch.result.error || "The reply could not be delivered. Check outreach status.",
    );
  }
};
