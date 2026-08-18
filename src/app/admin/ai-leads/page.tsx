import Link from "next/link";
import { redirect } from "next/navigation";
import { Bot, Mail, Phone, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateAdminRecordStatus } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "AI Leads | MediDove Admin",
};

type AiLead = {
  id: string;
  session_id: string | null;
  visitor_id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  interest: string;
  summary: string;
  urgency: string;
  status: string;
  created_at: string;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const StatusAction = ({
  id,
  status,
  label,
}: {
  id: string;
  status: string;
  label: string;
}) => (
  <form action={updateAdminRecordStatus}>
    <input type="hidden" name="table" value="ai_leads" />
    <input type="hidden" name="id" value={id} />
    <input type="hidden" name="status" value={status} />
    <Button type="submit" variant="outline" size="sm">
      {label}
    </Button>
  </form>
);

export default async function AdminAiLeadsPage() {
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
    .from("ai_leads")
    .select(
      "id, session_id, visitor_id, name, email, phone, interest, summary, urgency, status, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(80);

  const leads = (data || []) as AiLead[];
  const newLeads = leads.filter((lead) => lead.status === "new").length;
  const highUrgency = leads.filter((lead) => lead.urgency === "high").length;
  const converted = leads.filter((lead) => lead.status === "converted").length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase text-primary">
              AI lead capture
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">
              Chat leads from the website assistant
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              When a visitor shares contact details while asking for booking,
              callback, WhatsApp, or service help, the assistant creates a lead
              for staff follow-up.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/admin/conversations">Conversations</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/admin">Back to dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>New AI leads</CardDescription>
                <CardTitle className="mt-2 text-3xl">{newLeads}</CardTitle>
              </div>
              <Bot className="size-8 text-primary" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>High urgency</CardDescription>
                <CardTitle className="mt-2 text-3xl">{highUrgency}</CardTitle>
              </div>
              <Phone className="size-8 text-red-600" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Converted</CardDescription>
                <CardTitle className="mt-2 text-3xl">{converted}</CardTitle>
              </div>
              <UserRound className="size-8 text-emerald-600" />
            </CardHeader>
          </Card>
        </section>

        <section className="grid gap-4">
          {leads.length > 0 ? (
            leads.map((lead) => (
              <Card key={lead.id}>
                <CardHeader>
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <CardDescription>{formatDate(lead.created_at)}</CardDescription>
                      <CardTitle className="mt-2 text-xl">
                        {lead.name || lead.phone || lead.email || "Website visitor"}
                      </CardTitle>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="capitalize">
                        {lead.interest.replaceAll("_", " ")}
                      </Badge>
                      <Badge variant="secondary" className="capitalize">
                        {lead.status}
                      </Badge>
                      <Badge
                        variant={lead.urgency === "high" ? "default" : "outline"}
                        className={
                          lead.urgency === "high"
                            ? "bg-red-600 text-white"
                            : "capitalize"
                        }
                      >
                        {lead.urgency}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    {lead.summary}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {lead.phone ? (
                      <Badge variant="outline">
                        <Phone className="size-3.5" />
                        {lead.phone}
                      </Badge>
                    ) : null}
                    {lead.email ? (
                      <Badge variant="outline">
                        <Mail className="size-3.5" />
                        {lead.email}
                      </Badge>
                    ) : null}
                    {lead.visitor_id ? (
                      <Badge variant="outline">Visitor {lead.visitor_id}</Badge>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusAction id={lead.id} status="contacted" label="Contacted" />
                    <StatusAction id={lead.id} status="converted" label="Convert" />
                    <StatusAction id={lead.id} status="closed" label="Close" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-14 text-center text-slate-500">
                <Bot className="mx-auto mb-3 size-9" />
                No AI leads captured yet.
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}
