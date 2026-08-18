import Link from "next/link";
import { ShieldCheck, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PublicHeader from "@/components/marketing/PublicHeader";

export const metadata = {
  title: "Privacy Policy | MediDove",
  description:
    "Privacy policy for the MediDove AI clinic demo, covering patient engagement, consent, and AI-assisted workflows.",
};

const sections = [
  {
    title: "What this demo collects",
    body: "MediDove stores the information patients submit through appointment, contact, feedback, chat, consent, and communication forms. This can include names, contact details, appointment requests, preferred channels, and workflow notes.",
  },
  {
    title: "How AI is used",
    body: "AI features summarize messages, suggest department routing, draft patient engagement copy, and help staff review requests. AI output is intended for administrative support and should be reviewed by clinic staff where care decisions are involved.",
  },
  {
    title: "Communication consent",
    body: "WhatsApp, SMS, email, and voice outreach should only be used for patients who have opted in. Campaigns and automations include consent checks before provider dispatch.",
  },
  {
    title: "Data storage",
    body: "The demo is designed around Supabase Auth, Postgres, Row Level Security, and audit logs. Production healthcare deployments may require extra contractual, security, and regulatory controls.",
  },
  {
    title: "Patient rights",
    body: "Patients should be able to request correction, export, or deletion of their personal information where legally applicable. A production clinic should connect these requests to its real privacy process.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicHeader />
      <main>
        <section className="bg-slate-950 px-4 py-20 text-white md:px-8">
          <div className="mx-auto max-w-5xl">
            <Badge className="mb-6 bg-white/10 text-white">
              <ShieldCheck className="size-3.5" />
              Privacy and consent
            </Badge>
            <h1 className="text-4xl font-bold tracking-normal md:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              This page describes how the MediDove AI clinic demo handles
              patient workflow data, AI assistance, and opt-in communications.
            </p>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8">
          <div className="mx-auto grid max-w-5xl gap-5">
            <Card className="border-cyan-100 bg-cyan-50">
              <CardHeader>
                <CardDescription>Demo notice</CardDescription>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="size-5 text-primary" />
                  Not a medical diagnosis system
                </CardTitle>
              </CardHeader>
              <CardContent className="leading-7 text-slate-700">
                MediDove is positioned as a clinic operations, scheduling,
                patient communication, and engagement platform. It should not be
                used to diagnose, treat, or replace licensed medical judgment.
              </CardContent>
            </Card>

            {sections.map((section) => (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="leading-7 text-slate-600">
                  {section.body}
                </CardContent>
              </Card>
            ))}

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button asChild>
                <Link href="/appoinment">Book appointment</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/terms">View terms</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
