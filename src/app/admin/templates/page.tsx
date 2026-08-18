import Link from "next/link";
import { redirect } from "next/navigation";
import { Copy, MessageSquareText, Plus, Power } from "lucide-react";
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
import TemplatePreview from "@/components/admin/TemplatePreview";
import { createClient } from "@/lib/supabase/server";
import { createMessageTemplate, toggleMessageTemplate } from "./actions";

export const metadata = {
  title: "Message Templates | MediDove Admin",
};

type MessageTemplate = {
  id: string;
  name: string;
  channel: "email" | "sms" | "whatsapp" | "voice";
  category: string;
  body: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));

export default async function AdminTemplatesPage() {
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
    .from("message_templates")
    .select("id, name, channel, category, body, variables, is_active, created_at")
    .order("created_at", { ascending: false })
    .limit(40);

  const templates = (data || []) as MessageTemplate[];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase text-primary">
              Message templates
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">
              Reusable patient communication library
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Prepare approved replies for appointment confirmations, WhatsApp
              reminders, AI receptionist callbacks, and lead follow-up.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/admin/analytics">Analytics</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/admin">Back to dashboard</Link>
            </Button>
          </div>
        </section>

        <TemplatePreview templates={templates} />

        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <Card>
            <CardHeader>
              <CardDescription>New template</CardDescription>
              <CardTitle>Create approved message</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createMessageTemplate} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Template name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Appointment confirmation"
                  />
                </div>
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
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      placeholder="appointment"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="variables">Variables</Label>
                  <Input
                    id="variables"
                    name="variables"
                    placeholder="patient_name, appointment_time"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Message body</Label>
                  <Textarea
                    id="body"
                    name="body"
                    rows={8}
                    placeholder="Hi {{patient_name}}, your MediDove appointment is confirmed for {{appointment_time}}."
                  />
                </div>
                <Button type="submit">
                  <Plus />
                  Add template
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {templates.length > 0 ? (
              templates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div>
                        <CardDescription>{formatDate(template.created_at)}</CardDescription>
                        <CardTitle className="mt-2 text-xl">{template.name}</CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="capitalize">{template.channel}</Badge>
                        <Badge variant="secondary" className="capitalize">
                          {template.category.replaceAll("_", " ")}
                        </Badge>
                        <Badge variant={template.is_active ? "default" : "outline"}>
                          {template.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
                        <Copy className="size-3.5" />
                        Template body
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {template.body}
                      </p>
                    </div>
                    {template.variables.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {template.variables.map((variable) => (
                          <Badge key={variable} variant="outline">
                            {`{{${variable}}}`}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                    <form action={toggleMessageTemplate}>
                      <input type="hidden" name="id" value={template.id} />
                      <input
                        type="hidden"
                        name="is_active"
                        value={String(template.is_active)}
                      />
                      <Button type="submit" variant="outline" size="sm">
                        <Power />
                        {template.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-14 text-center text-slate-500">
                  <MessageSquareText className="mx-auto mb-3 size-9" />
                  No templates yet.
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
