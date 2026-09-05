"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  BellRing,
  CalendarDays,
  CheckCircle2,
  MessageCircle,
  PhoneForwarded,
  ShieldCheck,
  Sparkles,
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
import { Textarea } from "@/components/ui/textarea";

const workflows = [
  "Appointment reminders and confirmation messages",
  "Post-visit follow-up prompts for opted-in patients",
  "Reactivation messages for overdue checkups",
  "Staff-reviewed reply drafts before live sending",
];

const EngagementPage = () => {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitOptIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/engagement/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          interest: formData.get("interest"),
          consent: formData.get("consent") === "on",
        }),
      });
      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Could not save WhatsApp opt-in.");
      }

      form.reset();
      setStatus(data.message || "WhatsApp opt-in saved.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Could not save WhatsApp opt-in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader />

      <main>
        <section className="bg-white px-4 py-16 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <Badge className="mb-5">
                <Sparkles className="size-3.5" />
                Patient reminders
              </Badge>
              <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-normal md:text-5xl">
                Consent-first reminders and patient outreach
              </h1>
              <p className="mt-5 max-w-2xl leading-8 text-slate-600">
                Choose how the clinic may contact you for appointment
                reminders, care follow-up, wellness updates, and support
                messages.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/appointment">
                    <CalendarDays />
                    Book appointment
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/receptionist">
                    <PhoneForwarded />
                    Contact reception
                  </Link>
                </Button>
              </div>
            </div>

            <Card className="border-slate-200">
              <CardHeader>
                <CardDescription>Workflow guardrails</CardDescription>
                <CardTitle>Built for responsible outreach</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workflows.map((workflow) => (
                  <div key={workflow} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal-600" />
                    <p className="text-sm leading-6 text-slate-600">{workflow}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-5">
              <Card>
                <CardHeader>
                  <MessageCircle className="mb-2 size-9 text-primary" />
                  <CardTitle>Message preferences</CardTitle>
                  <CardDescription className="leading-6">
                    Patients can request appointment reminders, follow-up
                    messages, and care coordinator updates through their
                    preferred contact channel.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <ShieldCheck className="mb-2 size-9 text-teal-600" />
                  <CardTitle>Consent log included</CardTitle>
                  <CardDescription className="leading-6">
                    Each opt-in gives the clinic a clear record of what the
                    patient agreed to receive and how they can opt out later.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <BellRing className="mb-2 size-9 text-indigo-600" />
                  <CardTitle>Marketing without spam</CardTitle>
                  <CardDescription className="leading-6">
                    Outreach is limited to reminders, follow-ups, and support
                    messages for patients who explicitly opt in.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardDescription>WhatsApp opt-in</CardDescription>
                <CardTitle>Save a patient engagement request</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-5" onSubmit={submitOptIn}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Patient name</Label>
                      <Input id="name" name="name" placeholder="Patient name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">WhatsApp phone</Label>
                      <Input id="phone" name="phone" placeholder="+1 555 0199" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interest">Engagement goal</Label>
                    <Textarea
                      id="interest"
                      name="interest"
                      rows={5}
                      placeholder="Appointment reminders, follow-up after dental visit, monthly wellness tips, or care coordinator support."
                    />
                  </div>

                  <label className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    <input
                      name="consent"
                      type="checkbox"
                      className="mt-1 size-4 rounded border-slate-300"
                    />
                    I agree to receive WhatsApp messages from MediDove about
                    this request and understand I can opt out later.
                  </label>

                  <Button type="submit" disabled={isSubmitting}>
                    <MessageCircle />
                    {isSubmitting ? "Saving..." : "Save WhatsApp opt-in"}
                  </Button>

                  {status ? (
                    <p className="text-sm font-medium text-slate-700">{status}</p>
                  ) : null}
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EngagementPage;
