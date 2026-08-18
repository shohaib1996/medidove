"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import { Ban, Mail, MessageCircle, Phone, ShieldCheck } from "lucide-react";
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
import type { Channel } from "@/lib/supabase/database.types";

type FormState = {
  channel: Channel;
  phone: string;
  email: string;
  reason: string;
};

const initialForm: FormState = {
  channel: "whatsapp",
  phone: "",
  email: "",
  reason: "",
};

const channels = [
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "sms", label: "SMS", icon: Phone },
  { value: "voice", label: "Voice calls", icon: Phone },
  { value: "email", label: "Email", icon: Mail },
] as const;

const UnsubscribePage = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.phone && !form.email) {
      toast.error("Provide a phone number or email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save unsubscribe request.");
      }

      toast.success("Unsubscribe request saved.");
      setForm(initialForm);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to save unsubscribe request.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader />
      <main>
        <section className="bg-slate-950 px-4 py-16 text-white md:px-8">
          <div className="mx-auto max-w-7xl">
            <Badge className="mb-6 bg-white/10 text-white">
              <Ban className="size-3.5" />
              Consent controls
            </Badge>
            <h1 className="max-w-4xl text-4xl font-bold tracking-normal md:text-6xl">
              Stop reminder, outreach, or marketing messages
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Record an opt-out for WhatsApp, SMS, email, or voice calls.
              MediDove stores the request in Supabase and blocks future queued
              outreach for that channel.
            </p>
          </div>
        </section>

        <section className="px-4 py-14 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <CardHeader>
                <CardDescription>Unsubscribe request</CardDescription>
                <CardTitle>Choose the channel to stop</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="channel">Channel</Label>
                    <select
                      id="channel"
                      value={form.channel}
                      onChange={(event) =>
                        updateField("channel", event.target.value)
                      }
                      className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      {channels.map((channel) => (
                        <option key={channel.value} value={channel.value}>
                          {channel.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(event) =>
                          updateField("phone", event.target.value)
                        }
                        placeholder="+1 555 0100"
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      id="reason"
                      value={form.reason}
                      onChange={(event) =>
                        updateField("reason", event.target.value)
                      }
                      rows={4}
                      placeholder="Optional reason for the clinic team."
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    <ShieldCheck />
                    {isSubmitting ? "Saving..." : "Save opt-out"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-5">
              {channels.map((channel) => {
                const Icon = channel.icon;

                return (
                  <Card key={channel.value}>
                    <CardHeader className="flex flex-row items-start gap-4">
                      <Icon className="mt-1 size-6 text-primary" />
                      <div>
                        <CardTitle>{channel.label}</CardTitle>
                        <CardDescription className="mt-2 leading-6">
                          Future queued {channel.label.toLowerCase()} outreach
                          is blocked when an opt-out exists for the matching
                          contact detail and channel.
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="pt-6 text-sm leading-6 text-amber-950">
                  Urgent or clinical questions should use the clinic contact or
                  appointment workflow. This page only controls communication
                  preferences.
                </CardContent>
              </Card>
              <Button asChild variant="outline">
                <Link href="/portal/consents">View consent center</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <ToastContainer />
    </div>
  );
};

export default UnsubscribePage;
