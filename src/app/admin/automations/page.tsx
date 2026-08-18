import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bot,
  CalendarClock,
  MessageCircle,
  PlayCircle,
  Power,
  Workflow,
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
import { createClient } from "@/lib/supabase/server";
import {
  createAutomationRule,
  runAutomationsNow,
  toggleAutomationRule,
} from "./actions";

export const metadata = {
  title: "Automation Rules | MediDove Admin",
};

type AutomationRule = {
  id: string;
  name: string;
  trigger_event: string;
  channel: string;
  audience: string;
  delay_minutes: number;
  template_id: string | null;
  instructions: string;
  is_active: boolean;
  created_at: string;
};

type MessageTemplate = {
  id: string;
  name: string;
  channel: string;
  category: string;
  is_active: boolean;
};

const triggerOptions = [
  "appointment_created",
  "appointment_confirmed",
  "appointment_reminder",
  "missed_appointment",
  "lead_created",
  "lead_high_urgency",
  "recall_due",
  "post_visit_follow_up",
];

const audienceOptions = [
  "all_patients",
  "new_patients",
  "confirmed_appointments",
  "missed_appointments",
  "high_urgency_leads",
  "inactive_patients",
];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const formatDelay = (minutes: number) => {
  if (minutes === 0) {
    return "Immediate";
  }

  if (minutes < 60) {
    return `${minutes} min delay`;
  }

  if (minutes % 1440 === 0) {
    return `${minutes / 1440} day delay`;
  }

  if (minutes % 60 === 0) {
    return `${minutes / 60} hour delay`;
  }

  return `${minutes} min delay`;
};

const AdminAutomationsPage = async () => {
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
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <Card className="mx-auto max-w-xl">
          <CardHeader>
            <CardTitle>Admin access required</CardTitle>
            <CardDescription>
              Automation settings are available only to admin users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">Return home</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const [{ data: rulesData }, { data: templatesData }] = await Promise.all([
    supabase
      .from("automation_rules")
      .select(
        "id, name, trigger_event, channel, audience, delay_minutes, template_id, instructions, is_active, created_at",
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("message_templates")
      .select("id, name, channel, category, is_active")
      .eq("is_active", true)
      .order("name", { ascending: true }),
  ]);

  const rules = (rulesData || []) as AutomationRule[];
  const templates = (templatesData || []) as MessageTemplate[];
  const activeRules = rules.filter((rule) => rule.is_active).length;
  const voiceRules = rules.filter((rule) => rule.channel === "voice").length;
  const whatsappRules = rules.filter((rule) => rule.channel === "whatsapp").length;
  const templateById = new Map(templates.map((template) => [template.id, template]));

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="flex flex-col justify-between gap-4 rounded-lg border bg-white p-6 shadow-sm lg:flex-row lg:items-center">
          <div>
            <Badge variant="secondary">Care Automation</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              AI automation rules
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Configure follow-up playbooks for reminders, recalls, lead
              nurturing, and AI receptionist handoffs.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <form action={runAutomationsNow}>
              <Button type="submit" variant="outline" className="w-full">
                <PlayCircle className="mr-2 h-4 w-4" />
                Run now
              </Button>
            </form>
            <Button asChild variant="outline">
              <Link href="/admin/templates">Message templates</Link>
            </Button>
            <Button asChild>
              <Link href="/admin">Back to dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Rules</CardTitle>
              <Workflow className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{rules.length}</p>
              <p className="text-xs text-slate-500">{activeRules} active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Templates</CardTitle>
              <MessageCircle className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{templates.length}</p>
              <p className="text-xs text-slate-500">Available for automation</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Voice</CardTitle>
              <Bot className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{voiceRules}</p>
              <p className="text-xs text-slate-500">Receptionist playbooks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">WhatsApp</CardTitle>
              <MessageCircle className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{whatsappRules}</p>
              <p className="text-xs text-slate-500">Chat follow-up rules</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Create automation</CardTitle>
              <CardDescription>
                Add a rule that a background worker or webhook can execute later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createAutomationRule} className="space-y-4">
                <div>
                  <label className="text-sm font-medium" htmlFor="name">
                    Rule name
                  </label>
                  <input
                    className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
                    id="name"
                    name="name"
                    placeholder="24 hour appointment reminder"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium" htmlFor="trigger_event">
                    Trigger
                  </label>
                  <select
                    className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
                    id="trigger_event"
                    name="trigger_event"
                    defaultValue="appointment_reminder"
                  >
                    {triggerOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium" htmlFor="channel">
                      Channel
                    </label>
                    <select
                      className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
                      id="channel"
                      name="channel"
                      defaultValue="whatsapp"
                    >
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="voice">Voice</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium" htmlFor="delay_minutes">
                      Delay minutes
                    </label>
                    <input
                      className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
                      id="delay_minutes"
                      min="0"
                      name="delay_minutes"
                      type="number"
                      defaultValue="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium" htmlFor="audience">
                    Audience
                  </label>
                  <select
                    className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
                    id="audience"
                    name="audience"
                    defaultValue="confirmed_appointments"
                  >
                    {audienceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium" htmlFor="template_id">
                    Template
                  </label>
                  <select
                    className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
                    id="template_id"
                    name="template_id"
                    defaultValue=""
                  >
                    <option value="">No template</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name} - {template.channel}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium" htmlFor="instructions">
                    AI instructions
                  </label>
                  <textarea
                    className="mt-2 min-h-28 w-full rounded-md border px-3 py-2 text-sm"
                    id="instructions"
                    name="instructions"
                    placeholder="Use a polite clinical tone. Mention appointment time and ask the patient to confirm."
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Save rule
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Automation playbooks</CardTitle>
              <CardDescription>
                Active rules can later be connected to cron jobs, webhooks, or
                provider callbacks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rules.length > 0 ? (
                <div className="grid gap-4">
                  {rules.map((rule) => {
                    const template = rule.template_id
                      ? templateById.get(rule.template_id)
                      : null;

                    return (
                      <div key={rule.id} className="rounded-md border p-4">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-lg font-semibold">{rule.name}</h2>
                              <Badge variant={rule.is_active ? "default" : "outline"}>
                                {rule.is_active ? "Active" : "Paused"}
                              </Badge>
                              <Badge variant="secondary">{rule.channel}</Badge>
                            </div>
                            <p className="mt-1 text-sm text-slate-500">
                              {rule.trigger_event.replaceAll("_", " ")} -{" "}
                              {formatDelay(rule.delay_minutes)}
                            </p>
                          </div>
                          <form action={toggleAutomationRule}>
                            <input type="hidden" name="id" value={rule.id} />
                            <input
                              type="hidden"
                              name="is_active"
                              value={String(rule.is_active)}
                            />
                            <Button type="submit" variant="outline" size="sm">
                              <Power className="mr-2 h-4 w-4" />
                              {rule.is_active ? "Pause" : "Activate"}
                            </Button>
                          </form>
                        </div>

                        <div className="mt-4 grid gap-4 text-sm md:grid-cols-3">
                          <div>
                            <p className="text-xs font-semibold uppercase text-slate-400">
                              Audience
                            </p>
                            <p className="mt-1 text-slate-700">
                              {rule.audience.replaceAll("_", " ")}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase text-slate-400">
                              Template
                            </p>
                            <p className="mt-1 text-slate-700">
                              {template?.name || "No template attached"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase text-slate-400">
                              Created
                            </p>
                            <p className="mt-1 text-slate-700">
                              <CalendarClock className="mr-1 inline h-4 w-4" />
                              {formatDate(rule.created_at)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                          {rule.instructions}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-600">
                  No automation rules yet. Create one to show the care automation
                  workflow.
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
};

export default AdminAutomationsPage;
