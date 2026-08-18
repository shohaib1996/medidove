import { writeAuditLog } from "@/lib/audit/log";
import { createAdminClient } from "@/lib/supabase/admin";

type GeneratedTask = {
  sourceType: string;
  sourceId: string;
  patientId: string | null;
  title: string;
  description: string;
  priority: "high" | "urgent";
  dueAt: string;
};

const hoursFromNow = (hours: number) =>
  new Date(Date.now() + hours * 60 * 60_000).toISOString();

const hasTaskForSource = async (sourceType: string, sourceId: string) => {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("care_tasks")
    .select("id")
    .eq("source_type", sourceType)
    .eq("source_id", sourceId)
    .limit(1);

  return Boolean(data?.length);
};

export const generateCareTasksFromSignals = async (actorId?: string | null) => {
  const supabase = createAdminClient();
  const [
    { data: highLeads },
    { data: highFeedback },
    { data: flaggedNotes },
    { data: blockedOutbox },
  ] = await Promise.all([
    supabase
      .from("contact_leads")
      .select("id, name, email, phone, subject, ai_summary, ai_urgency, status")
      .eq("ai_urgency", "high")
      .in("status", ["new", "contacted"])
      .limit(50),
    supabase
      .from("patient_feedback")
      .select("id, patient_id, name, rating, category, ai_summary, ai_urgency, status")
      .eq("ai_urgency", "high")
      .in("status", ["new", "reviewing"])
      .limit(50),
    supabase
      .from("clinical_notes")
      .select("id, patient_id, patient_name, visit_type, risk_flags, status")
      .not("risk_flags", "eq", "{}")
      .in("status", ["draft", "reviewed"])
      .limit(50),
    supabase
      .from("communication_outbox")
      .select("id, patient_id, channel, recipient_name, recipient_phone, recipient_email, metadata")
      .eq("status", "blocked")
      .limit(50),
  ]);

  const candidates: GeneratedTask[] = [
    ...((highLeads || []).map((lead) => ({
      sourceType: "lead",
      sourceId: lead.id,
      patientId: null,
      title: `Review high urgency lead: ${lead.name}`,
      description:
        lead.ai_summary ||
        `High urgency lead from ${lead.email}${lead.phone ? `, ${lead.phone}` : ""}.`,
      priority: "high" as const,
      dueAt: hoursFromNow(4),
    })) || []),
    ...((highFeedback || []).map((feedback) => ({
      sourceType: "feedback",
      sourceId: feedback.id,
      patientId: feedback.patient_id,
      title: `Resolve urgent feedback: ${feedback.name}`,
      description:
        feedback.ai_summary ||
        `Patient gave ${feedback.rating}/5 feedback in ${feedback.category}.`,
      priority: "urgent" as const,
      dueAt: hoursFromNow(2),
    })) || []),
    ...((flaggedNotes || []).map((note) => ({
      sourceType: "clinical_note",
      sourceId: note.id,
      patientId: note.patient_id,
      title: `Review clinical risk flags: ${note.patient_name}`,
      description: `Visit type: ${note.visit_type}. Risk signals: ${note.risk_flags.join(", ")}.`,
      priority: "urgent" as const,
      dueAt: hoursFromNow(1),
    })) || []),
    ...((blockedOutbox || []).map((message) => ({
      sourceType: "communication_outbox",
      sourceId: message.id,
      patientId: message.patient_id,
      title: `Fix blocked ${message.channel} outreach`,
      description: `Consent or recipient data needs review for ${
        message.recipient_name ||
        message.recipient_phone ||
        message.recipient_email ||
        "recipient"
      }.`,
      priority: "high" as const,
      dueAt: hoursFromNow(6),
    })) || []),
  ];

  let created = 0;
  let skipped = 0;

  for (const candidate of candidates) {
    if (await hasTaskForSource(candidate.sourceType, candidate.sourceId)) {
      skipped += 1;
      continue;
    }

    const { error } = await supabase.from("care_tasks").insert({
      patient_id: candidate.patientId,
      source_type: candidate.sourceType,
      source_id: candidate.sourceId,
      title: candidate.title,
      description: candidate.description,
      priority: candidate.priority,
      due_at: candidate.dueAt,
      created_by: actorId || null,
      status: "open",
    });

    if (error) {
      skipped += 1;
    } else {
      created += 1;
    }
  }

  const summary = {
    ok: true,
    candidates: candidates.length,
    created,
    skipped,
  };

  await writeAuditLog(supabase, {
    actorId: actorId || null,
    actorType: actorId ? "admin" : "system",
    eventType: "care_tasks_generated",
    entityType: "care_tasks",
    summary: `Generated ${created} care tasks from ${candidates.length} AI signals.`,
    metadata: summary,
  });

  return summary;
};
