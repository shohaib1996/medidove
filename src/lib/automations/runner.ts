import { createAdminClient } from "@/lib/supabase/admin";
import { writeAuditLog } from "@/lib/audit/log";
import type { Channel } from "@/lib/supabase/database.types";

type AutomationRule = {
  id: string;
  name: string;
  trigger_event: string;
  channel: Channel;
  audience: string;
  delay_minutes: number;
  template_id: string | null;
  instructions: string;
};

type MessageTemplate = {
  id: string;
  name: string;
  body: string;
  channel: Channel;
};

type AppointmentSource = {
  id: string;
  patient_id: string | null;
  patient_name: string;
  patient_email: string | null;
  patient_phone: string;
  requested_department: string | null;
  requested_doctor: string | null;
  requested_at: string | null;
  reason: string | null;
  status: string;
  created_at: string;
};

type LeadSource = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  ai_summary: string | null;
  ai_urgency: string | null;
  status: string;
  created_at: string;
};

type ProfileSource = {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
};

type QueueSource =
  | { kind: "appointment"; record: AppointmentSource }
  | { kind: "lead"; record: LeadSource }
  | { kind: "profile"; record: ProfileSource };

type QueueResult = {
  ruleId: string;
  ruleName: string;
  matched: number;
  queued: number;
  skipped: number;
};

const providerForChannel = (channel: Channel) => {
  if (channel === "voice") {
    return "elevenlabs";
  }

  if (channel === "whatsapp" || channel === "sms") {
    return "twilio";
  }

  return "manual_email";
};

const addMinutes = (date: Date, minutes: number) =>
  new Date(date.getTime() + minutes * 60_000).toISOString();

const replaceVariables = (value: string, variables: Record<string, string>) =>
  Object.entries(variables).reduce(
    (message, [key, replacement]) =>
      message.replaceAll(`{{${key}}}`, replacement || ""),
    value,
  );

const buildVariables = (source: QueueSource): Record<string, string> => {
  if (source.kind === "appointment") {
    const appointment = source.record;

    return {
      patient_name: appointment.patient_name,
      patient_email: appointment.patient_email || "",
      patient_phone: appointment.patient_phone,
      department: appointment.requested_department || "general care",
      doctor: appointment.requested_doctor || "your care team",
      appointment_time: appointment.requested_at || "",
      reason: appointment.reason || "",
    };
  }

  if (source.kind === "lead") {
    const lead = source.record;

    return {
      patient_name: lead.name,
      patient_email: lead.email,
      patient_phone: lead.phone || "",
      subject: lead.subject || "your inquiry",
      message: lead.message,
      ai_summary: lead.ai_summary || "",
    };
  }

  return {
    patient_name: source.record.full_name || "there",
    patient_email: "",
    patient_phone: source.record.phone || "",
  };
};

const getRecipient = (source: QueueSource) => {
  if (source.kind === "appointment") {
    return {
      patientId: source.record.patient_id,
      name: source.record.patient_name,
      email: source.record.patient_email,
      phone: source.record.patient_phone,
    };
  }

  if (source.kind === "lead") {
    return {
      patientId: null,
      name: source.record.name,
      email: source.record.email,
      phone: source.record.phone,
    };
  }

  return {
    patientId: source.record.id,
    name: source.record.full_name,
    email: null,
    phone: source.record.phone,
  };
};

const hasRequiredRecipient = (channel: Channel, source: QueueSource) => {
  const recipient = getRecipient(source);

  if (channel === "email") {
    return Boolean(recipient.email);
  }

  return Boolean(recipient.phone);
};

export const runAutomationRules = async () => {
  const supabase = createAdminClient();
  const now = new Date();
  const inTwoDays = new Date(now.getTime() + 48 * 60 * 60_000).toISOString();

  const [{ data: rulesData }, { data: templatesData }] = await Promise.all([
    supabase
      .from("automation_rules")
      .select(
        "id, name, trigger_event, channel, audience, delay_minutes, template_id, instructions",
      )
      .eq("is_active", true),
    supabase
      .from("message_templates")
      .select("id, name, body, channel")
      .eq("is_active", true),
  ]);

  const rules = (rulesData || []) as AutomationRule[];
  const templates = (templatesData || []) as MessageTemplate[];
  const templateById = new Map(templates.map((template) => [template.id, template]));
  const results: QueueResult[] = [];

  for (const rule of rules) {
    const sources = await getSourcesForRule(rule.trigger_event, inTwoDays);
    let queued = 0;
    let skipped = 0;

    for (const source of sources) {
      if (!hasRequiredRecipient(rule.channel, source)) {
        skipped += 1;
        continue;
      }

      const metadata = {
        queued_from: "automation_runner",
        automation_rule_id: rule.id,
        automation_rule_name: rule.name,
        source_kind: source.kind,
        source_id: source.record.id,
        trigger_event: rule.trigger_event,
      };

      const { data: duplicate } = await supabase
        .from("communication_outbox")
        .select("id")
        .contains("metadata", {
          automation_rule_id: rule.id,
          source_id: source.record.id,
        })
        .limit(1);

      if (duplicate && duplicate.length > 0) {
        skipped += 1;
        continue;
      }

      const template = rule.template_id ? templateById.get(rule.template_id) : null;
      const variables = buildVariables(source);
      const recipient = getRecipient(source);
      const message = replaceVariables(
        template?.body || rule.instructions,
        variables,
      );

      const { error } = await supabase.from("communication_outbox").insert({
        template_id: template?.id || null,
        patient_id: recipient.patientId,
        channel: rule.channel,
        recipient_name: recipient.name,
        recipient_phone: recipient.phone,
        recipient_email: recipient.email,
        subject:
          rule.channel === "email"
            ? `${rule.name} - MediDove`
            : null,
        message,
        status: "queued",
        provider: providerForChannel(rule.channel),
        scheduled_for: addMinutes(now, rule.delay_minutes),
        metadata,
      });

      if (error) {
        skipped += 1;
        continue;
      }

      queued += 1;
    }

    results.push({
      ruleId: rule.id,
      ruleName: rule.name,
      matched: sources.length,
      queued,
      skipped,
    });
  }

  const summary = {
    ok: true,
    rules: results.length,
    queued: results.reduce((total, result) => total + result.queued, 0),
    skipped: results.reduce((total, result) => total + result.skipped, 0),
    results,
  };

  await writeAuditLog(supabase, {
    actorType: "system",
    eventType: "automation_runner_executed",
    entityType: "automation_rules",
    summary: `Automation runner processed ${summary.rules} rules and queued ${summary.queued} messages.`,
    metadata: summary,
  });

  return summary;
};

const getSourcesForRule = async (
  triggerEvent: string,
  reminderWindowEnd: string,
): Promise<QueueSource[]> => {
  const supabase = createAdminClient();

  if (
    [
      "appointment_created",
      "appointment_confirmed",
      "appointment_reminder",
      "missed_appointment",
      "post_visit_follow_up",
    ].includes(triggerEvent)
  ) {
    let query = supabase
      .from("appointments")
      .select(
        "id, patient_id, patient_name, patient_email, patient_phone, requested_department, requested_doctor, requested_at, reason, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (triggerEvent === "appointment_created") {
      query = query.eq("status", "pending");
    }

    if (
      triggerEvent === "appointment_confirmed" ||
      triggerEvent === "appointment_reminder"
    ) {
      query = query.eq("status", "confirmed");
    }

    if (triggerEvent === "appointment_reminder") {
      query = query
        .gte("requested_at", new Date().toISOString())
        .lte("requested_at", reminderWindowEnd);
    }

    if (triggerEvent === "missed_appointment") {
      query = query.lt("requested_at", new Date().toISOString()).neq("status", "completed");
    }

    if (triggerEvent === "post_visit_follow_up") {
      query = query.eq("status", "completed");
    }

    const { data } = await query;

    return ((data || []) as AppointmentSource[]).map((record) => ({
      kind: "appointment",
      record,
    }));
  }

  if (triggerEvent === "lead_created" || triggerEvent === "lead_high_urgency") {
    let query = supabase
      .from("contact_leads")
      .select(
        "id, name, email, phone, subject, message, ai_summary, ai_urgency, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (triggerEvent === "lead_high_urgency") {
      query = query.eq("ai_urgency", "high");
    } else {
      query = query.eq("status", "new");
    }

    const { data } = await query;

    return ((data || []) as LeadSource[]).map((record) => ({
      kind: "lead",
      record,
    }));
  }

  if (triggerEvent === "recall_due") {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, phone, created_at")
      .eq("role", "patient")
      .not("phone", "is", null)
      .order("created_at", { ascending: true })
      .limit(100);

    return ((data || []) as ProfileSource[]).map((record) => ({
      kind: "profile",
      record,
    }));
  }

  return [];
};
