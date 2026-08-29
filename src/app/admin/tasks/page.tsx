import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Filter,
  Sparkles,
  UserRound,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "@/components/common/DatePicker";
import { createClient } from "@/lib/supabase/server";
import { createCareTask, generateCareTasks } from "./actions";

export const metadata = {
  title: "Care Tasks | MediDove Admin",
};

import StatusAction from "./StatusAction";
import type { CareTask, ProfileOption } from "./types";
import {
  filters,
  formatDate,
  normalizeFilter,
  priorities,
  profileLabel,
  sourceTypes,
} from "./task-utils";

export default async function AdminTasksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>;
}) {
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

  const params = await searchParams;
  const activeFilter = normalizeFilter(params.status);
  const taskQuery = supabase
    .from("care_tasks")
    .select(
      "id, patient_id, assigned_to, source_type, source_id, title, description, priority, status, due_at, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (activeFilter !== "all") {
    taskQuery.eq("status", activeFilter);
  }

  const [{ data: tasksData }, { data: profilesData }] = await Promise.all([
    taskQuery,
    supabase
      .from("profiles")
      .select("id, full_name, phone, role")
      .in("role", ["admin", "doctor", "receptionist", "patient"])
      .order("created_at", { ascending: false })
      .limit(120),
  ]);

  const tasks = (tasksData || []) as CareTask[];
  const profiles = (profilesData || []) as ProfileOption[];
  const staffProfiles = profiles.filter((item) =>
    ["admin", "doctor", "receptionist"].includes(item.role),
  );
  const patientProfiles = profiles.filter((item) => item.role === "patient");
  const openTasks = tasks.filter((task) => task.status === "open").length;
  const urgentTasks = tasks.filter((task) => task.priority === "urgent").length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="flex flex-col justify-between gap-4 rounded-lg border bg-white p-6 shadow-sm lg:flex-row lg:items-center">
          <div>
            <Badge variant="secondary">Care Coordination</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Staff task board
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Turn AI signals, patient issues, appointment changes, and clinical
              follow-ups into trackable staff work.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <form action={generateCareTasks}>
              <Button type="submit" variant="outline" className="w-full">
                <Sparkles className="h-4 w-4" />
                Generate from AI signals
              </Button>
            </form>
            <Button asChild>
              <Link href="/admin">Back to dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Visible Tasks</CardTitle>
              <ClipboardList className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{tasks.length}</p>
              <p className="text-xs text-slate-500">Matching current filter</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Open</CardTitle>
              <CalendarClock className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{openTasks}</p>
              <p className="text-xs text-slate-500">{urgentTasks} urgent tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{completedTasks}</p>
              <p className="text-xs text-slate-500">Marked done by staff</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Create task</CardTitle>
              <CardDescription>
                Assign care work to staff and optionally link it to a source record.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createCareTask} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Call patient about high urgency feedback"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={5}
                    placeholder="Add context, expected outcome, and patient-safe handling notes."
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      name="priority"
                      className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      defaultValue="medium"
                    >
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source_type">Source</Label>
                    <select
                      id="source_type"
                      name="source_type"
                      className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      defaultValue="manual"
                    >
                      {sourceTypes.map((source) => (
                        <option key={source} value={source}>
                          {source.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source_id">Source record ID</Label>
                  <Input id="source_id" name="source_id" placeholder="Optional" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient_id">Patient</Label>
                  <select
                    id="patient_id"
                    name="patient_id"
                    className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">No patient link</option>
                    {patientProfiles.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.full_name || patient.phone || patient.id}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assigned_to">Assignee</Label>
                  <select
                    id="assigned_to"
                    name="assigned_to"
                    className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Unassigned</option>
                    {staffProfiles.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.full_name || staff.phone || staff.role}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="due_date">Due date</Label>
                    <DatePicker id="due_date" name="due_date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due_time">Due time</Label>
                    <Input id="due_time" name="due_time" type="time" />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Create task
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle>Task queue</CardTitle>
                  <CardDescription>
                    Filter tasks and move work through the care coordination flow.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Filter className="h-4 w-4" />
                    Status
                  </span>
                  {filters.map((filter) => (
                    <Button
                      asChild
                      key={filter}
                      size="sm"
                      variant={filter === activeFilter ? "default" : "outline"}
                    >
                      <Link href={`/admin/tasks?status=${filter}`}>
                        {filter.replaceAll("_", " ")}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {tasks.length > 0 ? (
                <div className="grid gap-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="rounded-md border p-4">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-semibold">{task.title}</h2>
                            <Badge variant="outline">{task.status}</Badge>
                            <Badge
                              variant={
                                task.priority === "urgent" || task.priority === "high"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-slate-500">
                            Created {formatDate(task.created_at)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {task.status !== "in_progress" ? (
                            <StatusAction
                              id={task.id}
                              status="in_progress"
                              label="Start"
                            />
                          ) : null}
                          {task.status !== "done" ? (
                            <StatusAction id={task.id} status="done" label="Done" />
                          ) : null}
                          {task.status !== "cancelled" ? (
                            <StatusAction
                              id={task.id}
                              status="cancelled"
                              label="Cancel"
                            />
                          ) : null}
                        </div>
                      </div>

                      <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                        {task.description || "No extra task details provided."}
                      </p>

                      <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                        <div>
                          <p className="text-xs font-semibold uppercase text-slate-400">
                            Due
                          </p>
                          <p className="mt-1">{formatDate(task.due_at)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase text-slate-400">
                            Assignee
                          </p>
                          <p className="mt-1 flex items-center gap-1">
                            <UserRound className="h-4 w-4 text-slate-400" />
                            {profileLabel(profiles, task.assigned_to)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase text-slate-400">
                            Source
                          </p>
                          <p className="mt-1 break-words">
                            {task.source_type}
                            {task.source_id ? `: ${task.source_id}` : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600">
                  No care tasks match this filter yet.
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
