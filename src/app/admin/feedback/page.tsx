import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Filter,
  MessageSquareHeart,
  ShieldAlert,
  Star,
  ThumbsUp,
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
import { updateFeedbackStatus } from "./actions";

export const metadata = {
  title: "Patient Feedback | MediDove Admin",
};

type FeedbackFilter = "all" | "new" | "reviewing" | "resolved" | "archived";

type FeedbackRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  rating: number;
  category: string;
  message: string;
  ai_sentiment: string;
  ai_summary: string;
  ai_urgency: string;
  status: string;
  created_at: string;
};

const filters: FeedbackFilter[] = [
  "all",
  "new",
  "reviewing",
  "resolved",
  "archived",
];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const normalizeFilter = (value: string | string[] | undefined): FeedbackFilter => {
  const filter = Array.isArray(value) ? value[0] : value;

  return filters.includes(filter as FeedbackFilter)
    ? (filter as FeedbackFilter)
    : "all";
};

const StatusAction = ({
  id,
  status,
  label,
}: {
  id: string;
  status: Exclude<FeedbackFilter, "all">;
  label: string;
}) => (
  <form action={updateFeedbackStatus}>
    <input type="hidden" name="id" value={id} />
    <input type="hidden" name="status" value={status} />
    <Button type="submit" variant="outline" size="sm">
      {label}
    </Button>
  </form>
);

export default async function AdminFeedbackPage({
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
  const query = supabase
    .from("patient_feedback")
    .select(
      "id, name, email, phone, rating, category, message, ai_sentiment, ai_summary, ai_urgency, status, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(80);

  if (activeFilter !== "all") {
    query.eq("status", activeFilter);
  }

  const { data } = await query;
  const feedback = (data || []) as FeedbackRow[];
  const averageRating =
    feedback.length > 0
      ? feedback.reduce((total, item) => total + item.rating, 0) / feedback.length
      : 0;
  const negative = feedback.filter(
    (item) => item.ai_sentiment === "negative",
  ).length;
  const highUrgency = feedback.filter((item) => item.ai_urgency === "high").length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="flex flex-col justify-between gap-4 rounded-lg border bg-white p-6 shadow-sm lg:flex-row lg:items-center">
          <div>
            <Badge variant="secondary">Patient Experience</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Feedback intelligence
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Review patient feedback with AI sentiment, urgency scoring, and
              service recovery workflow status.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/feedback">Public feedback</Link>
            </Button>
            <Button asChild>
              <Link href="/admin">Back to dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Visible Feedback</CardTitle>
              <MessageSquareHeart className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{feedback.length}</p>
              <p className="text-xs text-slate-500">Matching current filter</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{averageRating.toFixed(1)}</p>
              <p className="text-xs text-slate-500">Out of 5</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Negative</CardTitle>
              <ShieldAlert className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{negative}</p>
              <p className="text-xs text-slate-500">Need service review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">High Urgency</CardTitle>
              <ThumbsUp className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{highUrgency}</p>
              <p className="text-xs text-slate-500">Prioritized by AI triage</p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Feedback queue</CardTitle>
                <CardDescription>
                  Filter by workflow status and resolve patient experience items.
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
                    <Link href={`/admin/feedback?status=${filter}`}>
                      {filter}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {feedback.length > 0 ? (
              <div className="grid gap-4">
                {feedback.map((item) => (
                  <div key={item.id} className="rounded-md border p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-semibold">{item.name}</h2>
                          <Badge variant="outline">{item.status}</Badge>
                          <Badge variant="secondary">{item.category}</Badge>
                          <Badge
                            variant={
                              item.ai_sentiment === "negative"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {item.ai_sentiment}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          {formatDate(item.created_at)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <StatusAction id={item.id} status="reviewing" label="Review" />
                        <StatusAction id={item.id} status="resolved" label="Resolve" />
                        <StatusAction id={item.id} status="archived" label="Archive" />
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      <div className="rounded-md bg-slate-50 p-3">
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Rating
                        </p>
                        <p className="mt-1 text-2xl font-semibold">
                          {item.rating}/5
                        </p>
                      </div>
                      <div className="rounded-md bg-slate-50 p-3">
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Urgency
                        </p>
                        <p className="mt-1 text-sm font-medium capitalize">
                          {item.ai_urgency}
                        </p>
                      </div>
                      <div className="rounded-md bg-slate-50 p-3">
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Contact
                        </p>
                        <p className="mt-1 wrap-break-word text-sm">
                          {item.email || item.phone || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <p className="rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                        {item.message}
                      </p>
                      <p className="rounded-md border border-primary/20 bg-primary/5 p-4 text-sm leading-6 text-slate-700">
                        {item.ai_summary}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600">
                No feedback records match this filter yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
