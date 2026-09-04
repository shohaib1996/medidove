import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarClock,
  FileText,
  MessageCircle,
  Send,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import PortalHeader from "@/components/portal/PortalHeader";
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
  title: "Health Timeline | MediDove",
};

type AppointmentRow = {
  id: string;
  requested_department: string | null;
  requested_doctor: string | null;
  requested_at: string | null;
  reason: string | null;
  ai_summary: string | null;
  status: string;
  created_at: string;
};

type ConsentRow = {
  id: string;
  channel: string;
  consented: boolean;
  reason: string | null;
  created_at: string;
};

type OutboxRow = {
  id: string;
  channel: string;
  subject: string | null;
  message: string;
  status: string;
  sent_at: string | null;
  created_at: string;
};

type TimelineItem = {
  id: string;
  type: "appointment" | "consent" | "message";
  title: string;
  description: string;
  date: string;
  status: string;
};

const formatDate = (value: string | null) => {
  if (!value) {
    return "Not selected";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const itemIcon = (type: TimelineItem["type"]) => {
  if (type === "appointment") {
    return <CalendarClock className="h-5 w-5 text-primary" />;
  }

  if (type === "consent") {
    return <ShieldCheck className="h-5 w-5 text-primary" />;
  }

  return <Send className="h-5 w-5 text-primary" />;
};

export default async function PatientTimelinePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    { data: profile },
    { data: appointmentsData },
    { data: consentsData },
    { data: outboxData },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .single(),
    supabase
      .from("appointments")
      .select(
        "id, requested_department, requested_doctor, requested_at, reason, ai_summary, status, created_at",
      )
      .eq("patient_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("consent_logs")
      .select("id, channel, consented, reason, created_at")
      .eq("patient_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("communication_outbox")
      .select("id, channel, subject, message, status, sent_at, created_at")
      .eq("patient_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const appointments = (appointmentsData || []) as AppointmentRow[];
  const consents = (consentsData || []) as ConsentRow[];
  const outbox = (outboxData || []) as OutboxRow[];
  const timeline: TimelineItem[] = [
    ...appointments.map((appointment) => ({
      id: appointment.id,
      type: "appointment" as const,
      title: appointment.requested_department || "Appointment request",
      description:
        appointment.ai_summary ||
        appointment.reason ||
        `Requested with ${appointment.requested_doctor || "the care team"}.`,
      date: appointment.created_at,
      status: appointment.status,
    })),
    ...consents.map((consent) => ({
      id: consent.id,
      type: "consent" as const,
      title: `${consent.channel} consent`,
      description:
        consent.reason ||
        (consent.consented
          ? "You allowed this communication channel."
          : "You opted out of this communication channel."),
      date: consent.created_at,
      status: consent.consented ? "active" : "revoked",
    })),
    ...outbox.map((message) => ({
      id: message.id,
      type: "message" as const,
      title: message.subject || `${message.channel} message`,
      description: message.message,
      date: message.sent_at || message.created_at,
      status: message.status,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PortalHeader />

      <main>
        <section className="border-b border-slate-200 bg-white px-4 py-10 md:px-8">
          <div className="mx-auto max-w-7xl">
            <Badge className="mb-4">
              <Stethoscope className="h-3.5 w-3.5" />
              Health timeline
            </Badge>
            <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-normal md:text-4xl">
              Your care history in one secure view
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Review appointments, reviewed clinical notes, consent changes,
              and patient communication history.
            </p>
          </div>
        </section>

        <section className="px-4 py-10 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Patient</CardDescription>
                <CardTitle className="text-xl">
                  {profile?.full_name || user.email}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-500">
                {profile?.phone || "Phone not added"}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Appointments</CardDescription>
                <CardTitle className="text-3xl">{appointments.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Messages</CardDescription>
                <CardTitle className="text-3xl">{outbox.length}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="px-4 pb-16 md:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase text-primary">
                  Timeline
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-normal">
                  Recent care activity
                </h2>
              </div>
              <Button asChild variant="outline">
                <Link href="/portal/consents">
                  <MessageCircle className="h-4 w-4" />
                  Consent center
                </Link>
              </Button>
            </div>

            {timeline.length > 0 ? (
              <div className="space-y-4">
                {timeline.map((item) => (
                  <Card key={`${item.type}-${item.id}`}>
                    <CardContent className="flex gap-4 p-5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/10">
                        {itemIcon(item.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="font-semibold">{item.title}</p>
                            <p className="mt-1 text-sm text-slate-500">
                              {formatDate(item.date)}
                            </p>
                          </div>
                          <Badge variant="secondary" className="capitalize">
                            {item.status}
                          </Badge>
                        </div>
                        <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-700">
                          {item.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-14 text-center text-slate-500">
                  <FileText className="mx-auto mb-3 h-9 w-9" />
                  No timeline activity is available yet.
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
