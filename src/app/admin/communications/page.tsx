import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bot,
  Filter,
  Headphones,
  MessageCircle,
  PhoneCall,
  Send,
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

export const metadata = {
  title: "Communication Inbox | MediDove Admin",
};

const PAGE_SIZE = 6;

type ChannelFilter = "all" | "voice" | "whatsapp";

type CallStatus = "requested" | "contacted" | "completed" | "failed";

type CallLogRow = {
  id: string;
  phone_number: string;
  direction: "inbound" | "outbound";
  provider: string;
  transcript: string | null;
  ai_summary: string | null;
  status: string | null;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
};

type WhatsAppMessageRow = {
  id: string;
  phone_number: string;
  direction: "inbound" | "outbound";
  message: string;
  status: string | null;
  created_at: string;
};

const channels: ChannelFilter[] = ["all", "voice", "whatsapp"];

const formatDate = (value: string | null) => {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const normalizeChannel = (
  value: string | string[] | undefined,
): ChannelFilter => {
  const channel = Array.isArray(value) ? value[0] : value;

  return channels.includes(channel as ChannelFilter)
    ? (channel as ChannelFilter)
    : "all";
};

const CallStatusAction = ({
  id,
  status,
  label,
}: {
  id: string;
  status: CallStatus;
  label: string;
}) => (
  <form action={updateAdminRecordStatus}>
    <input type="hidden" name="table" value="call_logs" />
    <input type="hidden" name="id" value={id} />
    <input type="hidden" name="status" value={status} />
    <Button type="submit" variant="outline" size="sm">
      {label}
    </Button>
  </form>
);

const AdminCommunicationsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ channel?: string | string[]; page?: string }>;
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
              Communication inbox data is available only to admin users.
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
  const activeChannel = normalizeChannel(params.channel);
  const [{ data: callLogsData }, { data: whatsAppData }] = await Promise.all([
    supabase
      .from("call_logs")
      .select(
        "id, phone_number, direction, provider, transcript, ai_summary, status, started_at, ended_at, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(300),
    supabase
      .from("whatsapp_messages")
      .select("id, phone_number, direction, message, status, created_at")
      .order("created_at", { ascending: false })
      .limit(80),
  ]);

  const callLogs = (callLogsData || []) as CallLogRow[];
  const whatsAppMessages = (whatsAppData || []) as WhatsAppMessageRow[];
  const visibleCalls = activeChannel === "whatsapp" ? [] : callLogs;
  const visibleWhatsApp = activeChannel === "voice" ? [] : whatsAppMessages;

  const totalPages = Math.max(1, Math.ceil(visibleCalls.length / PAGE_SIZE));
  const page = Math.min(
    Math.max(1, Number.parseInt(params.page || "1", 10) || 1),
    totalPages,
  );
  const pagedCalls = visibleCalls.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const requestedCalls = callLogs.filter((call) => call.status === "requested").length;
  const completedCalls = callLogs.filter((call) => call.status === "completed").length;
  const requestedWhatsApp = whatsAppMessages.filter(
    (message) => message.status === "requested",
  ).length;
  const queuedWhatsApp = whatsAppMessages.filter(
    (message) => message.status === "queued",
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="flex flex-col justify-between gap-4 rounded-lg border bg-white p-6 shadow-sm lg:flex-row lg:items-center">
          <div>
            <Badge variant="secondary">AI Reception Desk</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Communication inbox
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Track AI receptionist calls and WhatsApp conversations from one
              operational view.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/receptionist">Voice receptionist</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/engagement">WhatsApp intake</Link>
            </Button>
            <Button asChild>
              <Link href="/admin">Back to dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Requested Calls</CardTitle>
              <PhoneCall className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{requestedCalls}</p>
              <p className="text-xs text-slate-500">Need staff callback</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Completed Calls</CardTitle>
              <Headphones className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{completedCalls}</p>
              <p className="text-xs text-slate-500">Handled voice records</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-1.5 text-sm font-medium">
                WhatsApp Requests
                <Badge variant="secondary">Coming soon</Badge>
              </CardTitle>
              <MessageCircle className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{requestedWhatsApp}</p>
              <p className="text-xs text-slate-500">New patient messages</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-1.5 text-sm font-medium">
                Queued WhatsApp
                <Badge variant="secondary">Coming soon</Badge>
              </CardTitle>
              <Send className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{queuedWhatsApp}</p>
              <p className="text-xs text-slate-500">Waiting for delivery</p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Inbox queue</CardTitle>
                <CardDescription>
                  Filter communication channels and move follow-ups through the queue.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Filter className="h-4 w-4" />
                  Channel
                </span>
                {channels.map((channel) =>
                  channel === "whatsapp" ? (
                    <Button key={channel} size="sm" variant="outline" disabled>
                      WhatsApp
                      <Badge variant="secondary" className="ml-1.5">
                        Coming soon
                      </Badge>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      key={channel}
                      size="sm"
                      variant={channel === activeChannel ? "default" : "outline"}
                    >
                      <Link href={`/admin/communications?channel=${channel}`}>
                        {channel.charAt(0).toUpperCase() + channel.slice(1)}
                      </Link>
                    </Button>
                  ),
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {visibleCalls.length > 0 ? (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Voice receptionist logs</h2>
                  <Badge variant="outline">{visibleCalls.length} total</Badge>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {pagedCalls.map((call) => (
                    <div key={call.id} className="rounded-md border p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">{call.phone_number}</h3>
                            <Badge variant="outline">{call.direction}</Badge>
                            <Badge variant="secondary">
                              {call.status || "untracked"}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-slate-500">
                            {call.provider} - {formatDate(call.created_at)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {call.status !== "contacted" ? (
                            <CallStatusAction
                              id={call.id}
                              status="contacted"
                              label="Contacted"
                            />
                          ) : null}
                          {call.status !== "completed" ? (
                            <CallStatusAction
                              id={call.id}
                              status="completed"
                              label="Complete"
                            />
                          ) : null}
                        </div>
                      </div>
                      <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                        {call.ai_summary || call.transcript || "No transcript recorded yet."}
                      </div>
                    </div>
                  ))}
                </div>
                <GlobalPagination
                  page={page}
                  totalPages={totalPages}
                  buildHref={(targetPage) => {
                    const target = new URLSearchParams();
                    if (activeChannel !== "all") target.set("channel", activeChannel);
                    target.set("page", String(targetPage));
                    return `/admin/communications?${target.toString()}`;
                  }}
                  className="mt-2"
                />
              </section>
            ) : null}

            {visibleWhatsApp.length > 0 ? (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">WhatsApp messages</h2>
                  <Badge variant="secondary">Coming soon</Badge>
                </div>
                <p className="text-sm text-slate-500">
                  WhatsApp delivery is not live yet, so these are opt-in
                  requests waiting on staff — no automatic queue or send
                  actions are available for this channel.
                </p>
                <div className="grid gap-4 lg:grid-cols-2">
                  {visibleWhatsApp.map((message) => (
                    <div key={message.id} className="rounded-md border p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">{message.phone_number}</h3>
                            <Badge variant="outline">{message.direction}</Badge>
                            <Badge variant="secondary">
                              {message.status || "untracked"}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-slate-500">
                            {formatDate(message.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                        {message.message}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {visibleCalls.length === 0 && visibleWhatsApp.length === 0 ? (
              <p className="text-sm text-slate-600">
                No communication records match this channel filter yet.
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AdminCommunicationsPage;
