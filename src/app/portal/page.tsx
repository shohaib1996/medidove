import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  MessageCircle,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "./actions";

export const metadata = {
  title: "Patient Portal | MediDove",
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
  ai_summary: string | null;
  urgency: string | null;
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

const getInitials = (value: string) => {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "P";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
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
    <dd className="mt-1 wrap-break-word text-sm text-slate-700">
      {value || "Not provided"}
    </dd>
  </div>
);

const StatCard = ({
  label,
  value,
  description,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClassName: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between gap-4">
      <div>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="mt-2 text-3xl">{value}</CardTitle>
      </div>
      <div
        className={`flex size-11 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
      >
        <Icon className="size-5" />
      </div>
    </CardHeader>
    <CardContent className="text-sm text-slate-500">{description}</CardContent>
  </Card>
);

export default async function PatientPortalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: profile }, { data: appointmentsData }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, phone, role, created_at")
      .eq("id", user.id)
      .single(),
    supabase
      .from("appointments")
      .select(
        "id, patient_name, patient_email, patient_phone, requested_department, requested_doctor, requested_at, reason, ai_summary, urgency, status, created_at",
      )
      .eq("patient_id", user.id)
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  const appointments = (appointmentsData || []) as AppointmentRow[];
  const pendingCount = appointments.filter(
    (appointment) => appointment.status === "pending",
  ).length;
  const confirmedCount = appointments.filter(
    (appointment) => appointment.status === "confirmed",
  ).length;

  const displayName = profile?.full_name || user.email || "there";
  const firstName = displayName.split(" ")[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PortalHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase text-primary">
              Patient portal
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-normal md:text-3xl">
              Welcome back, {firstName}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Here is a quick look at your appointments and account.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/appointment">
              <CalendarClock />
              New appointment
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total requests"
            value={appointments.length}
            description="all appointment requests"
            icon={Stethoscope}
            iconClassName="bg-slate-100 text-slate-600"
          />
          <StatCard
            label="Pending"
            value={pendingCount}
            description="waiting for clinic review"
            icon={Clock}
            iconClassName="bg-amber-50 text-amber-600"
          />
          <StatCard
            label="Confirmed"
            value={confirmedCount}
            description="approved by admin"
            icon={CheckCircle2}
            iconClassName="bg-teal-50 text-teal-600"
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {getInitials(displayName)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{displayName}</p>
                    <p className="truncate text-sm text-slate-500">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="mt-4 capitalize">
                  {profile?.role || "patient"}
                </Badge>

                <form
                  action={updateProfile}
                  className="mt-5 space-y-4 border-t border-slate-100 pt-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      defaultValue={profile?.full_name || ""}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      defaultValue={profile?.phone || ""}
                      placeholder="+1 555 0100"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    Save profile
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Quick links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <Link
                  href="/portal/timeline"
                  className="flex items-center gap-3 rounded-md p-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <FileText className="size-4 text-primary" />
                  Health timeline
                </Link>
                <Link
                  href="/portal/consents"
                  className="flex items-center gap-3 rounded-md p-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <MessageCircle className="size-4 text-primary" />
                  Consent center
                </Link>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold tracking-normal">
                My appointments
              </h2>
            </div>

            {appointments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {appointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardDescription>
                            {formatDate(appointment.created_at)}
                          </CardDescription>
                          <CardTitle className="mt-2 text-xl">
                            {appointment.requested_department || "General visit"}
                          </CardTitle>
                        </div>
                        <Badge className="capitalize">{appointment.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                        {appointment.ai_summary ||
                          appointment.reason ||
                          "No appointment details provided."}
                      </p>
                      <dl className="grid gap-3 sm:grid-cols-2">
                        <DetailItem
                          label="Doctor"
                          value={appointment.requested_doctor || "Any"}
                        />
                        <DetailItem
                          label="Requested"
                          value={formatDate(appointment.requested_at)}
                        />
                        <DetailItem label="Phone" value={appointment.patient_phone} />
                        <DetailItem
                          label="Urgency"
                          value={appointment.urgency || "Not scored"}
                        />
                      </dl>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-14 text-center text-slate-500">
                  <Stethoscope className="mx-auto mb-3 size-9" />
                  <p>No linked appointment requests yet.</p>
                  <Button asChild className="mt-5">
                    <Link href="/appointment">Book your first appointment</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
