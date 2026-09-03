import Link from "next/link";
import {
  Activity,
  BarChart3,
  Bot,
  CalendarClock,
  ClipboardPlus,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breakdown, MetricCard } from "./AnalyticsCards";

type LatestActivity = {
  label: string;
  created_at: string;
  status: string | null;
};

type AdminAnalyticsDashboardProps = {
  totalRecords: number;
  todayRecords: number;
  highUrgency: number;
  assistantMessagesCount: number;
  engagementCount: number;
  averageRating: number;
  reviewedNotes: number;
  flaggedNotes: number;
  activeAutomations: number;
  automationRulesCount: number;
  activeDoctors: number;
  activeAvailability: number;
  blockedOutbox: number;
  appointmentsPending: number;
  newContactLeads: number;
  callbackRequests: number;
  whatsAppOptIns: number;
  appointmentStatusData: Record<string, number>;
  leadCategoryData: Record<string, number>;
  assistantIntentData: Record<string, number>;
  feedbackSentimentData: Record<string, number>;
  outboxStatusData: Record<string, number>;
  automationChannelData: Record<string, number>;
  latestActivity: LatestActivity[];
  formatDate: (value: string) => string;
};

const AdminAnalyticsDashboard = ({
  totalRecords,
  todayRecords,
  highUrgency,
  assistantMessagesCount,
  engagementCount,
  averageRating,
  reviewedNotes,
  flaggedNotes,
  activeAutomations,
  automationRulesCount,
  activeDoctors,
  activeAvailability,
  blockedOutbox,
  appointmentsPending,
  newContactLeads,
  callbackRequests,
  whatsAppOptIns,
  appointmentStatusData,
  leadCategoryData,
  assistantIntentData,
  feedbackSentimentData,
  outboxStatusData,
  automationChannelData,
  latestActivity,
  formatDate,
}: AdminAnalyticsDashboardProps) => (
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
            value={assistantMessagesCount}
            detail="assistant responses logged"
            icon={Bot}
          />
          <MetricCard
            title="Engagement"
            value={engagementCount}
            detail="voice, WhatsApp, and outbox records"
            icon={MessageCircle}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            title="Feedback rating"
            value={averageRating}
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
            detail={`${automationRulesCount} configured rules`}
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

        <section className="grid gap-6 xl:grid-cols-3">
          <Breakdown
            title="Appointment Status"
            description="Booking pipeline"
            data={appointmentStatusData}
          />
          <Breakdown
            title="Lead Categories"
            description="AI lead triage"
            data={leadCategoryData}
          />
          <Breakdown
            title="Assistant Intents"
            description="Website assistant usage"
            data={assistantIntentData}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <Breakdown
            title="Feedback Sentiment"
            description="AI experience triage"
            data={feedbackSentimentData}
          />
          <Breakdown
            title="Outbox Status"
            description="Delivery and consent control"
            data={outboxStatusData}
          />
          <Breakdown
            title="Automation Channels"
            description="Configured care automation"
            data={automationChannelData}
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
                  value: appointmentsPending,
                  icon: CalendarClock,
                },
                {
                  label: "New contact leads",
                  value: newContactLeads,
                  icon: Inbox,
                },
                {
                  label: "Callback requests",
                  value: callbackRequests,
                  icon: Headphones,
                },
                {
                  label: "WhatsApp opt-ins",
                  value: whatsAppOptIns,
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

export default AdminAnalyticsDashboard;
