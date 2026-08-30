import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarClock,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  UserRound,
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
  title: "Patient CRM | MediDove",
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
};

type AppointmentRow = {
  id: string;
  patient_id: string | null;
  patient_name: string;
  patient_email: string | null;
  patient_phone: string;
  requested_department: string | null;
  status: string;
  urgency: string | null;
  created_at: string;
};

type ConsentRow = {
  id: string;
  patient_id: string | null;
  phone: string | null;
  email: string | null;
  channel: string;
  consented: boolean;
  created_at: string;
};

type OutboxRow = {
  id: string;
  patient_id: string | null;
  recipient_name: string | null;
  recipient_phone: string | null;
  recipient_email: string | null;
  channel: string;
  status: string;
  created_at: string;
};

const formatDate = (value: string | null) => {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const uniqueCount = (items: string[]) => new Set(items.filter(Boolean)).size;

const AdminPatientsPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (adminProfile?.role !== "admin") {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <Card className="mx-auto max-w-xl">
          <CardHeader>
            <CardTitle>Admin access required</CardTitle>
            <CardDescription>
              Patient CRM data is available only to admin users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">Return home</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const [
    { data: profilesData },
    { data: appointmentsData },
    { data: consentsData },
    { data: outboxData },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, phone, role, created_at")
      .order("created_at", { ascending: false })
      .limit(40),
    supabase
      .from("appointments")
      .select(
        "id, patient_id, patient_name, patient_email, patient_phone, requested_department, status, urgency, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("consent_logs")
      .select("id, patient_id, phone, email, channel, consented, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("communication_outbox")
      .select(
        "id, patient_id, recipient_name, recipient_phone, recipient_email, channel, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const profiles = (profilesData || []) as ProfileRow[];
  const appointments = (appointmentsData || []) as AppointmentRow[];
  const consents = (consentsData || []) as ConsentRow[];
  const outbox = (outboxData || []) as OutboxRow[];

  const patientSummaries = profiles.map((profile) => {
    const patientAppointments = appointments.filter(
      (appointment) => appointment.patient_id === profile.id,
    );
    const patientConsents = consents.filter(
      (consent) => consent.patient_id === profile.id,
    );
    const patientOutbox = outbox.filter((message) => message.patient_id === profile.id);
    const latestAppointment = patientAppointments[0];
    const latestOutreach = patientOutbox[0];
    const consentedChannels = patientConsents
      .filter((consent) => consent.consented)
      .map((consent) => consent.channel);

    return {
      profile,
      appointments: patientAppointments,
      consents: patientConsents,
      outbox: patientOutbox,
      latestAppointment,
      latestOutreach,
      consentedChannels,
    };
  });

  const unlinkedAppointments = appointments.filter((appointment) => !appointment.patient_id);
  const queuedOutreach = outbox.filter((message) => message.status === "queued").length;
  const activeConsents = consents.filter((consent) => consent.consented).length;
  const linkedAppointmentCount = appointments.filter(
    (appointment) => appointment.patient_id,
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="flex flex-col justify-between gap-4 rounded-lg border bg-white p-6 shadow-sm lg:flex-row lg:items-center">
          <div>
            <Badge variant="secondary">Patient CRM</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Patient relationship center
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              View registered patients, appointment history, consent status, and
              marketing outreach from one admin workspace.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/admin/outreach">Create outreach</Link>
            </Button>
            <Button asChild>
              <Link href="/admin">Back to dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Profiles</CardTitle>
              <UserRound className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{profiles.length}</p>
              <p className="text-xs text-slate-500">Registered portal users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <CalendarClock className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{linkedAppointmentCount}</p>
              <p className="text-xs text-slate-500">Linked to patient accounts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Active Consents</CardTitle>
              <ShieldCheck className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{activeConsents}</p>
              <p className="text-xs text-slate-500">Marketing permissions recorded</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Queued Outreach</CardTitle>
              <MessageCircle className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{queuedOutreach}</p>
              <p className="text-xs text-slate-500">Messages waiting for delivery</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {patientSummaries.map((summary) => (
            <Card key={summary.profile.id}>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {summary.profile.full_name || "Unnamed patient"}
                    </CardTitle>
                    <CardDescription>
                      Joined {formatDate(summary.profile.created_at)}
                    </CardDescription>
                  </div>
                  <Badge variant={summary.profile.role === "admin" ? "secondary" : "outline"}>
                    {summary.profile.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-4 w-4" />
                    <span className="wrap-break-word">
                      {summary.profile.phone || "No phone on profile"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-4 w-4" />
                    <span>{summary.latestAppointment?.patient_email || "Email via booking"}</span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-md border p-3">
                    <p className="text-xs font-medium uppercase text-slate-400">Appointments</p>
                    <p className="mt-1 text-2xl font-semibold">
                      {summary.appointments.length}
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-xs font-medium uppercase text-slate-400">Consents</p>
                    <p className="mt-1 text-2xl font-semibold">
                      {uniqueCount(summary.consentedChannels)}
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-xs font-medium uppercase text-slate-400">Outreach</p>
                    <p className="mt-1 text-2xl font-semibold">{summary.outbox.length}</p>
                  </div>
                </div>

                <div className="space-y-3 rounded-md bg-slate-50 p-4 text-sm">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-medium text-slate-700">Latest appointment</span>
                    <Badge variant="outline">
                      {summary.latestAppointment?.status || "No appointment"}
                    </Badge>
                  </div>
                  <p className="text-slate-600">
                    {summary.latestAppointment
                      ? `${summary.latestAppointment.requested_department || "General care"} - ${formatDate(summary.latestAppointment.created_at)}`
                      : "No linked appointment history yet."}
                  </p>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-medium text-slate-700">Latest outreach</span>
                    <Badge variant="secondary">
                      {summary.latestOutreach?.status || "None"}
                    </Badge>
                  </div>
                  <p className="text-slate-600">
                    {summary.latestOutreach
                      ? `${summary.latestOutreach.channel} - ${formatDate(summary.latestOutreach.created_at)}`
                      : "No outreach queued for this patient."}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Unlinked patient activity</CardTitle>
            <CardDescription>
              Public booking records that are not attached to a portal account yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {unlinkedAppointments.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {unlinkedAppointments.slice(0, 8).map((appointment) => (
                  <div key={appointment.id} className="rounded-md border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{appointment.patient_name}</p>
                        <p className="text-sm text-slate-500">
                          {appointment.requested_department || "General care"}
                        </p>
                      </div>
                      <Badge variant="outline">{appointment.status}</Badge>
                    </div>
                    <div className="mt-3 space-y-1 text-sm text-slate-600">
                      <p>{appointment.patient_phone}</p>
                      <p>{appointment.patient_email || "No email provided"}</p>
                      <p>{formatDate(appointment.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600">
                All recent appointment records are linked to patient profiles.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AdminPatientsPage;
