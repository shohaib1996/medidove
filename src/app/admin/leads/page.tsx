import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BrainCircuit,
  Filter,
  Inbox,
  Mail,
  MessageSquareText,
  Phone,
  ShieldAlert,
  UserCheck,
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
import { updateAdminRecordStatus } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/server";
import GlobalPagination from "@/components/common/GlobalPagination";
import ReplyToLeadForm from "./ReplyToLeadForm";

export const metadata = {
  title: "Lead Pipeline | MediDove Admin",
};

const PAGE_SIZE = 6;

type LeadStatus = "all" | "new" | "contacted" | "converted" | "closed";

type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  ai_category: string | null;
  ai_summary: string | null;
  ai_urgency: string | null;
  ai_suggested_reply: string | null;
  status: string;
  created_at: string;
};

const statuses: LeadStatus[] = [
  "all",
  "new",
  "contacted",
  "converted",
  "closed",
];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const normalizeStatus = (value: string | string[] | undefined): LeadStatus => {
  const status = Array.isArray(value) ? value[0] : value;

  return statuses.includes(status as LeadStatus) ? (status as LeadStatus) : "all";
};

const StatusAction = ({
  id,
  status,
  label,
}: {
  id: string;
  status: Exclude<LeadStatus, "all">;
  label: string;
}) => (
  <form action={updateAdminRecordStatus}>
    <input type="hidden" name="table" value="contact_leads" />
    <input type="hidden" name="id" value={id} />
    <input type="hidden" name="status" value={status} />
    <Button type="submit" variant="outline" size="sm">
      {label}
    </Button>
  </form>
);

const AdminLeadsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[]; page?: string }>;
}) => {
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
              Lead pipeline data is available only to admin users.
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

  const params = await searchParams;
  const activeStatus = normalizeStatus(params.status);
  const listQuery = supabase
    .from("contact_leads")
    .select(
      "id, name, email, phone, subject, message, ai_category, ai_summary, ai_urgency, ai_suggested_reply, status, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(300);

  if (activeStatus !== "all") {
    listQuery.eq("status", activeStatus);
  }

  const [{ data: leadsData }, { data: statsData }] = await Promise.all([
    listQuery,
    supabase.from("contact_leads").select("status, ai_urgency").limit(1000),
  ]);

  const filteredLeads = (leadsData || []) as LeadRow[];
  const allLeads = (statsData || []) as { status: string; ai_urgency: string | null }[];
  const newLeads = allLeads.filter((lead) => lead.status === "new").length;
  const contacted = allLeads.filter((lead) => lead.status === "contacted").length;
  const converted = allLeads.filter((lead) => lead.status === "converted").length;
  const highUrgency = allLeads.filter((lead) => lead.ai_urgency === "high").length;

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE));
  const page = Math.min(
    Math.max(1, Number.parseInt(params.page || "1", 10) || 1),
    totalPages,
  );
  const leads = filteredLeads.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="flex flex-col justify-between gap-4 rounded-lg border bg-white p-6 shadow-sm lg:flex-row lg:items-center">
          <div>
            <Badge variant="secondary">AI Intake Pipeline</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Lead management
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Review website inquiries with AI triage, suggested replies, urgency
              detection, and conversion tracking.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/contact">Public contact</Link>
            </Button>
            <Button asChild>
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
              <CardTitle className="text-sm font-medium">New</CardTitle>
              <MessageSquareText className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{newLeads}</p>
              <p className="text-xs text-slate-500">Need first response, all leads</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Contacted</CardTitle>
              <UserCheck className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{contacted}</p>
              <p className="text-xs text-slate-500">Follow-up in progress, all leads</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Converted</CardTitle>
              <BrainCircuit className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{converted}</p>
              <p className="text-xs text-slate-500">
                {highUrgency} high urgency leads overall
              </p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Lead queue</CardTitle>
                <CardDescription>
                  Use AI triage to prioritize inquiries and move leads forward.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
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
                    <Link href={`/admin/leads?status=${status}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {leads.length > 0 ? (
              <div className="grid gap-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="rounded-md border p-4">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-semibold">{lead.name}</h2>
                          <Badge variant="outline">{lead.status}</Badge>
                          {lead.ai_urgency ? (
                            <Badge
                              variant={
                                lead.ai_urgency === "high"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {lead.ai_urgency} urgency
                            </Badge>
                          ) : null}
                          {lead.ai_category ? (
                            <Badge variant="secondary">{lead.ai_category}</Badge>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          Received {formatDate(lead.created_at)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {lead.status !== "contacted" ? (
                          <StatusAction
                            id={lead.id}
                            status="contacted"
                            label="Mark contacted"
                          />
                        ) : null}
                        {lead.status !== "converted" ? (
                          <StatusAction
                            id={lead.id}
                            status="converted"
                            label="Convert"
                          />
                        ) : null}
                        {lead.status !== "closed" ? (
                          <StatusAction id={lead.id} status="closed" label="Close" />
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 text-sm text-slate-600 md:grid-cols-3">
                      <div className="flex gap-2">
                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <span className="wrap-break-word">{lead.email}</span>
                      </div>
                      <div className="flex gap-2">
                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <span>{lead.phone || "No phone provided"}</span>
                      </div>
                      <div className="flex gap-2">
                        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <span>{lead.subject || "General inquiry"}</span>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div className="rounded-md bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Patient message
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {lead.message}
                        </p>
                      </div>
                      <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
                        <p className="text-xs font-semibold uppercase text-primary">
                          AI summary and reply
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {lead.ai_summary || "No AI summary generated yet."}
                        </p>
                        <div className="mt-3 rounded-md bg-white p-3 text-sm leading-6 text-slate-700">
                          {lead.ai_suggested_reply ||
                            "No suggested reply generated yet."}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <ReplyToLeadForm
                        leadId={lead.id}
                        email={lead.email}
                        defaultSubject={
                          lead.subject
                            ? `Re: ${lead.subject}`
                            : "Re: your message to MediDove"
                        }
                        defaultMessage={
                          lead.ai_suggested_reply ||
                          `Hi ${lead.name}, thanks for contacting MediDove. A clinic coordinator will follow up shortly.`
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600">
                No leads match this filter yet.
              </p>
            )}
          </CardContent>
        </Card>

        <GlobalPagination
          page={page}
          totalPages={totalPages}
          buildHref={(targetPage) => {
            const target = new URLSearchParams();
            if (activeStatus !== "all") target.set("status", activeStatus);
            target.set("page", String(targetPage));
            return `/admin/leads?${target.toString()}`;
          }}
        />
      </div>
    </main>
  );
};

export default AdminLeadsPage;
