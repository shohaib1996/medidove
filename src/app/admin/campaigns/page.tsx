import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarClock, Megaphone, Send, Users } from "lucide-react";
import CampaignBuilder from "@/components/admin/CampaignBuilder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateCampaignCopy, getCampaignRecommendation } from "@/lib/campaigns/copy";
import { createClient } from "@/lib/supabase/server";
import { createCampaign, queueCampaign } from "./actions";

export const metadata = {
  title: "Campaigns | MediDove Admin",
};

type Campaign = {
  id: string;
  name: string;
  campaign_type: string;
  audience: string;
  channel: "email" | "sms" | "whatsapp" | "voice";
  goal: string | null;
  message: string;
  ai_recommendation: string | null;
  status: string;
  recipient_count: number;
  queued_at: string | null;
  created_at: string;
};

type Recipient = {
  id: string;
  campaign_id: string;
  recipient_name: string | null;
  recipient_phone: string | null;
  recipient_email: string | null;
  status: string;
  created_at: string;
};

const formatDate = (value: string | null) => {
  if (!value) {
    return "Not queued";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const campaignTypeLabels: Record<string, string> = {
  appointment_reminder: "Appointment reminder",
  missed_appointment: "Missed appointment recovery",
  feedback_request: "Feedback request",
  wellness_check: "Wellness check",
  screening_campaign: "Screening campaign",
};

const audienceLabels: Record<string, string> = {
  recent_appointments: "Recent appointments",
  missed_appointments: "Missed appointments",
  feedback_needed: "Completed visits",
  whatsapp_opt_ins: "WhatsApp opt-ins",
  all_patients: "All patient profiles",
};

export default async function AdminCampaignsPage() {
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

  const [{ data: campaignsData }, { data: recipientsData }] = await Promise.all([
    supabase
      .from("campaigns")
      .select(
        "id, name, campaign_type, audience, channel, goal, message, ai_recommendation, status, recipient_count, queued_at, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("campaign_recipients")
      .select(
        "id, campaign_id, recipient_name, recipient_phone, recipient_email, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(80),
  ]);

  const campaigns = (campaignsData || []) as Campaign[];
  const recipients = (recipientsData || []) as Recipient[];
  const queuedCampaigns = campaigns.filter(
    (campaign) => campaign.status === "queued",
  ).length;
  const totalRecipients = campaigns.reduce(
    (total, campaign) => total + campaign.recipient_count,
    0,
  );
  const starterMessage = generateCampaignCopy({
    name: "Annual wellness reminder",
    campaignType: "wellness_check",
    audience: "recent_appointments",
    channel: "whatsapp",
    goal: "Invite patients to book a routine checkup.",
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase text-primary">
              AI marketing
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">
              Patient engagement campaigns
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Create opt-in reminder, feedback, and wellness campaigns with AI
              suggested copy. Recipients are queued into the existing outbox and
              provider dispatch still checks consent before sending.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/admin/outreach">Outbox</Link>
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
                <CardDescription>Total campaigns</CardDescription>
                <CardTitle className="mt-2 text-3xl">{campaigns.length}</CardTitle>
              </div>
              <Megaphone className="size-8 text-primary" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Queued campaigns</CardDescription>
                <CardTitle className="mt-2 text-3xl">{queuedCampaigns}</CardTitle>
              </div>
              <Send className="size-8 text-emerald-600" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Queued recipients</CardDescription>
                <CardTitle className="mt-2 text-3xl">{totalRecipients}</CardTitle>
              </div>
              <Users className="size-8 text-cyan-600" />
            </CardHeader>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <CampaignBuilder
            starterMessage={starterMessage}
            starterRecommendation={getCampaignRecommendation("wellness_check")}
            campaignTypeLabels={campaignTypeLabels}
            audienceLabels={audienceLabels}
            createCampaignAction={createCampaign}
          />

          <div className="grid gap-4">
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => {
                const campaignRecipients = recipients.filter(
                  (recipient) => recipient.campaign_id === campaign.id,
                );

                return (
                  <Card key={campaign.id}>
                    <CardHeader>
                      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                        <div>
                          <CardDescription>
                            {formatDate(campaign.created_at)}
                          </CardDescription>
                          <CardTitle className="mt-2 text-xl">
                            {campaign.name}
                          </CardTitle>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="capitalize">{campaign.channel}</Badge>
                          <Badge variant="secondary" className="capitalize">
                            {campaign.status}
                          </Badge>
                          <Badge variant="outline">
                            {campaign.recipient_count} recipients
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <p className="text-xs font-semibold uppercase text-slate-400">
                            Type
                          </p>
                          <p className="mt-1 text-sm text-slate-700">
                            {campaignTypeLabels[campaign.campaign_type] ||
                              campaign.campaign_type}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase text-slate-400">
                            Audience
                          </p>
                          <p className="mt-1 text-sm text-slate-700">
                            {audienceLabels[campaign.audience] || campaign.audience}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase text-slate-400">
                            Queued
                          </p>
                          <p className="mt-1 text-sm text-slate-700">
                            {formatDate(campaign.queued_at)}
                          </p>
                        </div>
                      </div>
                      {campaign.ai_recommendation ? (
                        <div className="rounded-lg border border-cyan-100 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950">
                          {campaign.ai_recommendation}
                        </div>
                      ) : null}
                      <p className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                        {campaign.message}
                      </p>
                      {campaignRecipients.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {campaignRecipients.slice(0, 8).map((recipient) => (
                            <Badge key={recipient.id} variant="outline">
                              {recipient.recipient_name ||
                                recipient.recipient_phone ||
                                recipient.recipient_email ||
                                "Recipient"}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                      {campaign.status === "draft" ? (
                        <form action={queueCampaign}>
                          <input
                            type="hidden"
                            name="campaign_id"
                            value={campaign.id}
                          />
                          <Button type="submit" variant="outline">
                            <CalendarClock />
                            Queue audience
                          </Button>
                        </form>
                      ) : null}
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="py-14 text-center text-slate-500">
                  <Megaphone className="mx-auto mb-3 size-9" />
                  No campaigns created yet.
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
