import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import AdminOverview from "./AdminOverview";
import AdminRecordLists from "./AdminRecordLists";
import type {
  AppointmentRow,
  CallLogRow,
  LeadRow,
  WhatsAppMessageRow,
} from "./dashboard-types";
import { getTodayCount } from "./dashboard-utils";

export const metadata = {
  title: "Admin Dashboard | MediDove",
};

const AccessRestricted = () => (
  <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardDescription>Admin Access</CardDescription>
        <CardTitle className="text-3xl">Access restricted</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-slate-600">
          Your account is signed in, but it does not have the admin role. Set
          this user role to admin in Supabase to view the dashboard.
        </p>
        <Button asChild>
          <Link href="/">Back to website</Link>
        </Button>
      </CardContent>
    </Card>
  </main>
);

const AdminHeader = () => (
  <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
    <div>
      <p className="text-xs font-bold uppercase text-primary">MediDove Admin</p>
      <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-900 md:text-4xl">
        Clinic Operations Dashboard
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Review patient appointment requests, contact leads, and AI receptionist
        callback requests captured from the public website.
      </p>
    </div>
  </section>
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
    return <AccessRestricted />;
  }

  const [
    { data: appointmentsData },
    { data: leadsData },
    { data: callLogsData },
    { data: whatsAppData },
  ] = await Promise.all([
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
        "id, name, email, phone, subject, message, ai_category, ai_summary, ai_urgency, ai_suggested_reply, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("call_logs")
      .select(
        "id, phone_number, direction, provider, transcript, ai_summary, status, started_at, ended_at, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("whatsapp_messages")
      .select("id, phone_number, direction, message, status, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const appointments = (appointmentsData || []) as AppointmentRow[];
  const leads = (leadsData || []) as LeadRow[];
  const callLogs = (callLogsData || []) as CallLogRow[];
  const whatsAppMessages = (whatsAppData || []) as WhatsAppMessageRow[];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <AdminHeader />
        <AdminOverview
          appointmentsCount={appointments.length}
          pendingAppointments={
            appointments.filter((appointment) => appointment.status === "pending")
              .length
          }
          whatsAppCount={whatsAppMessages.length}
          requestedWhatsApp={
            whatsAppMessages.filter((message) => message.status === "requested")
              .length
          }
          leadsCount={leads.length}
          newLeads={leads.filter((lead) => lead.status === "new").length}
          urgentLeads={
            leads.filter((lead) => lead.ai_urgency === "high").length
          }
          callLogsCount={callLogs.length}
          requestedCallbacks={
            callLogs.filter((callLog) => callLog.status === "requested").length
          }
          todayCount={getTodayCount([
            ...appointments,
            ...leads,
            ...callLogs,
            ...whatsAppMessages,
          ])}
        />
        <AdminRecordLists
          appointments={appointments}
          callLogs={callLogs}
          whatsAppMessages={whatsAppMessages}
          leads={leads}
        />
      </div>
    </main>
  );
};

export default AdminPage;
