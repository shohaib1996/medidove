import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BellRing,
  CheckCircle2,
  Mail,
  MessageCircle,
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
import { createClient } from "@/lib/supabase/server";
import { createConsentLog } from "../actions";

export const metadata = {
  title: "Communication Consents | MediDove",
};

type ConsentLog = {
  id: string;
  phone: string | null;
  email: string | null;
  channel: "email" | "sms" | "whatsapp" | "voice";
  consented: boolean;
  reason: string | null;
  created_at: string;
};

type OptOut = {
  id: string;
  phone: string | null;
  email: string | null;
  channel: "email" | "sms" | "whatsapp" | "voice";
  reason: string | null;
  created_at: string;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const channelIcons = {
  email: Mail,
  sms: BellRing,
  whatsapp: MessageCircle,
  voice: Phone,
};

export default async function PatientConsentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: profile }, { data: consentsData }, { data: optOutsData }] =
    await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .single(),
    supabase
      .from("consent_logs")
      .select("id, phone, email, channel, consented, reason, created_at")
      .eq("patient_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("opt_outs")
      .select("id, phone, email, channel, reason, created_at")
      .eq("patient_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const consents = (consentsData || []) as ConsentLog[];
  const optOuts = (optOutsData || []) as OptOut[];
  const blockedChannels = new Set(optOuts.map((optOut) => optOut.channel));
  const activeChannels = new Set(
    consents
      .filter(
        (consent) => consent.consented && !blockedChannels.has(consent.channel),
      )
      .map((consent) => consent.channel),
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader />

      <main className="px-4 py-10 md:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-bold uppercase text-primary">
                Consent center
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">
                Manage communication preferences
              </h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Review how MediDove may contact you for appointments,
                reminders, reception callbacks, and follow-up support.
              </p>
            </div>
            <Button asChild variant="secondary">
              <Link href="/portal">Back to portal</Link>
            </Button>
          </section>

          <section className="grid gap-4 md:grid-cols-4">
            {(["email", "sms", "whatsapp", "voice"] as const).map((channel) => {
              const Icon = channelIcons[channel];
              const isActive = activeChannels.has(channel);

              return (
                <Card key={channel}>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <Icon className="size-7 text-primary" />
                      <Badge variant={isActive ? "default" : "outline"}>
                        {blockedChannels.has(channel)
                          ? "Opted out"
                          : isActive
                            ? "Opted in"
                            : "No active opt-in"}
                      </Badge>
                    </div>
                    <CardTitle className="capitalize">{channel}</CardTitle>
                    <CardDescription>
                      {blockedChannels.has(channel)
                        ? "A recent opt-out blocks this channel."
                        : isActive
                        ? "Latest consent allows this channel."
                        : "No consent has been recorded for this channel."}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <CardHeader>
                <CardDescription>New consent</CardDescription>
                <CardTitle>Record communication opt-in</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={createConsentLog} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="channel">Channel</Label>
                    <select
                      id="channel"
                      name="channel"
                      className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="voice">Voice call</option>
                      <option value="sms">SMS</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
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
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={user.email || ""}
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      id="reason"
                      name="reason"
                      rows={4}
                      placeholder="Appointment reminders, care coordinator follow-up, receptionist callback, or clinic updates."
                    />
                  </div>
                  <label className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    <input
                      name="consented"
                      type="checkbox"
                      className="mt-1 size-4 rounded border-slate-300"
                    />
                    I agree that MediDove may contact me on this channel for
                    the reason selected above.
                  </label>
                  <Button type="submit">
                    <ShieldCheck />
                    Save consent
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>History</CardDescription>
                <CardTitle>Recent consent records</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {consents.length > 0 ? (
                  consents.map((consent) => {
                    const Icon = channelIcons[consent.channel];

                    return (
                      <div
                        key={consent.id}
                        className="rounded-lg border border-slate-200 bg-white p-4"
                      >
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                          <div className="flex gap-3">
                            <Icon className="mt-1 size-5 shrink-0 text-primary" />
                            <div>
                              <p className="font-semibold capitalize text-slate-900">
                                {consent.channel}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {formatDate(consent.created_at)}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={consent.consented ? "default" : "outline"}
                          >
                            {consent.consented ? "Consented" : "Declined"}
                          </Badge>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {consent.reason || "No reason provided."}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                          {consent.phone ? <Badge variant="secondary">{consent.phone}</Badge> : null}
                          {consent.email ? <Badge variant="secondary">{consent.email}</Badge> : null}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
                    <CheckCircle2 className="mx-auto mb-3 size-8" />
                    No consent records yet.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Suppression</CardDescription>
                <CardTitle>Recent opt-outs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {optOuts.length > 0 ? (
                  optOuts.map((optOut) => {
                    const Icon = channelIcons[optOut.channel];

                    return (
                      <div
                        key={optOut.id}
                        className="rounded-lg border border-slate-200 bg-white p-4"
                      >
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                          <div className="flex gap-3">
                            <Icon className="mt-1 size-5 shrink-0 text-red-600" />
                            <div>
                              <p className="font-semibold capitalize text-slate-900">
                                {optOut.channel}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {formatDate(optOut.created_at)}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">Blocked</Badge>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {optOut.reason || "No reason provided."}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                          {optOut.phone ? (
                            <Badge variant="secondary">{optOut.phone}</Badge>
                          ) : null}
                          {optOut.email ? (
                            <Badge variant="secondary">{optOut.email}</Badge>
                          ) : null}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
                    <ShieldCheck className="mx-auto mb-3 size-8" />
                    No opt-outs recorded for your account.
                  </div>
                )}
                <Button asChild variant="outline">
                  <Link href="/unsubscribe">Open unsubscribe page</Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
