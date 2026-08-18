import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  LogOut,
  MessageCircle,
  Stethoscope,
  UserRound,
} from "lucide-react";
import PublicHeader from "@/components/marketing/PublicHeader";
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
import { signOut, updateProfile } from "./actions";

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader />

      <main>
        <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white md:px-8">
          <Image
            src="/assets/img/slider/slider-bg-2.jpg"
            alt="Patient portal"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-slate-950/75" />
          <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <Badge className="mb-5 bg-white/10 text-white hover:bg-white/15">
                <UserRound className="size-3.5" />
                Patient portal
              </Badge>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-normal md:text-5xl">
                Track your MediDove appointments and AI intake history
              </h1>
              <p className="mt-5 max-w-2xl leading-8 text-slate-300">
                Signed-in patients can review their appointment requests,
                routing status, and AI-generated intake summaries.
              </p>
            </div>
            <form action={signOut}>
              <Button
                type="submit"
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-slate-950"
              >
                <LogOut />
                Sign out
              </Button>
            </form>
          </div>
        </section>

        <section className="px-4 py-10 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardDescription>Profile</CardDescription>
                <CardTitle className="text-2xl">
                  {profile?.full_name || user.email}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 text-sm leading-6 text-slate-600">
                <div>
                  <p>{user.email}</p>
                  <p>{profile?.phone || "Phone not added"}</p>
                  <Badge variant="secondary" className="mt-4 capitalize">
                  {profile?.role || "patient"}
                  </Badge>
                </div>
                <form action={updateProfile} className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
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
                  <Button type="submit" size="sm" variant="outline">
                    Save profile
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardDescription>Pending</CardDescription>
                  <CardTitle className="mt-2 text-3xl">{pendingCount}</CardTitle>
                </div>
                <Clock className="size-8 text-amber-600" />
              </CardHeader>
              <CardContent className="text-sm text-slate-500">
                waiting for clinic review
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardDescription>Confirmed</CardDescription>
                  <CardTitle className="mt-2 text-3xl">
                    {confirmedCount}
                  </CardTitle>
                </div>
                <CheckCircle2 className="size-8 text-teal-600" />
              </CardHeader>
              <CardContent className="text-sm text-slate-500">
                appointments approved by admin
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="px-4 pb-16 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-bold uppercase text-primary">
                  My appointments
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-normal">
                  Latest requests
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="outline">
                  <Link href="/portal/timeline">
                    <FileText />
                    Health timeline
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/portal/consents">
                    <MessageCircle />
                    Consent center
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/appointment">
                    <CalendarClock />
                    New appointment
                  </Link>
                </Button>
              </div>
            </div>

            {appointments.length > 0 ? (
              <div className="grid gap-5 lg:grid-cols-2">
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
        </section>
      </main>
    </div>
  );
}
