import Link from "next/link";
import { redirect } from "next/navigation";
import { Megaphone, MessageSquareText, Send } from "lucide-react";
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
import { queueOutreachMessage } from "./actions";

export const metadata = {
  title: "Outreach Composer | MediDove Admin",
};

type Template = {
  id: string;
  name: string;
  channel: "email" | "sms" | "whatsapp" | "voice";
  body: string;
};

type OutboxRecord = {
  id: string;
  channel: "email" | "sms" | "whatsapp" | "voice";
  recipient_name: string | null;
  recipient_phone: string | null;
  recipient_email: string | null;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export default async function AdminOutreachPage() {
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

  const [{ data: templatesData }, { data: outboxData }] = await Promise.all([
    supabase
      .from("message_templates")
      .select("id, name, channel, body")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(40),
    supabase
      .from("communication_outbox")
      .select(
        "id, channel, recipient_name, recipient_phone, recipient_email, subject, message, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const templates = (templatesData || []) as Template[];
  const outbox = (outboxData || []) as OutboxRecord[];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase text-primary">
              Outreach composer
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">
              Queue patient outreach from approved templates
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Prepare WhatsApp, SMS, email, or AI voice follow-up messages for
              provider delivery. This queues records only; no real messages are
              sent in this phase.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/admin/templates">Templates</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/admin">Back to dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <Card>
            <CardHeader>
              <CardDescription>Queue message</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="size-5 text-primary" />
                Compose outreach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form action={queueOutreachMessage} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="channel">Channel</Label>
                    <select
                      id="channel"
                      name="channel"
                      className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="voice">Voice</option>
                      <option value="sms">SMS</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template_id">Template</Label>
                    <select
                      id="template_id"
                      name="template_id"
                      className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">No template</option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient_name">Recipient name</Label>
                  <Input
                    id="recipient_name"
                    name="recipient_name"
                    placeholder="Patient name"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="recipient_phone">Phone</Label>
                    <Input
                      id="recipient_phone"
                      name="recipient_phone"
                      placeholder="+1 555 0100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient_email">Email</Label>
                    <Input
                      id="recipient_email"
                      name="recipient_email"
                      type="email"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Appointment reminder"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={8}
                    placeholder="Paste a template preview or write the final patient-facing message."
                  />
                </div>

                <label className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  <input
                    name="consent_confirmed"
                    type="checkbox"
                    className="mt-1 size-4 rounded border-slate-300"
                  />
                  I confirm this patient has consented to receive this
                  communication.
                </label>

                <Button type="submit">
                  <Send />
                  Queue outreach
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {outbox.length > 0 ? (
              outbox.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div>
                        <CardDescription>{formatDate(item.created_at)}</CardDescription>
                        <CardTitle className="mt-2 text-xl">
                          {item.recipient_name ||
                            item.recipient_phone ||
                            item.recipient_email ||
                            "Queued recipient"}
                        </CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="capitalize">{item.channel}</Badge>
                        <Badge variant="secondary" className="capitalize">
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {item.subject ? (
                      <p className="text-sm font-semibold text-slate-800">
                        {item.subject}
                      </p>
                    ) : null}
                    <p className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                      {item.message}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.recipient_phone ? (
                        <Badge variant="outline">{item.recipient_phone}</Badge>
                      ) : null}
                      {item.recipient_email ? (
                        <Badge variant="outline">{item.recipient_email}</Badge>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-14 text-center text-slate-500">
                  <MessageSquareText className="mx-auto mb-3 size-9" />
                  No queued outreach yet.
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
