import Link from "next/link";
import { redirect } from "next/navigation";
import { Activity, FileClock, Filter, ShieldCheck, UserRound } from "lucide-react";
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
import type { Json } from "@/lib/supabase/database.types";

export const metadata = {
  title: "Audit Logs | MediDove Admin",
};

type AuditFilter =
  | "all"
  | "status_updated"
  | "clinical_note_created"
  | "clinical_note_status_updated"
  | "doctor_availability_created"
  | "doctor_availability_toggled"
  | "doctor_profile_linked"
  | "appointment_doctor_assigned"
  | "feedback_status_updated"
  | "care_task_created"
  | "care_task_status_updated"
  | "care_tasks_generated"
  | "automation_runner_executed"
  | "outbox_dispatch_executed"
  | "outbox_dispatch_blocked";

type AuditLog = {
  id: string;
  actor_id: string | null;
  actor_type: string;
  event_type: string;
  entity_type: string;
  entity_id: string | null;
  summary: string;
  metadata: Json;
  created_at: string;
};

const filters: AuditFilter[] = [
  "all",
  "status_updated",
  "clinical_note_created",
  "clinical_note_status_updated",
  "doctor_availability_created",
  "doctor_availability_toggled",
  "doctor_profile_linked",
  "appointment_doctor_assigned",
  "feedback_status_updated",
  "care_task_created",
  "care_task_status_updated",
  "care_tasks_generated",
  "automation_runner_executed",
  "outbox_dispatch_executed",
  "outbox_dispatch_blocked",
];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const normalizeFilter = (value: string | string[] | undefined): AuditFilter => {
  const filter = Array.isArray(value) ? value[0] : value;

  return filters.includes(filter as AuditFilter)
    ? (filter as AuditFilter)
    : "all";
};

const compactJson = (metadata: Json) => {
  if (!metadata || typeof metadata !== "object") {
    return "{}";
  }

  return JSON.stringify(metadata, null, 2);
};

const AdminAuditPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ event?: string | string[] }>;
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
              Audit logs are available only to admin users.
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
  const activeFilter = normalizeFilter(params.event);
  const query = supabase
    .from("audit_logs")
    .select(
      "id, actor_id, actor_type, event_type, entity_type, entity_id, summary, metadata, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (activeFilter !== "all") {
    query.eq("event_type", activeFilter);
  }

  const { data: logsData } = await query;
  const logs = (logsData || []) as AuditLog[];
  const adminEvents = logs.filter((log) => log.actor_type === "admin").length;
  const systemEvents = logs.filter((log) => log.actor_type === "system").length;
  const communicationEvents = logs.filter((log) =>
    log.entity_type.includes("communication"),
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="flex flex-col justify-between gap-4 rounded-lg border bg-white p-6 shadow-sm lg:flex-row lg:items-center">
          <div>
            <Badge variant="secondary">Compliance Trail</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Audit logs
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Review admin actions, automation runs, and delivery attempts for
              patient communication governance.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin">Back to dashboard</Link>
          </Button>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Visible Events</CardTitle>
              <FileClock className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{logs.length}</p>
              <p className="text-xs text-slate-500">Matching current filter</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Admin Events</CardTitle>
              <UserRound className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{adminEvents}</p>
              <p className="text-xs text-slate-500">Human operator changes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">System Events</CardTitle>
              <Activity className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{systemEvents}</p>
              <p className="text-xs text-slate-500">Automation and dispatch runs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Communication</CardTitle>
              <ShieldCheck className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{communicationEvents}</p>
              <p className="text-xs text-slate-500">Outbox related records</p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Event trail</CardTitle>
                <CardDescription>
                  Filter critical workflow events and inspect stored metadata.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Filter className="h-4 w-4" />
                  Event
                </span>
                {filters.map((filter) => (
                  <Button
                    asChild
                    key={filter}
                    size="sm"
                    variant={filter === activeFilter ? "default" : "outline"}
                  >
                    <Link href={`/admin/audit?event=${filter}`}>
                      {filter.replaceAll("_", " ")}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {logs.length > 0 ? (
              <div className="grid gap-4">
                {logs.map((log) => (
                  <div key={log.id} className="rounded-md border p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-semibold">{log.summary}</h2>
                          <Badge variant="outline">{log.actor_type}</Badge>
                          <Badge variant="secondary">
                            {log.event_type.replaceAll("_", " ")}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          {formatDate(log.created_at)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{log.entity_type}</Badge>
                        {log.entity_id ? (
                          <Badge variant="outline">{log.entity_id}</Badge>
                        ) : null}
                      </div>
                    </div>
                    <pre className="mt-4 max-h-52 overflow-auto rounded-md bg-slate-950 p-4 text-xs leading-5 text-slate-100">
                      {compactJson(log.metadata)}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600">
                No audit events match this filter yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AdminAuditPage;
