"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  Headphones,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  ShieldCheck,
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
import type { ClinicSettings } from "@/lib/clinic/settings";

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export type ContactInquiryContext = {
  type: "product" | "package" | "general";
  label: string;
};

const initialForm: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const getInitialForm = (
  inquiryContext?: ContactInquiryContext,
): ContactFormState => {
  if (!inquiryContext || inquiryContext.type === "general") {
    return initialForm;
  }

  const inquiryType =
    inquiryContext.type === "product" ? "product inquiry" : "package inquiry";

  return {
    ...initialForm,
    subject: `Staff review request: ${inquiryContext.label}`,
    message: `I am interested in the ${inquiryContext.label} ${inquiryType}. Please have a clinic coordinator review and contact me with the next step.`,
  };
};

const ContactPage = ({
  settings,
  inquiryContext,
}: {
  settings: ClinicSettings;
  inquiryContext?: ContactInquiryContext;
}) => {
  const [form, setForm] = useState<ContactFormState>(() =>
    getInitialForm(inquiryContext),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contactMethods = [
    {
      icon: Phone,
      label: "Phone",
      value: settings.phone,
    },
    {
      icon: Mail,
      label: "Email",
      value: settings.email,
    },
    {
      icon: MapPin,
      label: "Clinic",
      value: settings.address,
    },
  ];

  const updateField = (key: keyof ContactFormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Name, email, and message are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to submit your message.");
      }

      toast.success("Message submitted successfully.");
      setForm(initialForm);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to submit your message.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader />

      <main>
        <section className="relative overflow-hidden bg-slate-950 px-4 py-20 text-white md:px-8">
          <Image
            src="/assets/img/bg/appointment.jpg"
            alt="Medical support desk"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-slate-950/75" />
          <div className="relative mx-auto max-w-7xl">
            <Badge className="mb-5 bg-white/10 text-white hover:bg-white/15">
              <Headphones className="size-3.5" />
              Clinic support
            </Badge>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-normal md:text-6xl">
              Contact {settings.clinicName}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              Send a message to the clinic team for appointment help, service
              questions, callback requests, billing questions, or follow-up
              support.
            </p>
            {inquiryContext && inquiryContext.type !== "general" ? (
              <div className="mt-6 inline-flex rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-100">
                Staff review inquiry for {inquiryContext.label}
              </div>
            ) : null}
          </div>
        </section>

        <section className="px-4 py-16 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_380px]">
            <Card>
              <CardHeader>
                <CardDescription>Contact request</CardDescription>
                <CardTitle className="text-2xl">Send a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="grid gap-5" onSubmit={handleSubmit}>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(event) =>
                          updateField("name", event.target.value)
                        }
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(event) =>
                          updateField("email", event.target.value)
                        }
                        placeholder="name@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(event) =>
                          updateField("phone", event.target.value)
                        }
                        placeholder="+1 555 000 0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={form.subject}
                        onChange={(event) =>
                          updateField("subject", event.target.value)
                        }
                        placeholder="Appointment, billing, service question"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={(event) =>
                        updateField("message", event.target.value)
                      }
                      placeholder="Tell us how the clinic team can help."
                      rows={7}
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                      <MessageSquareText />
                      {isSubmitting ? "Submitting..." : "Submit message"}
                    </Button>
                    <Button asChild type="button" variant="outline" size="lg">
                      <Link href="/appointment">
                        <CalendarDays />
                        Book instead
                      </Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <aside className="space-y-5">
              <Card>
                <CardHeader>
                  <CardDescription>Clinic channels</CardDescription>
                  <CardTitle>Reach the care team</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactMethods.map((method) => (
                    <div
                      key={method.label}
                      className="flex gap-3 rounded-lg border border-slate-200 p-4"
                    >
                      <method.icon className="mt-0.5 size-5 text-primary" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {method.label}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {method.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardDescription>Response time</CardDescription>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="size-5 text-primary" />
                    Clinic follow-up
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-600">
                  {settings.businessHours}
                </CardContent>
              </Card>

              <Card className="bg-slate-950 text-white">
                <CardHeader>
                  <CardDescription className="text-slate-300">
                    Patient safety
                  </CardDescription>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="size-5 text-primary" />
                    Safe support
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-300">
                  {settings.aiDisclosure}
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardDescription>Emergency notice</CardDescription>
                  <CardTitle>Urgent symptoms</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-amber-950">
                  {settings.emergencyNotice}
                </CardContent>
              </Card>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContactPage;
