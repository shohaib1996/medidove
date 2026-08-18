import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bot,
  CalendarClock,
  Headphones,
  Inbox,
  MessageCircle,
  TrendingUp,
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
  ]);

  const appointments = (appointmentsData || []) as (StatusRecord & {
    urgency: string | null;
    source_channel: string | null;
  })[];
  const leads = (leadsData || []) as LeadRecord[];
  const callLogs = (callLogsData || []) as StatusRecord[];
  const whatsAppMessages = (whatsAppData || []) as StatusRecord[];
  const chatMessages = (chatMessagesData || []) as ChatMessageRecord[];
  const assistantMessages = chatMessages.filter(
    (message) => message.role === "assistant",
  );

  const totalRecords =
    appointments.length + leads.length + callLogs.length + whatsAppMessages.length;
  const todayRecords = [
    ...appointments,
    ...leads,
    ...callLogs,
    ...whatsAppMessages,
  ].filter((record) => isToday(record.created_at)).length;
  const highUrgency =
    appointments.filter((appointment) => appointment.urgency === "high").length +
    leads.filter((lead) => lead.ai_urgency === "high").length;

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
            detail="appointments, leads, calls, and WhatsApp"
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
            detail="AI-flagged appointment or lead records"
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
            value={callLogs.length + whatsAppMessages.length}
            detail="voice and WhatsApp workflow records"
            icon={MessageCircle}
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
