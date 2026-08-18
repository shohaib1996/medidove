import Image from "next/image";
import Link from "next/link";
import {
  Bot,
  CalendarCheck,
  CheckCircle2,
  Headphones,
  HeartPulse,
  MessageCircle,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
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
import PublicHeader from "./PublicHeader";

const platformStats = [
  { label: "AI intake channels", value: "4" },
  { label: "Patient workflows", value: "12+" },
  { label: "Admin response time", value: "24/7" },
];

const features = [
  {
    icon: Bot,
    title: "AI Website Assistant",
    description:
      "Answers service, doctor, pricing, and booking questions using clinic knowledge stored in Supabase.",
  },
  {
    icon: Headphones,
    title: "AI Receptionist",
    description:
      "ElevenLabs voice agent captures calls, summarizes conversations, and creates appointment requests.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Engagement",
    description:
      "Send opt-in reminders, confirmations, follow-ups, and patient support messages through WhatsApp.",
    href: "/engagement",
  },
  {
    icon: Search,
    title: "Smart Doctor Matching",
    description:
      "Patients describe what they need, and AI routes them to the right department or doctor type.",
  },
];

const services = [
  "General Medicine",
  "Dental Care",
  "Pediatrics",
  "Neurology",
  "Surgery",
  "Radiology",
];

const workflow = [
  "Patient asks for help on web, WhatsApp, or phone.",
  "AI captures intent, urgency, consent, and appointment details.",
  "Supabase stores structured appointment, lead, call, and chat records.",
  "Admin reviews requests and follows up from the dashboard.",
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicHeader />

      <main>
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <Image
            src="/assets/img/slider/slider-bg-1.jpg"
            alt="Modern medical team"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.96),rgba(15,23,42,0.74),rgba(15,23,42,0.32))]" />

          <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-4 py-20 md:px-8 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <Badge className="mb-6 bg-white/10 text-white hover:bg-white/15">
                <Sparkles className="size-3.5" />
                AI-powered meditech demo
              </Badge>
              <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-normal md:text-6xl">
                MediDove AI Clinic Reception and Patient Engagement System
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                A modern medical platform with Supabase appointments, AI intake,
                ElevenLabs voice reception, WhatsApp reminders, and an admin
                dashboard for clinic teams.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/appoinment">
                    <CalendarCheck />
                    Book appointment
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-slate-950"
                >
                  <Link href="/receptionist">
                    <Headphones />
                    Try receptionist
                  </Link>
                </Button>
              </div>

              <div className="mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
                {platformStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="border border-white/15 bg-white/10 p-5 backdrop-blur"
                  >
                    <strong className="block text-3xl">{stat.value}</strong>
                    <span className="mt-2 block text-sm text-slate-300">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-white/10 bg-white/95 text-slate-900 shadow-2xl">
              <CardHeader>
                <CardDescription>Live system modules</CardDescription>
                <CardTitle className="text-2xl">
                  Built for real clinic operations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Supabase Auth, appointments, profiles, and leads",
                  "AI triage for department and doctor routing",
                  "ElevenLabs receptionist call workflow",
                  "WhatsApp and phone reminder-ready data model",
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal-600" />
                    <p className="text-sm leading-6 text-slate-600">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-slate-50 px-4 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase text-primary">
                Platform features
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl">
                AI features that healthcare buyers actually understand
              </h2>
              <p className="mt-4 text-slate-600">
                The system focuses on scheduling, communication, lead triage,
                and admin support instead of risky diagnosis claims.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <CardHeader>
                    <feature.icon className="mb-3 size-9 text-primary" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-6">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
              <Image
                src="/assets/img/about/about-img.jpg"
                alt="Doctor consulting patient"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>

            <div>
              <Badge variant="secondary" className="mb-4">
                <HeartPulse className="size-3.5" />
                Patient routing
              </Badge>
              <h2 className="text-3xl font-bold tracking-normal md:text-4xl">
                Convert old static medical pages into a live Supabase-backed
                clinic platform
              </h2>
              <p className="mt-5 leading-8 text-slate-600">
                Doctors, departments, appointments, leads, call logs, WhatsApp
                conversations, and AI chat records can live in Supabase while
                Next.js renders a polished patient-facing experience.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <div
                    key={service}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4"
                  >
                    <Stethoscope className="size-5 text-teal-600" />
                    <span className="font-medium text-slate-800">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 px-4 py-20 text-white md:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase text-primary">
                Reception automation
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl">
                ElevenLabs voice receptionist plus real phone and WhatsApp
                workflows
              </h2>
              <p className="mt-5 leading-8 text-slate-300">
                The voice layer can answer inbound clinic calls, collect booking
                details, save transcripts, and prepare follow-up tasks. Outbound
                calls and WhatsApp reminders should be opt-in patient engagement
                flows with consent and opt-out handling.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Badge className="bg-white/10 text-white">ElevenLabs</Badge>
                <Badge className="bg-white/10 text-white">Twilio Voice</Badge>
                <Badge className="bg-white/10 text-white">WhatsApp Business</Badge>
                <Badge className="bg-white/10 text-white">Supabase Logs</Badge>
              </div>
            </div>

            <Card className="border-white/10 bg-white/10 text-white">
              <CardHeader>
                <CardDescription className="text-slate-300">
                  Example workflow
                </CardDescription>
                <CardTitle>From patient request to admin action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workflow.map((step, index) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-sm leading-6 text-slate-200">{step}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="px-4 py-20 md:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-lg border border-slate-200 bg-slate-50 p-8 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-bold uppercase text-primary">
                Ready for the next phase
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-normal">
                Add the AI assistant and smart intake next
              </h2>
              <p className="mt-3 max-w-2xl text-slate-600">
                The public home now presents the product clearly. The next build
                step can add a real AI chat widget and semantic search backed by
                Supabase.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="outline">
                <Link href="/receptionist">
                  <PhoneCall />
                  Try receptionist
                </Link>
              </Button>
              <Button asChild>
                <Link href="/appoinment">
                  <Users />
                  Start intake
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-4 py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-slate-500 md:flex-row">
          <p>MediDove AI Clinic Platform</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
            <span>Next.js 16, Supabase, shadcn/ui, ElevenLabs-ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
