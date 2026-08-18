import Link from "next/link";
import { redirect } from "next/navigation";
import { Ban, Mail, MessageCircle, Phone } from "lucide-react";
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
import type { Channel } from "@/lib/supabase/database.types";

export const metadata = {
  title: "Opt-Outs | MediDove Admin",
};

type OptOutRow = {
  id: string;
  channel: Channel;
  phone: string | null;
  email: string | null;
  reason: string | null;
  source: string;
  created_at: string;
};

const channelIcons: Record<Channel, typeof Mail> = {
  email: Mail,
  sms: Phone,
  whatsapp: MessageCircle,
  voice: Phone,
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export default async function AdminOptOutsPage() {
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

  const { data } = await supabase
    .from("opt_outs")
    .select("id, channel, phone, email, reason, source, created_at")
    .order("created_at", { ascending: false })
    .limit(80);

  const optOuts = (data || []) as OptOutRow[];
  const channels = ["email", "sms", "whatsapp", "voice"] as const;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase text-primary">
              Suppression list
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">
              Communication opt-outs
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Review public unsubscribe requests that block future queued SMS,
              WhatsApp, email, and voice outreach.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/unsubscribe">Public opt-out</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/admin">Back to dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {channels.map((channel) => {
            const count = optOuts.filter((item) => item.channel === channel).length;
            const Icon = channelIcons[channel];

            return (
              <Card key={channel}>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardDescription className="capitalize">{channel}</CardDescription>
                    <CardTitle className="mt-2 text-3xl">{count}</CardTitle>
                  </div>
                  <Icon className="size-8 text-primary" />
                </CardHeader>
              </Card>
            );
          })}
        </section>

        <Card>
          <CardHeader>
            <CardDescription>Latest records</CardDescription>
            <CardTitle>Blocked recipients</CardTitle>
          </CardHeader>
          <CardContent>
            {optOuts.length > 0 ? (
              <div className="grid gap-4">
                {optOuts.map((optOut) => {
                  const Icon = channelIcons[optOut.channel];

                  return (
                    <div key={optOut.id} className="rounded-lg border p-4">
                      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                        <div className="flex gap-3">
                          <Icon className="mt-1 size-5 shrink-0 text-red-600" />
                          <div>
                            <p className="font-semibold capitalize">
                              {optOut.channel} opt-out
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {formatDate(optOut.created_at)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">{optOut.source}</Badge>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {optOut.phone ? (
                          <Badge variant="secondary">{optOut.phone}</Badge>
                        ) : null}
                        {optOut.email ? (
                          <Badge variant="secondary">{optOut.email}</Badge>
                        ) : null}
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-600">
                        {optOut.reason || "No reason provided."}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center text-slate-500">
                <Ban className="mx-auto mb-3 size-9" />
                No opt-outs recorded yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
