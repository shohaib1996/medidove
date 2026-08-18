import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bot,
  CalendarClock,
  ClipboardPlus,
  ClipboardList,
  Headphones,
  Inbox,
  MessageCircle,
  ShieldCheck,
  Star,
  Stethoscope,
  TrendingUp,
  Workflow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

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

type CareTaskRecord = StatusRecord & {
  priority: string;
  source_type: string;
  due_at: string | null;
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

const getPercent = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 100) : 0;

const MetricCard = ({
  title,
  value,
  detail,
  icon: Icon,
}: {
  title: string;
  value: number;
  detail: string;
  icon: typeof Activity;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between gap-4">
      <div>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="mt-2 text-3xl">{value}</CardTitle>
      </div>
      <Icon className="size-8 text-primary" />
    </CardHeader>
    <CardContent className="text-sm text-slate-500">{detail}</CardContent>
  </Card>
);

const Breakdown = ({
  title,
  description,
  data,
}: {
  title: string;
  description: string;
  data: Record<string, number>;
}) => {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  const rows = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return (
    <Card>
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.length > 0 ? (
          rows.map(([label, value]) => (
            <div key={label}>
              <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                <span className="capitalize text-slate-700">
                  {label.replaceAll("_", " ")}
                </span>
                <span className="font-semibold text-slate-900">{value}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${getPercent(value, total)}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No data yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

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
    { data: careTasksData },
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
      .from("care_tasks")
      .select("status, priority, source_type, due_at, created_at")
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
  const careTasks = (careTasksData || []) as CareTaskRecord[];
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
    outbox.length +
    careTasks.length;
  const todayRecords = [
    ...appointments,
    ...leads,
    ...callLogs,
    ...whatsAppMessages,
    ...feedback,
    ...clinicalNotes,
    ...outbox,
    ...careTasks,
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
  const nowMs = new Date().getTime();
  const openCareTasks = careTasks.filter((task) => task.status === "open").length;
  const urgentCareTasks = careTasks.filter(
    (task) => task.priority === "urgent" || task.priority === "high",
  ).length;
  const overdueCareTasks = careTasks.filter(
    (task) =>
      task.due_at &&
      new Date(task.due_at).getTime() < nowMs &&
      task.status !== "done" &&
      task.status !== "cancelled",
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
    ...careTasks.map((record) => ({
      label: "Care task",
      created_at: record.created_at,
      status: record.priority,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 8);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase text-primary">
              Admin analytics
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">
              Clinic growth and AI workflow reporting
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Track the patient acquisition funnel across appointments, leads,
              AI receptionist callbacks, WhatsApp opt-ins, and assistant usage.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/admin/content">Manage content</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/admin">Back to dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            title="Total records"
            value={totalRecords}
            detail="patient workflow records across modules"
            icon={BarChart3}
          />
          <MetricCard
            title="Today"
            value={todayRecords}
            detail="new patient workflow records"
            icon={TrendingUp}
          />
          <MetricCard
            title="High urgency"
            value={highUrgency}
            detail="AI-flagged appointments, leads, or feedback"
            icon={Activity}
          />
          <MetricCard
            title="AI messages"
            value={assistantMessages.length}
            detail="assistant responses logged"
            icon={Bot}
          />
          <MetricCard
            title="Engagement"
            value={callLogs.length + whatsAppMessages.length + outbox.length}
            detail="voice, WhatsApp, and outbox records"
            icon={MessageCircle}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            title="Feedback rating"
            value={Number(averageRating.toFixed(1))}
            detail="average patient score"
            icon={Star}
          />
          <MetricCard
            title="Reviewed notes"
            value={reviewedNotes}
            detail={`${flaggedNotes} notes contain risk flags`}
            icon={ClipboardPlus}
          />
          <MetricCard
            title="Automations"
            value={activeAutomations}
            detail={`${automationRules.length} configured rules`}
            icon={Workflow}
          />
          <MetricCard
            title="Doctor coverage"
            value={activeDoctors}
            detail={`${activeAvailability} active schedule blocks`}
            icon={Stethoscope}
          />
          <MetricCard
            title="Consent blocks"
            value={blockedOutbox}
            detail="outbox messages blocked before dispatch"
            icon={ShieldCheck}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Open tasks"
            value={openCareTasks}
            detail={`${urgentCareTasks} high or urgent tasks`}
            icon={ClipboardList}
          />
          <MetricCard
            title="Overdue tasks"
            value={overdueCareTasks}
            detail="open tasks past due date"
            icon={CalendarClock}
          />
          <MetricCard
            title="Task volume"
            value={careTasks.length}
            detail="manual and AI-generated tasks"
            icon={Activity}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <Breakdown
            title="Appointment Status"
            description="Booking pipeline"
            data={countBy(appointments, (appointment) => appointment.status)}
          />
          <Breakdown
            title="Lead Categories"
            description="AI lead triage"
            data={countBy(leads, (lead) => lead.ai_category)}
          />
          <Breakdown
            title="Assistant Intents"
            description="Website assistant usage"
            data={countBy(
              assistantMessages,
              (message) => message.metadata?.intent,
            )}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <Breakdown
            title="Feedback Sentiment"
            description="AI experience triage"
            data={countBy(feedback, (item) => item.ai_sentiment)}
          />
          <Breakdown
            title="Outbox Status"
            description="Delivery and consent control"
            data={countBy(outbox, (item) => item.status)}
          />
          <Breakdown
            title="Automation Channels"
            description="Configured care automation"
            data={countBy(automationRules, (rule) => rule.channel)}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Breakdown
            title="Task Priority"
            description="Care coordination workload"
            data={countBy(careTasks, (task) => task.priority)}
          />
          <Breakdown
            title="Task Sources"
            description="Where staff work originates"
            data={countBy(careTasks, (task) => task.source_type)}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardDescription>Channel queue</CardDescription>
              <CardTitle>Open engagement work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "Appointments pending",
                  value: appointments.filter(
                    (appointment) => appointment.status === "pending",
                  ).length,
                  icon: CalendarClock,
                },
                {
                  label: "New contact leads",
                  value: leads.filter((lead) => lead.status === "new").length,
                  icon: Inbox,
                },
                {
                  label: "Callback requests",
                  value: callLogs.filter((callLog) => callLog.status === "requested")
                    .length,
                  icon: Headphones,
                },
                {
                  label: "WhatsApp opt-ins",
                  value: whatsAppMessages.filter(
                    (message) => message.status === "requested",
                  ).length,
                  icon: MessageCircle,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="size-5 text-primary" />
                    <span className="font-medium text-slate-700">
                      {item.label}
                    </span>
                  </div>
                  <Badge variant="secondary">{item.value}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Recent funnel events</CardDescription>
              <CardTitle>Latest activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {latestActivity.length > 0 ? (
                latestActivity.map((item) => (
                  <div
                    key={`${item.label}-${item.created_at}`}
                    className="flex flex-col justify-between gap-2 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                    <Badge className="capitalize" variant="outline">
                      {item.status || "new"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                  No activity yet.
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
