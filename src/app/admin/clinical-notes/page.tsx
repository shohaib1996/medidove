import Link from "next/link";
import { redirect } from "next/navigation";
import { ClipboardPlus, FileText, ShieldAlert, Stethoscope } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/server";
import { createClinicalNote, updateClinicalNoteStatus } from "./actions";

export const metadata = {
  title: "Clinical Notes | MediDove Admin",
};

type AppointmentOption = {
  id: string;
  patient_id: string | null;
  patient_name: string;
  requested_department: string | null;
  requested_at: string | null;
};

type PatientOption = {
  id: string;
  full_name: string | null;
  phone: string | null;
};

type ClinicalNote = {
  id: string;
  patient_name: string;
  visit_type: string;
  subjective: string;
  objective: string;
  assessment: string;
  care_plan: string;
  risk_flags: string[];
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

const StatusButton = ({
  id,
  status,
  label,
}: {
  id: string;
  status: "draft" | "reviewed" | "archived";
  label: string;
}) => (
  <form action={updateClinicalNoteStatus}>
    <input type="hidden" name="id" value={id} />
    <input type="hidden" name="status" value={status} />
    <Button type="submit" size="sm" variant="outline">
      {label}
    </Button>
  </form>
);

export default async function AdminClinicalNotesPage() {
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

  const [{ data: appointmentsData }, { data: patientsData }, { data: notesData }] =
    await Promise.all([
      supabase
        .from("appointments")
        .select("id, patient_id, patient_name, requested_department, requested_at")
        .order("created_at", { ascending: false })
        .limit(30),
      supabase
        .from("profiles")
        .select("id, full_name, phone")
        .eq("role", "patient")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("clinical_notes")
        .select(
          "id, patient_name, visit_type, subjective, objective, assessment, care_plan, risk_flags, status, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  const appointments = (appointmentsData || []) as AppointmentOption[];
  const patients = (patientsData || []) as PatientOption[];
  const notes = (notesData || []) as ClinicalNote[];
  const reviewed = notes.filter((note) => note.status === "reviewed").length;
  const flagged = notes.filter((note) => note.risk_flags.length > 0).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="flex flex-col justify-between gap-4 rounded-lg border bg-white p-6 shadow-sm lg:flex-row lg:items-center">
          <div>
            <Badge variant="secondary">Clinical Documentation</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              AI clinical notes
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Convert rough visit notes into structured drafts for clinician
              review, with risk flags and audit tracking.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/admin/appointments">Appointments</Link>
            </Button>
            <Button asChild>
              <Link href="/admin">Back to dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Recent Notes</CardTitle>
              <FileText className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{notes.length}</p>
              <p className="text-xs text-slate-500">Latest saved drafts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
              <Stethoscope className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{reviewed}</p>
              <p className="text-xs text-slate-500">Clinician-approved notes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Risk Flags</CardTitle>
              <ShieldAlert className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{flagged}</p>
              <p className="text-xs text-slate-500">Need careful review</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <Card>
            <CardHeader>
              <CardDescription>Draft note</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <ClipboardPlus className="h-5 w-5 text-primary" />
                Structure clinical text
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createClinicalNote} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="patient_name">Patient name</Label>
                  <Input id="patient_name" name="patient_name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visit_type">Visit type</Label>
                  <Input
                    id="visit_type"
                    name="visit_type"
                    placeholder="consultation, follow-up, triage"
                    defaultValue="consultation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient_id">Patient profile</Label>
                  <select
                    id="patient_id"
                    name="patient_id"
                    className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">No linked profile</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.full_name || patient.phone || patient.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointment_id">Appointment</Label>
                  <select
                    id="appointment_id"
                    name="appointment_id"
                    className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">No linked appointment</option>
                    {appointments.map((appointment) => (
                      <option key={appointment.id} value={appointment.id}>
                        {appointment.patient_name} -{" "}
                        {appointment.requested_department || "General care"} -{" "}
                        {formatDate(appointment.requested_at)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="raw_note">Rough note</Label>
                  <Textarea
                    id="raw_note"
                    name="raw_note"
                    rows={10}
                    placeholder="Patient reports headache for three days. BP 130/82. No fever. Likely migraine. Plan hydration, medication, and follow-up in one week."
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  <ClipboardPlus className="h-4 w-4" />
                  Generate draft
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {notes.length > 0 ? (
              notes.map((note) => (
                <Card key={note.id}>
                  <CardHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <CardDescription>{formatDate(note.created_at)}</CardDescription>
                        <CardTitle className="mt-2 text-xl">
                          {note.patient_name}
                        </CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{note.visit_type}</Badge>
                        <Badge variant={note.status === "reviewed" ? "default" : "secondary"}>
                          {note.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {note.risk_flags.length > 0 ? (
                      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                        Risk signals: {note.risk_flags.join(", ")}
                      </div>
                    ) : null}

                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="rounded-md bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Subjective
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {note.subjective}
                        </p>
                      </div>
                      <div className="rounded-md bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Objective
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {note.objective}
                        </p>
                      </div>
                      <div className="rounded-md bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Assessment
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {note.assessment}
                        </p>
                      </div>
                      <div className="rounded-md bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Plan
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {note.care_plan}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {note.status !== "reviewed" ? (
                        <StatusButton id={note.id} status="reviewed" label="Mark reviewed" />
                      ) : null}
                      {note.status !== "archived" ? (
                        <StatusButton id={note.id} status="archived" label="Archive" />
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-14 text-center text-slate-500">
                  <FileText className="mx-auto mb-3 h-9 w-9" />
                  No clinical notes yet.
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
