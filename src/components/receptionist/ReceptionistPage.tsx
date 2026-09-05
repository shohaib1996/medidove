"use client";

import Script from "next/script";
import Link from "next/link";
import { FormEvent, useMemo, useRef, useState } from "react";
import {
  Activity,
  Bot,
  CalendarClock,
  CheckCircle2,
  Headphones,
  Mic,
  PhoneCall,
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

type ConvaiElement = HTMLElement & {
  startConversation?: () => void;
  endConversation?: () => void;
};

const receptionistJobs = [
  "Answer clinic service questions in a natural voice",
  "Collect patient name, phone, reason, and preferred time",
  "Route urgent requests to the admin team for fast review",
  "Prepare appointment notes without making diagnosis claims",
];

const ReceptionistPage = () => {
  const widgetRef = useRef<ConvaiElement | null>(null);
  const [voiceStatus, setVoiceStatus] = useState("Ready to start");
  const [isStarting, setIsStarting] = useState(false);
  const [callbackStatus, setCallbackStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const hasAgentId = useMemo(
    () => Boolean(agentId && !agentId.includes("your-elevenlabs")),
    [agentId],
  );

  const startReceptionist = async () => {
    setIsStarting(true);
    setVoiceStatus("Starting secure voice session...");

    try {
      const response = await fetch("/api/voice/signed-url", {
        method: "GET",
        cache: "no-store",
      });
      const data = (await response.json()) as {
        signedUrl?: string;
        error?: string;
      };

      if (!response.ok || !data.signedUrl) {
        throw new Error(data.error || "Voice receptionist is unavailable.");
      }

      widgetRef.current?.setAttribute("signed-url", data.signedUrl);
      widgetRef.current?.startConversation?.();
      setVoiceStatus("Voice receptionist session started.");
    } catch (error) {
      setVoiceStatus(
        error instanceof Error
          ? error.message
          : "Voice receptionist is unavailable.",
      );
    } finally {
      setIsStarting(false);
    }
  };

  const submitCallbackRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setCallbackStatus("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/voice/call-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          reason: formData.get("reason"),
          consent: formData.get("consent") === "on",
        }),
      });
      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Could not save callback request.");
      }

      form.reset();
      setCallbackStatus(data.message || "Callback request saved.");
    } catch (error) {
      setCallbackStatus(
        error instanceof Error ? error.message : "Could not save callback request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicHeader />
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="lazyOnload"
      />

      <main>
        <section className="border-b border-slate-200 bg-slate-950 px-4 py-16 text-white md:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.92fr] lg:items-center">
            <div>
              <Badge className="mb-5 bg-white/10 text-white hover:bg-white/15">
                <Headphones className="size-3.5" />
                Virtual reception
              </Badge>
              <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-normal md:text-5xl">
                Voice receptionist for booking, routing, and patient callbacks
              </h1>
              <p className="mt-5 max-w-2xl leading-8 text-slate-300">
                Patients can speak with a virtual reception desk, leave callback
                details, ask common questions, and start an appointment request
                for staff review.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  onClick={startReceptionist}
                  disabled={isStarting || !hasAgentId}
                >
                  <Mic />
                  {isStarting ? "Starting..." : "Start voice receptionist"}
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-slate-950"
                >
                  <Link href="/appointment">
                    <CalendarClock />
                    Book manually
                  </Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-slate-300">{voiceStatus}</p>
            </div>

            <Card className="border-white/10 bg-white/10 text-white">
              <CardHeader>
                <CardDescription className="text-slate-300">
                  Receptionist scope
                </CardDescription>
                <CardTitle>Designed for staff-reviewed support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {receptionistJobs.map((job) => (
                  <div key={job} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal-300" />
                    <p className="text-sm leading-6 text-slate-200">{job}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-5">
              <Card>
                <CardHeader>
                  <Bot className="mb-2 size-9 text-primary" />
                  <CardTitle>Private voice sessions</CardTitle>
                  <CardDescription className="leading-6">
                    Voice sessions are started securely so patients can speak
                    with reception without exposing private clinic settings.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <ShieldCheck className="mb-2 size-9 text-teal-600" />
                  <CardTitle>Consent-first callbacks</CardTitle>
                  <CardDescription className="leading-6">
                    Callback requests require consent and are saved as voice
                    call logs for admin review before any real outbound dialer is
                    connected.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Activity className="mb-2 size-9 text-indigo-600" />
                  <CardTitle>Ready for phone reminders</CardTitle>
                  <CardDescription className="leading-6">
                    Reception and reminder activity can be reviewed by staff
                    before any real patient follow-up is completed.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardDescription>Callback request</CardDescription>
                <CardTitle>Ask reception to call back</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-5" onSubmit={submitCallbackRequest}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Patient name</Label>
                      <Input id="name" name="name" placeholder="Patient name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone number</Label>
                      <Input id="phone" name="phone" placeholder="+1 555 0199" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for callback</Label>
                    <Textarea
                      id="reason"
                      name="reason"
                      placeholder="I need help choosing the right department and booking a visit."
                      rows={5}
                    />
                  </div>
                  <label className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    <input
                      name="consent"
                      type="checkbox"
                      className="mt-1 size-4 rounded border-slate-300"
                    />
                    I agree that the clinic may contact this number about this
                    request. Emergency symptoms should use local emergency
                    services, not this form.
                  </label>
                  <Button type="submit" disabled={isSubmitting}>
                    <PhoneCall />
                    {isSubmitting ? "Saving..." : "Save callback request"}
                  </Button>
                  {callbackStatus ? (
                    <p className="text-sm font-medium text-slate-700">
                      {callbackStatus}
                    </p>
                  ) : null}
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <elevenlabs-convai
        ref={widgetRef}
        agent-id={hasAgentId ? agentId : undefined}
      />
    </div>
  );
};

export default ReceptionistPage;
