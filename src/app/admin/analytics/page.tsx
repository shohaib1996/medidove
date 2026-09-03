import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminAnalyticsDashboard from "./AdminAnalyticsDashboard";

export const metadata = {
  title: "Analytics | MediDove Admin",
};

type CreatedRecord = {
  created_at: string;
};

type StatusRecord = CreatedRecord & {
  status: string | null;
};

type LeadRecord = StatusRecord & {
  ai_category: string | null;
  ai_urgency: string | null;
};

type ChatMessageRecord = CreatedRecord & {
  role: string;
  metadata: { intent?: string } | null;
};

type FeedbackRecord = StatusRecord & {
  rating: number;
  ai_sentiment: string;
  ai_urgency: string;
  category: string;
};

type ClinicalNoteRecord = StatusRecord & {
  risk_flags: string[];
};

type AutomationRuleRecord = CreatedRecord & {
  trigger_event: string;
  channel: string;
  is_active: boolean;
};

type OutboxRecord = StatusRecord & {
  channel: string;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));

const isToday = (value: string) =>
  new Date(value).toDateString() === new Date().toDateString();

const countBy = <T,>(items: T[], getKey: (item: T) => string | null | undefined) =>
  items.reduce<Record<string, number>>((totals, item) => {
    const key = getKey(item) || "unknown";
    totals[key] = (totals[key] || 0) + 1;
    return totals;
  }, {});

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/admin");
  }

  const [
    { data: appointmentsData },
    { data: leadsData },
    { data: callLogsData },
    { data: whatsAppData },
    { data: chatMessagesData },
    { data: feedbackData },
    { data: clinicalNotesData },
    { data: automationRulesData },
    { data: outboxData },
    { data: doctorsData },
    { data: availabilityData },
  ] = await Promise.all([
    supabase
      .from("appointments")
      .select("status, urgency, source_channel, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("contact_leads")
      .select("status, ai_category, ai_urgency, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("call_logs")
      .select("status, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("whatsapp_messages")
      .select("status, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("ai_chat_messages")
      .select("role, metadata, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("patient_feedback")
      .select("status, rating, ai_sentiment, ai_urgency, category, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("clinical_notes")
      .select("status, risk_flags, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("automation_rules")
      .select("trigger_event, channel, is_active, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("communication_outbox")
      .select("status, channel, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("doctors")
      .select("is_active, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("doctor_availability")
      .select("is_active, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const appointments = (appointmentsData || []) as (StatusRecord & {
    urgency: string | null;
    source_channel: string | null;
  })[];
  const leads = (leadsData || []) as LeadRecord[];
  const callLogs = (callLogsData || []) as StatusRecord[];
  const whatsAppMessages = (whatsAppData || []) as StatusRecord[];
  const chatMessages = (chatMessagesData || []) as ChatMessageRecord[];
  const feedback = (feedbackData || []) as FeedbackRecord[];
  const clinicalNotes = (clinicalNotesData || []) as ClinicalNoteRecord[];
  const automationRules = (automationRulesData || []) as AutomationRuleRecord[];
  const outbox = (outboxData || []) as OutboxRecord[];
  const doctors = (doctorsData || []) as (CreatedRecord & { is_active: boolean })[];
  const availability = (availabilityData || []) as (CreatedRecord & {
    is_active: boolean;
  })[];
  const assistantMessages = chatMessages.filter(
    (message) => message.role === "assistant",
  );

  const totalRecords =
    appointments.length +
    leads.length +
    callLogs.length +
    whatsAppMessages.length +
    feedback.length +
    clinicalNotes.length +
    outbox.length;
  const todayRecords = [
    ...appointments,
    ...leads,
    ...callLogs,
    ...whatsAppMessages,
    ...feedback,
    ...clinicalNotes,
    ...outbox,
  ].filter((record) => isToday(record.created_at)).length;
  const highUrgency =
    appointments.filter((appointment) => appointment.urgency === "high").length +
    leads.filter((lead) => lead.ai_urgency === "high").length +
    feedback.filter((item) => item.ai_urgency === "high").length;
  const averageRating =
    feedback.length > 0
      ? feedback.reduce((total, item) => total + item.rating, 0) / feedback.length
      : 0;
  const activeAutomations = automationRules.filter((rule) => rule.is_active).length;
  const activeDoctors = doctors.filter((doctor) => doctor.is_active).length;
  const activeAvailability = availability.filter((block) => block.is_active).length;
  const blockedOutbox = outbox.filter((item) => item.status === "blocked").length;
  const reviewedNotes = clinicalNotes.filter((note) => note.status === "reviewed").length;
  const flaggedNotes = clinicalNotes.filter(
    (note) => note.risk_flags.length > 0,
  ).length;

  const latestActivity = [
    ...appointments.map((record) => ({
      label: "Appointment request",
      created_at: record.created_at,
      status: record.status,
    })),
    ...leads.map((record) => ({
      label: "Contact lead",
      created_at: record.created_at,
      status: record.ai_urgency || record.status,
    })),
    ...callLogs.map((record) => ({
      label: "AI callback",
      created_at: record.created_at,
      status: record.status,
    })),
    ...whatsAppMessages.map((record) => ({
      label: "WhatsApp opt-in",
      created_at: record.created_at,
      status: record.status,
    })),
    ...feedback.map((record) => ({
      label: "Patient feedback",
      created_at: record.created_at,
      status: record.ai_sentiment,
    })),
    ...clinicalNotes.map((record) => ({
      label: "Clinical note",
      created_at: record.created_at,
      status: record.status,
    })),
    ...outbox.map((record) => ({
      label: "Outbox message",
      created_at: record.created_at,
      status: record.status,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 8);

  return (
    <AdminAnalyticsDashboard
      totalRecords={totalRecords}
      todayRecords={todayRecords}
      highUrgency={highUrgency}
      assistantMessagesCount={assistantMessages.length}
      engagementCount={callLogs.length + whatsAppMessages.length + outbox.length}
      averageRating={Number(averageRating.toFixed(1))}
      reviewedNotes={reviewedNotes}
      flaggedNotes={flaggedNotes}
      activeAutomations={activeAutomations}
      automationRulesCount={automationRules.length}
      activeDoctors={activeDoctors}
      activeAvailability={activeAvailability}
      blockedOutbox={blockedOutbox}
      appointmentsPending={appointments.filter((appointment) => appointment.status === "pending").length}
      newContactLeads={leads.filter((lead) => lead.status === "new").length}
      callbackRequests={callLogs.filter((callLog) => callLog.status === "requested").length}
      whatsAppOptIns={whatsAppMessages.filter((message) => message.status === "requested").length}
      appointmentStatusData={countBy(appointments, (appointment) => appointment.status)}
      leadCategoryData={countBy(leads, (lead) => lead.ai_category)}
      assistantIntentData={countBy(assistantMessages, (message) => message.metadata?.intent)}
      feedbackSentimentData={countBy(feedback, (item) => item.ai_sentiment)}
      outboxStatusData={countBy(outbox, (item) => item.status)}
      automationChannelData={countBy(automationRules, (rule) => rule.channel)}
      latestActivity={latestActivity}
      formatDate={formatDate}
    />
  );
}