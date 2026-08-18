import Link from "next/link";
import { redirect } from "next/navigation";
import { Activity, CalendarClock, Inbox, Stethoscope } from "lucide-react";
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
  title: "Admin Dashboard | MediDove",
};

type AppointmentRow = {
  id: string;
  patient_name: string;
  patient_email: string | null;
  patient_phone: string;
  requested_department: string | null;
  requested_doctor: string | null;
  requested_at: string | null;
  reason: string | null;
  urgency: string | null;
  status: string;
  source_channel: string;
  created_at: string;
};

type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  ai_category: string | null;
  status: string;
  created_at: string;
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

const getTodayCount = (items: { created_at: string }[]) => {
  const today = new Date().toDateString();

  return items.filter((item) => new Date(item.created_at).toDateString() === today)
    .length;
};

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) => (
  <div>
    <dt className="text-xs font-semibold uppercase text-slate-400">{label}</dt>
    <dd className="mt-1 break-words text-sm text-slate-700">
      {value || "Not provided"}
    </dd>
  </div>
);

const AdminPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardDescription>Admin Access</CardDescription>
            <CardTitle className="text-3xl">Access restricted</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-600">
              Your account is signed in, but it does not have the admin role.
              Set this user role to admin in Supabase to view the dashboard.
            </p>
            <Button asChild>
              <Link href="/">Back to website</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const [{ data: appointmentsData }, { data: leadsData }] = await Promise.all([
    supabase
      .from("appointments")
      .select(
        "id, patient_name, patient_email, patient_phone, requested_department, requested_doctor, requested_at, reason, urgency, status, source_channel, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("contact_leads")
      .select(
        "id, name, email, phone, subject, message, ai_category, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const appointments = (appointmentsData || []) as AppointmentRow[];
  const leads = (leadsData || []) as LeadRow[];
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending",
  ).length;
  const newLeads = leads.filter((lead) => lead.status === "new").length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase text-primary">
              MediDove Admin
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-900 md:text-4xl">
              Clinic Operations Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Review patient appointment requests and contact leads captured
              from the public website.
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/">View website</Link>
          </Button>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Total requests</CardDescription>
                <CardTitle className="mt-2 text-3xl">
                  {appointments.length}
                </CardTitle>
              </div>
              <CalendarClock className="size-8 text-primary" />
            </CardHeader>
            <CardContent className="text-sm text-slate-500">
              {pendingAppointments} pending appointments
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Contact leads</CardDescription>
                <CardTitle className="mt-2 text-3xl">{leads.length}</CardTitle>
              </div>
              <Inbox className="size-8 text-teal-600" />
            </CardHeader>
            <CardContent className="text-sm text-slate-500">
              {newLeads} new leads
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Today</CardDescription>
                <CardTitle className="mt-2 text-3xl">
                  {getTodayCount([...appointments, ...leads])}
                </CardTitle>
              </div>
              <Activity className="size-8 text-sky-600" />
            </CardHeader>
            <CardContent className="text-sm text-slate-500">
              new website submissions
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardDescription>Appointments</CardDescription>
              <CardTitle>Latest booking requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <article
                    key={appointment.id}
                    className="rounded-lg border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-semibold text-slate-900">
                          {appointment.patient_name}
                        </h2>
                        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                          {appointment.reason || "No reason provided."}
                        </p>
                      </div>
                      <Badge className="capitalize">{appointment.status}</Badge>
                    </div>
                    <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                      <DetailItem label="Phone" value={appointment.patient_phone} />
                      <DetailItem
                        label="Department"
                        value={appointment.requested_department || "Any"}
                      />
                      <DetailItem
                        label="Doctor"
                        value={appointment.requested_doctor || "Any"}
                      />
                      <DetailItem
                        label="Requested"
                        value={formatDate(appointment.requested_at)}
                      />
                    </dl>
                  </article>
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
                  <Stethoscope className="mx-auto mb-3 size-8" />
                  No appointment requests yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Leads</CardDescription>
              <CardTitle>Latest contact messages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <article
                    key={lead.id}
                    className="rounded-lg border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-semibold text-slate-900">
                          {lead.name}
                        </h2>
                        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                          {lead.message}
                        </p>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {lead.ai_category || lead.status}
                      </Badge>
                    </div>
                    <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                      <DetailItem label="Email" value={lead.email} />
                      <DetailItem label="Phone" value={lead.phone} />
                      <DetailItem
                        label="Subject"
                        value={lead.subject || "General"}
                      />
                      <DetailItem label="Created" value={formatDate(lead.created_at)} />
                    </dl>
                  </article>
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
                  <Inbox className="mx-auto mb-3 size-8" />
                  No contact leads yet.
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
};

export default AdminPage;
