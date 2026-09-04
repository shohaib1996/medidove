import Link from "next/link";
import { redirect } from "next/navigation";
import { Bot, Filter, Inbox, Mail, Phone, UserRound } from "lucide-react";
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
import GlobalPagination from "@/components/common/GlobalPagination";
import ReplyToLeadForm from "@/components/common/ReplyToLeadForm";
import { replyToAiLead } from "./actions";

export const metadata = {
  title: "AI Leads | MediDove Admin",
};

const PAGE_SIZE = 6;

type LeadStatusFilter = "all" | "new" | "contacted" | "converted" | "closed";

const statuses: LeadStatusFilter[] = ["all", "new", "contacted", "converted", "closed"];

const normalizeStatus = (
  value: string | string[] | undefined,
): LeadStatusFilter => {
  const status = Array.isArray(value) ? value[0] : value;

  return statuses.includes(status as LeadStatusFilter)
    ? (status as LeadStatusFilter)
    : "all";
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

export default async function AdminAiLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string | string[] }>;
}) {
  const params = await searchParams;
  const activeStatus = normalizeStatus(params.status);
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

  const listQuery = supabase
    .from("ai_leads")
    .select(
      "id, session_id, visitor_id, name, email, phone, interest, summary, urgency, status, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(300);

  if (activeStatus !== "all") {
    listQuery.eq("status", activeStatus);
  }

  const [{ data: leadsData }, { data: statsData }] = await Promise.all([
    listQuery,
    supabase.from("ai_leads").select("status, urgency").limit(1000),
  ]);

  const filteredLeads = (leadsData || []) as AiLead[];
  const allLeads = (statsData || []) as { status: string; urgency: string }[];
  const newLeads = allLeads.filter((lead) => lead.status === "new").length;
  const highUrgency = allLeads.filter((lead) => lead.urgency === "high").length;
  const converted = allLeads.filter((lead) => lead.status === "converted").length;

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE));
  const page = Math.min(
    Math.max(1, Number.parseInt(params.page || "1", 10) || 1),
    totalPages,
  );
  const leads = filteredLeads.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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

        <section className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Visible Leads</CardTitle>
              <Inbox className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{filteredLeads.length}</p>
              <p className="text-xs text-slate-500">Matching current filter</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">New AI leads</CardTitle>
              <Bot className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{newLeads}</p>
              <p className="text-xs text-slate-500">Need first response, all leads</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">High Urgency</CardTitle>
              <Phone className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{highUrgency}</p>
              <p className="text-xs text-slate-500">Flagged by urgency keywords</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Converted</CardTitle>
              <UserRound className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{converted}</p>
              <p className="text-xs text-slate-500">Turned into a booked patient</p>
            </CardContent>
          </Card>
        </section>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Filter className="h-4 w-4" />
            Status
          </span>
          {statuses.map((status) => (
            <Button
              asChild
              key={status}
              size="sm"
              variant={status === activeStatus ? "default" : "outline"}
            >
              <Link href={`/admin/ai-leads?status=${status}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Link>
            </Button>
          ))}
        </div>

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
                  {lead.email ? (
                    <ReplyToLeadForm
                      leadId={lead.id}
                      email={lead.email}
                      action={replyToAiLead}
                      defaultSubject="Re: your message to MediDove"
                      defaultMessage=""
                    />
                  ) : (
                    <p className="text-xs text-slate-400">
                      No email captured for this lead — reply by phone instead.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-14 text-center text-slate-500">
                <Bot className="mx-auto mb-3 size-9" />
                {activeStatus === "all"
                  ? "No AI leads captured yet."
                  : "No AI leads match this filter yet."}
              </CardContent>
            </Card>
          )}
        </section>

        <GlobalPagination
          page={page}
          totalPages={totalPages}
          buildHref={(targetPage) => {
            const target = new URLSearchParams();
            if (activeStatus !== "all") target.set("status", activeStatus);
            target.set("page", String(targetPage));
            return `/admin/ai-leads?${target.toString()}`;
          }}
        />
      </div>
    </main>
  );
}
