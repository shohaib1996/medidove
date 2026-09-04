import Link from "next/link";
import { redirect } from "next/navigation";
import { Bot, MessageSquareText, UserRound } from "lucide-react";
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
import GlobalPagination from "@/components/common/GlobalPagination";

export const metadata = {
  title: "AI Conversations | MediDove Admin",
};

const PAGE_SIZE = 6;

type ChatSession = {
  id: string;
  visitor_id: string | null;
  created_at: string;
};

type ChatMessage = {
  id: string;
  session_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata: { intent?: string } | null;
  created_at: string;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export default async function AdminConversationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
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

  const [{ data: sessionsData }, { data: messagesData }] = await Promise.all([
    supabase
      .from("ai_chat_sessions")
      .select("id, visitor_id, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("ai_chat_messages")
      .select("id, session_id, role, content, metadata, created_at")
      .order("created_at", { ascending: true })
      .limit(500),
  ]);

  const sessions = (sessionsData || []) as ChatSession[];
  const messages = (messagesData || []) as ChatMessage[];
  const messagesBySession = new Map<string, ChatMessage[]>();

  messages.forEach((message) => {
    messagesBySession.set(message.session_id, [
      ...(messagesBySession.get(message.session_id) || []),
      message,
    ]);
  });

  const assistantMessageCount = messages.filter(
    (message) => message.role === "assistant",
  ).length;
  const safetyMessageCount = messages.filter(
    (message) => message.metadata?.intent === "urgent_safety",
  ).length;

  const totalPages = Math.max(1, Math.ceil(sessions.length / PAGE_SIZE));
  const page = Math.min(
    Math.max(1, Number.parseInt(params.page || "1", 10) || 1),
    totalPages,
  );
  const pagedSessions = sessions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase text-primary">
              AI conversations
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">
              Website assistant transcript inbox
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Review patient questions, assistant responses, detected intents,
              and safety escalations logged from the public chat widget.
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

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Sessions</CardDescription>
                <CardTitle className="mt-2 text-3xl">{sessions.length}</CardTitle>
              </div>
              <MessageSquareText className="size-8 text-primary" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Assistant replies</CardDescription>
                <CardTitle className="mt-2 text-3xl">
                  {assistantMessageCount}
                </CardTitle>
              </div>
              <Bot className="size-8 text-teal-600" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Safety escalations</CardDescription>
                <CardTitle className="mt-2 text-3xl">
                  {safetyMessageCount}
                </CardTitle>
              </div>
              <UserRound className="size-8 text-red-600" />
            </CardHeader>
          </Card>
        </section>

        <section className="grid gap-5">
          {sessions.length > 0 ? (
            pagedSessions.map((session) => {
              const sessionMessages = messagesBySession.get(session.id) || [];
              const latestIntent = [...sessionMessages]
                .reverse()
                .find((message) => message.metadata?.intent)?.metadata?.intent;

              return (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div>
                        <CardDescription>
                          {formatDate(session.created_at)}
                        </CardDescription>
                        <CardTitle className="mt-2 text-xl">
                          Visitor {session.visitor_id || "anonymous"}
                        </CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          {sessionMessages.length} messages
                        </Badge>
                        {latestIntent ? (
                          <Badge variant="outline" className="capitalize">
                            {latestIntent.replaceAll("_", " ")}
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {sessionMessages.length > 0 ? (
                      sessionMessages.map((message) => (
                        <div
                          key={message.id}
                          className={
                            message.role === "assistant"
                              ? "ml-auto max-w-4xl rounded-lg border border-primary/20 bg-primary/5 p-4"
                              : "max-w-4xl rounded-lg border border-slate-200 bg-white p-4"
                          }
                        >
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge
                              variant={
                                message.role === "assistant"
                                  ? "default"
                                  : "secondary"
                              }
                              className="capitalize"
                            >
                              {message.role}
                            </Badge>
                            {message.metadata?.intent ? (
                              <Badge variant="outline" className="capitalize">
                                {message.metadata.intent.replaceAll("_", " ")}
                              </Badge>
                            ) : null}
                            <span className="text-xs text-slate-400">
                              {formatDate(message.created_at)}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                            {message.content}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                        No messages recorded for this session.
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="py-14 text-center text-slate-500">
                <MessageSquareText className="mx-auto mb-3 size-9" />
                No AI conversations logged yet.
              </CardContent>
            </Card>
          )}
        </section>

        <GlobalPagination
          page={page}
          totalPages={totalPages}
          buildHref={(targetPage) => `/admin/conversations?page=${targetPage}`}
        />
      </div>
    </main>
  );
}
