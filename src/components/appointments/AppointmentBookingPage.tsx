"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  Bot,
  CalendarCheck,
  CalendarDays,
  Clock3,
  Headphones,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import PublicHeader from "@/components/marketing/PublicHeader";
import type { AvailabilityOption, BookingOption } from "@/lib/clinic/content";

type AppointmentForm = {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  requestedDepartment: string;
  requestedDoctor: string;
  doctorId: string;
  requestedDate: string;
  requestedTime: string;
  reason: string;
  consentAccepted: boolean;
};

type IntakeResult = {
  suggestedDepartment: string;
  suggestedDoctor: string;
  urgency: "low" | "medium" | "high" | "urgent";
  summary: string;
  adminNote: string;
  safetyMessage: string | null;
  matchedSignals: string[];
  provider?: "rules" | "openai";
  model?: string;
};

const initialForm: AppointmentForm = {
  patientName: "",
  patientEmail: "",
  patientPhone: "",
  requestedDepartment: "General Medicine",
  requestedDoctor: "First available doctor",
  doctorId: "",
  requestedDate: "",
  requestedTime: "",
  reason: "",
  consentAccepted: false,
};

const supportCards = [
  {
    icon: Bot,
    title: "Smart intake support",
    text: "Patient requests can be organized into clear appointment notes while safety rules stay available as fallback.",
  },
  {
    icon: Headphones,
    title: "Receptionist handoff",
    text: "Requests can be created from web forms or reception calls and reviewed by clinic staff.",
  },
  {
    icon: MessageCircle,
    title: "Reminder consent",
    text: "The consent field helps the clinic send appointment confirmations and reminders responsibly.",
  },
];

const AppointmentBookingPage = ({
  bookingOptions,
}: {
    bookingOptions: {
    departments: BookingOption[];
    doctors: BookingOption[];
    availability: AvailabilityOption[];
  };
}) => {
  const resolvedInitialForm = {
    ...initialForm,
    requestedDepartment:
      bookingOptions.departments[0]?.value || initialForm.requestedDepartment,
    requestedDoctor: bookingOptions.doctors[0]?.value || initialForm.requestedDoctor,
    doctorId: bookingOptions.doctors[0]?.id || "",
  };
  const [form, setForm] = useState<AppointmentForm>(resolvedInitialForm);
  const [intakeResult, setIntakeResult] = useState<IntakeResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const updateField = <Key extends keyof AppointmentForm>(
    key: Key,
    value: AppointmentForm[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.patientName || !form.patientPhone || !form.reason) {
      toast.error("Name, phone, and appointment reason are required.");
      return;
    }

    if (!form.consentAccepted) {
      toast.error("Please accept communication consent before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          aiSummary: intakeResult?.summary,
          urgency: intakeResult?.urgency,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to submit appointment.");
      }

      toast.success("Appointment request submitted successfully.");
      setForm(resolvedInitialForm);
      setIntakeResult(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to submit appointment.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDateWeekday = useMemo(() => {
    if (!form.requestedDate) {
      return null;
    }

    const date = new Date(`${form.requestedDate}T00:00:00`);

    return Number.isNaN(date.getTime()) ? null : date.getDay();
  }, [form.requestedDate]);

  const matchingAvailability = useMemo(
    () =>
      bookingOptions.availability.filter((block) => {
        const matchesDoctor = !form.doctorId || block.doctorId === form.doctorId;
        const matchesDate =
          selectedDateWeekday === null || block.weekday === selectedDateWeekday;

        return matchesDoctor && matchesDate;
      }),
    [bookingOptions.availability, form.doctorId, selectedDateWeekday],
  );

  const slotTimes = useMemo(() => {
    const slots: { label: string; value: string; location: string | null }[] = [];

    matchingAvailability.forEach((block) => {
      const [startHour, startMinute] = block.startTime.split(":").map(Number);
      const [endHour, endMinute] = block.endTime.split(":").map(Number);
      const start = startHour * 60 + startMinute;
      const end = endHour * 60 + endMinute;

      for (let minute = start; minute < end; minute += block.slotMinutes) {
        const hour = Math.floor(minute / 60).toString().padStart(2, "0");
        const minutes = (minute % 60).toString().padStart(2, "0");
        const value = `${hour}:${minutes}`;

        slots.push({
          label: `${block.doctorName} - ${value}`,
          value,
          location: block.location,
        });
      }
    });

    return slots.slice(0, 8);
  }, [matchingAvailability]);

  const handleSmartIntake = async () => {
    if (form.reason.trim().length < 10) {
      toast.error("Describe the appointment reason first.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/ai/intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: form.reason }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to analyze request.");
      }

      const intake = result as IntakeResult;
      setIntakeResult(intake);

      if (intake.urgency !== "urgent") {
        updateField("requestedDepartment", intake.suggestedDepartment);
        updateField("requestedDoctor", intake.suggestedDoctor);
      }

      toast.success("Smart intake suggestion is ready.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to analyze request.";
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader />

      <main>
        <section className="relative overflow-hidden bg-slate-950 px-4 py-20 text-white md:px-8">
          <Image
            src="/assets/img/appoinment/appointment-bg.jpg"
            alt="Clinic appointment desk"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-slate-950/70" />
          <div className="relative mx-auto max-w-7xl">
              <Badge className="mb-5 bg-white/10 text-white hover:bg-white/15">
                <CalendarCheck className="size-3.5" />
              Online booking
            </Badge>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-normal md:text-6xl">
              Book a smarter appointment with MediDove
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              Submit a structured request for the clinic team. Your reason for
              visit helps reception prepare the right department, doctor
              preference, and follow-up details.
            </p>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_380px]">
            <Card>
              <CardHeader>
                <CardDescription>Appointment Request</CardDescription>
                <CardTitle className="text-2xl">Patient details</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="grid gap-5" onSubmit={handleSubmit}>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Full name</Label>
                      <Input
                        id="patientName"
                        value={form.patientName}
                        onChange={(event) =>
                          updateField("patientName", event.target.value)
                        }
                        placeholder="Enter patient name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patientEmail">Email</Label>
                      <Input
                        id="patientEmail"
                        type="email"
                        value={form.patientEmail}
                        onChange={(event) =>
                          updateField("patientEmail", event.target.value)
                        }
                        placeholder="name@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patientPhone">Phone</Label>
                      <Input
                        id="patientPhone"
                        type="tel"
                        value={form.patientPhone}
                        onChange={(event) =>
                          updateField("patientPhone", event.target.value)
                        }
                        placeholder="+1 555 000 0000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requestedDepartment">Department</Label>
                      <Select
                        id="requestedDepartment"
                        value={form.requestedDepartment}
                        onChange={(event) =>
                          updateField("requestedDepartment", event.target.value)
                        }
                      >
                        {bookingOptions.departments.map((department) => (
                          <option key={department.value} value={department.value}>
                            {department.label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requestedDoctor">Doctor preference</Label>
                      <Select
                        id="requestedDoctor"
                        value={form.requestedDoctor}
                        onChange={(event) => {
                          const selected = bookingOptions.doctors.find(
                            (doctor) => doctor.value === event.target.value,
                          );

                          setForm((current) => ({
                            ...current,
                            requestedDoctor: event.target.value,
                            doctorId: selected?.id || "",
                          }));
                        }}
                      >
                        {bookingOptions.doctors.map((doctor) => (
                          <option key={doctor.value} value={doctor.value}>
                            {doctor.label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="requestedDate">Date</Label>
                        <Input
                          id="requestedDate"
                          type="date"
                          value={form.requestedDate}
                          onChange={(event) =>
                            updateField("requestedDate", event.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="requestedTime">Time</Label>
                        <Input
                          id="requestedTime"
                          type="time"
                          value={form.requestedTime}
                          onChange={(event) =>
                            updateField("requestedTime", event.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Card className="border-slate-200 bg-white shadow-none">
                    <CardHeader>
                      <CardDescription>Doctor availability</CardDescription>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <CalendarDays className="size-5 text-primary" />
                        Matching open slots
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {form.requestedDate ? (
                        slotTimes.length > 0 ? (
                          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                            {slotTimes.map((slot) => (
                              <Button
                                key={`${slot.label}-${slot.value}`}
                                type="button"
                                variant={
                                  form.requestedTime === slot.value
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => updateField("requestedTime", slot.value)}
                                className="h-auto justify-start py-3 text-left"
                              >
                                <Clock3 className="size-4" />
                                <span className="min-w-0">
                                  <span className="block font-semibold">
                                    {slot.value}
                                  </span>
                                  <span className="block truncate text-xs opacity-80">
                                    {slot.location || "Clinic"}
                                  </span>
                                </span>
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                            No configured slots match this date and doctor yet.
                            You can still request a preferred time.
                          </p>
                        )
                      ) : (
                        <p className="text-sm leading-6 text-slate-600">
                          Select a date to see matching doctor availability from
                          the admin schedule.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for visit</Label>
                    <Textarea
                      id="reason"
                      value={form.reason}
                      onChange={(event) =>
                        updateField("reason", event.target.value)
                      }
                      placeholder="Tell us what kind of care you need. Do not include emergency details here; call emergency services for urgent symptoms."
                      rows={6}
                    />
                  </div>

                  <Card className="border-teal-100 bg-teal-50/60 shadow-none">
                    <CardHeader>
                      <CardDescription>Smart Intake</CardDescription>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Sparkles className="size-5 text-primary" />
                        Routing suggestion
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm leading-6 text-slate-600">
                        Analyze the reason for visit to suggest department,
                        doctor type, urgency, and admin notes. This is routing
                        support only, not diagnosis.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSmartIntake}
                        disabled={isAnalyzing}
                      >
                        <Bot />
                        {isAnalyzing ? "Analyzing..." : "Analyze request"}
                      </Button>

                      {intakeResult && (
                        <div className="grid gap-3 rounded-lg border border-teal-200 bg-white p-4">
                          {intakeResult.safetyMessage && (
                            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                              {intakeResult.safetyMessage}
                            </div>
                          )}
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">
                              {intakeResult.provider === "openai"
                                ? "Smart suggestion"
                                : "Rules fallback"}
                            </Badge>
                            {intakeResult.model && (
                              <span className="text-xs text-slate-500">
                                {intakeResult.model}
                              </span>
                            )}
                          </div>
                          <div className="grid gap-3 sm:grid-cols-3">
                            <div>
                              <p className="text-xs font-semibold uppercase text-slate-400">
                                Department
                              </p>
                              <p className="mt-1 text-sm font-medium text-slate-800">
                                {intakeResult.suggestedDepartment}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase text-slate-400">
                                Doctor
                              </p>
                              <p className="mt-1 text-sm font-medium text-slate-800">
                                {intakeResult.suggestedDoctor}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase text-slate-400">
                                Urgency
                              </p>
                              <Badge className="mt-1 capitalize">
                                {intakeResult.urgency}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm leading-6 text-slate-600">
                            {intakeResult.adminNote}
                          </p>
                          {intakeResult.matchedSignals.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {intakeResult.matchedSignals.map((signal) => (
                                <Badge key={signal} variant="secondary">
                                  {signal}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={form.consentAccepted}
                      onChange={(event) =>
                        updateField("consentAccepted", event.target.checked)
                      }
                      className="mt-1 size-4 rounded border-slate-300"
                    />
                    <span>
                      I agree to be contacted about this appointment by phone,
                      email, SMS, or WhatsApp.
                    </span>
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                      <CalendarCheck />
                      {isSubmitting ? "Submitting..." : "Submit request"}
                    </Button>
                    <Button asChild type="button" variant="outline" size="lg">
                      <Link href="/contact">
                        <Phone />
                        Contact first
                      </Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <aside className="space-y-5">
              <Card>
                <CardHeader>
                  <CardDescription>Emergency note</CardDescription>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="size-5 text-primary" />
                    Safety first
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-600">
                  This form is for appointment requests only. For chest pain,
                  severe breathing trouble, stroke symptoms, heavy bleeding, or
                  loss of consciousness, contact emergency services immediately.
                </CardContent>
              </Card>

              {supportCards.map((card) => (
                <Card key={card.title}>
                  <CardHeader>
                    <card.icon className="size-7 text-primary" />
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-6">
                      {card.text}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-slate-950 text-white">
                <CardHeader>
                  <CardDescription className="text-slate-300">
                    Intake support
                  </CardDescription>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="size-5 text-primary" />
                    Smart routing
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-300">
                  The care request is reviewed for department fit, doctor type,
                  urgency, and staff notes without making diagnosis claims.
                </CardContent>
              </Card>
            </aside>
          </div>
        </section>
      </main>

      <ToastContainer />
    </div>
  );
};

export default AppointmentBookingPage;
