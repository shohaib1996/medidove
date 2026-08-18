import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarCheck,
  CalendarClock,
  CircleAlert,
  Filter,
  UserRoundCheck,
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
import { updateAdminRecordStatus } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Appointments | MediDove Admin",
};

type AppointmentStatus =
  | "all"
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rescheduled";

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

const statuses: AppointmentStatus[] = [
  "all",
  "pending",
  "confirmed",
  "rescheduled",
  "completed",
  "cancelled",
];

const formatDate = (value: string | null) => {
  if (!value) {
    return "Not selected";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const StatusAction = ({
  id,
  status,
  label,
}: {
  id: string;
  status: Exclude<AppointmentStatus, "all">;
  label: string;
}) => (
  <form action={updateAdminRecordStatus}>
    <input type="hidden" name="table" value="appointments" />
    <input type="hidden" name="id" value={id} />
    <input type="hidden" name="status" value={status} />
    <Button type="submit" variant="outline" size="sm">
      {label}
    </Button>
  </form>
);

const normalizeStatus = (
  value: string | string[] | undefined,
): AppointmentStatus => {
  const status = Array.isArray(value) ? value[0] : value;

  return statuses.includes(status as AppointmentStatus)
    ? (status as AppointmentStatus)
    : "all";
};

const AdminAppointmentsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>;
}) => {
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
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <Card className="mx-auto max-w-xl">
          <CardHeader>
            <CardTitle>Admin access required</CardTitle>
            <CardDescription>
              Appointment operations are available only to admin users.
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

  const params = await searchParams;
  const activeStatus = normalizeStatus(params.status);
  const appointmentQuery = supabase
    .from("appointments")
    .select(
      "id, patient_name, patient_email, patient_phone, requested_department, requested_doctor, requested_at, reason, urgency, status, source_channel, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(80);

  if (activeStatus !== "all") {
    appointmentQuery.eq("status", activeStatus);
  }

  const { data: appointmentsData } = await appointmentQuery;
  const appointments = (appointmentsData || []) as AppointmentRow[];
  const pending = appointments.filter(
    (appointment) => appointment.status === "pending",
  ).length;
  const confirmed = appointments.filter(
    (appointment) => appointment.status === "confirmed",
  ).length;
  const completed = appointments.filter(
    (appointment) => appointment.status === "completed",
  ).length;
  const urgent = appointments.filter(
    (appointment) => appointment.urgency === "high",
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="flex flex-col justify-between gap-4 rounded-lg border bg-white p-6 shadow-sm lg:flex-row lg:items-center">
          <div>
            <Badge variant="secondary">Appointment Desk</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Appointment operations
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Review incoming appointment requests, confirm visits, and keep the
              clinic schedule moving from one admin queue.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/appointment">Public booking</Link>
            </Button>
            <Button asChild>
              <Link href="/admin">Back to dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Visible Queue</CardTitle>
              <CalendarClock className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{appointments.length}</p>
              <p className="text-xs text-slate-500">Matching current filter</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <CircleAlert className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{pending}</p>
              <p className="text-xs text-slate-500">Need staff confirmation</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <UserRoundCheck className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{confirmed}</p>
              <p className="text-xs text-slate-500">Ready for visit</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CalendarCheck className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{completed}</p>
              <p className="text-xs text-slate-500">{urgent} high urgency items</p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Appointment queue</CardTitle>
                <CardDescription>
                  Filter by status and update appointment progress.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Filter className="h-4 w-4" />
                  Status
                </span>
                {statuses.map((status) => (
                  <Button
                    asChild
                    key={status}
                    size="sm"
                    variant={status === activeStatus ? "default" : "outline"}
                  >
                    <Link href={`/admin/appointments?status=${status}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {appointments.length > 0 ? (
              <div className="grid gap-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="rounded-md border p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-semibold">
                            {appointment.patient_name}
                          </h2>
                          <Badge variant="outline">{appointment.status}</Badge>
                          {appointment.urgency ? (
                            <Badge
                              variant={
                                appointment.urgency === "high"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {appointment.urgency} urgency
                            </Badge>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          Requested {formatDate(appointment.created_at)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {appointment.status !== "confirmed" ? (
                          <StatusAction
                            id={appointment.id}
                            status="confirmed"
                            label="Confirm"
                          />
                        ) : null}
                        {appointment.status !== "rescheduled" ? (
                          <StatusAction
                            id={appointment.id}
                            status="rescheduled"
                            label="Reschedule"
                          />
                        ) : null}
                        {appointment.status !== "completed" ? (
                          <StatusAction
                            id={appointment.id}
                            status="completed"
                            label="Complete"
                          />
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Requested date
                        </p>
                        <p className="mt-1">{formatDate(appointment.requested_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Department
                        </p>
                        <p className="mt-1">
                          {appointment.requested_department || "General care"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Doctor
                        </p>
                        <p className="mt-1">
                          {appointment.requested_doctor || "No preference"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Contact
                        </p>
                        <p className="mt-1 break-words">
                          {appointment.patient_phone}
                        </p>
                        <p className="break-words">
                          {appointment.patient_email || "No email"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
                      {appointment.reason || "No patient reason was provided."}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600">
                No appointments match this filter yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AdminAppointmentsPage;
