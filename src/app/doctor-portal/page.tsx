import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  LogOut,
  MapPin,
  Stethoscope,
  UserRoundCheck,
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
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/portal/actions";

export const metadata = {
  title: "Doctor Workspace | MediDove",
};

import type {
  AppointmentRow,
  AvailabilityRow,
  ClinicalNoteRow,
  DoctorProfile,
} from "./types";
import { formatDate, weekdays } from "./utils";

export default async function DoctorPortalPage() {
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

  if (profile?.role !== "doctor" && profile?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <PublicHeader />
        <main className="px-4 py-16">
          <Card className="mx-auto max-w-xl">
            <CardHeader>
              <CardTitle>Doctor access required</CardTitle>
              <CardDescription>
                This workspace is available to linked doctor accounts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/portal">Open patient portal</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const { data: doctorData } = await supabase
    .from("doctors")
    .select("id, full_name, specialty, image_url")
    .eq("profile_id", user.id)
    .maybeSingle();

  const doctor = doctorData as DoctorProfile | null;

  if (!doctor) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <PublicHeader />
        <main className="px-4 py-16">
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle>Doctor profile not linked</CardTitle>
              <CardDescription>
                Ask an admin to connect your user profile to a doctor record in
                the clinic directory before using the doctor workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="outline">
                <Link href="/admin/content">Manage doctors</Link>
              </Button>
              <form action={signOut}>
                <Button type="submit" variant="secondary">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const [{ data: appointmentsData }, { data: availabilityData }, { data: notesData }] =
    await Promise.all([
      supabase
        .from("appointments")
        .select(
          "id, patient_name, patient_email, patient_phone, requested_department, requested_at, reason, ai_summary, urgency, status, created_at",
        )
        .eq("doctor_id", doctor.id)
        .order("requested_at", { ascending: true })
        .limit(30),
      supabase
        .from("doctor_availability")
        .select("id, weekday, start_time, end_time, slot_minutes, location, is_active")
        .eq("doctor_id", doctor.id)
        .order("weekday", { ascending: true }),
      supabase
        .from("clinical_notes")
        .select(
          "id, patient_name, visit_type, subjective, assessment, care_plan, risk_flags, status, created_at",
        )
        .eq("status", "reviewed")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  const appointments = (appointmentsData || []) as AppointmentRow[];
  const availability = (availabilityData || []) as AvailabilityRow[];
  const notes = (notesData || []) as ClinicalNoteRow[];
  const confirmed = appointments.filter(
    (appointment) => appointment.status === "confirmed",
  ).length;
  const pendingReview = appointments.filter(
    (appointment) =>
      appointment.status === "pending" || appointment.status === "rescheduled",
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader />

      <main>
        <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white md:px-8">
          <Image
            src="/assets/img/slider/slider-bg-2.jpg"
            alt="Doctor workspace"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-slate-950/75" />
          <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <Badge className="mb-5 bg-white/10 text-white hover:bg-white/15">
                <Stethoscope className="h-3.5 w-3.5" />
                Doctor workspace
              </Badge>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-normal md:text-5xl">
                {doctor.full_name}
              </h1>
              <p className="mt-5 max-w-2xl leading-8 text-slate-300">
                {doctor.specialty} workspace for assigned appointments, schedule
                blocks, and reviewed patient notes.
              </p>
            </div>
            <form action={signOut}>
              <Button
                type="submit"
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-slate-950"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </form>
          </div>
        </section>

        <section className="px-4 py-10 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Assigned</CardDescription>
                <CardTitle className="text-3xl">{appointments.length}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-500">
                appointments in queue
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Confirmed</CardDescription>
                <CardTitle className="flex items-center gap-2 text-3xl">
                  {confirmed}
                  <CheckCircle2 className="h-6 w-6 text-teal-600" />
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Needs Review</CardDescription>
                <CardTitle className="flex items-center gap-2 text-3xl">
                  {pendingReview}
                  <Clock className="h-6 w-6 text-amber-600" />
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Availability</CardDescription>
                <CardTitle className="text-3xl">{availability.length}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-500">
                weekly schedule blocks
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="px-4 pb-16 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_380px]">
            <div className="space-y-5">
              <div>
                <p className="text-sm font-bold uppercase text-primary">
                  Appointment queue
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-normal">
                  Assigned patients
                </h2>
              </div>

              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardHeader>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <CardDescription>
                            {formatDate(appointment.requested_at)}
                          </CardDescription>
                          <CardTitle className="mt-2 text-xl">
                            {appointment.patient_name}
                          </CardTitle>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="capitalize">{appointment.status}</Badge>
                          {appointment.urgency ? (
                            <Badge variant="secondary" className="capitalize">
                              {appointment.urgency} urgency
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                        {appointment.ai_summary ||
                          appointment.reason ||
                          "No intake summary available."}
                      </p>
                      <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                        <span>{appointment.requested_department || "General care"}</span>
                        <span className="break-words">{appointment.patient_phone}</span>
                        <span className="break-words">
                          {appointment.patient_email || "No email"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-14 text-center text-slate-500">
                    <UserRoundCheck className="mx-auto mb-3 h-9 w-9" />
                    No appointments are assigned to this doctor yet.
                  </CardContent>
                </Card>
              )}
            </div>

            <aside className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly availability</CardTitle>
                  <CardDescription>
                    Managed by admin scheduling.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {availability.length > 0 ? (
                    availability.map((block) => (
                      <div key={block.id} className="rounded-md border p-3 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium">{weekdays[block.weekday]}</span>
                          <Badge variant={block.is_active ? "default" : "outline"}>
                            {block.is_active ? "Active" : "Paused"}
                          </Badge>
                        </div>
                        <p className="mt-2 text-slate-600">
                          {block.start_time.slice(0, 5)}-{block.end_time.slice(0, 5)} ·{" "}
                          {block.slot_minutes} min slots
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-slate-500">
                          <MapPin className="h-3.5 w-3.5" />
                          {block.location || "Location not set"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-600">
                      No availability blocks have been configured.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reviewed notes</CardTitle>
                  <CardDescription>
                    Notes attached to assigned appointments.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notes.length > 0 ? (
                    notes.slice(0, 5).map((note) => (
                      <div key={note.id} className="rounded-md border p-3 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium">{note.patient_name}</span>
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <p className="mt-2 line-clamp-3 text-slate-600">
                          {note.assessment}
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                          {formatDate(note.created_at)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-600">
                      No reviewed notes are visible yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
