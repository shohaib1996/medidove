import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Bot,
  Brain,
  CalendarCheck,
  Clock3,
  Languages,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import PublicHeader from "@/components/marketing/PublicHeader";
import type { PublicDoctor } from "@/lib/clinic/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const matchingSignals = [
  "Reason for visit",
  "Department fit",
  "Doctor specialty",
  "Preferred time",
  "Urgency language",
  "Communication consent",
];

const DoctorsPage = ({ doctors }: { doctors: PublicDoctor[] }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicHeader />

      <main>
        <section className="relative overflow-hidden bg-slate-950 px-4 py-20 text-white md:px-8">
          <Image
            src="/assets/img/team/member-big.jpg"
            alt="MediDove medical specialist"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-slate-950/75" />
          <div className="relative mx-auto max-w-7xl">
            <Badge className="mb-5 bg-white/10 text-white hover:bg-white/15">
              <Sparkles className="size-3.5" />
              AI doctor matching ready
            </Badge>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-normal md:text-6xl">
              Find the right doctor before the patient reaches reception
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              MediDove turns doctor profiles into structured care options for
              appointments, AI intake, receptionist calls, and WhatsApp
              follow-ups.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/appointment">
                  <CalendarCheck />
                  Book a doctor
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-slate-950"
              >
                <Link href="/service">
                  <Stethoscope />
                  View services
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-4 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase text-primary">
                  Care team
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl">
                  Doctor profiles prepared for Supabase and AI routing
                </h2>
                <p className="mt-4 text-slate-600">
                  These cards are a clean Tailwind version of the doctor
                  directory. The next data phase can move this list into
                  Supabase and filter it dynamically.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/appointment">
                  Start appointment
                  <CalendarCheck />
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {doctors.map((doctor) => (
                <Card key={doctor.name} className="overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-[4/3] bg-slate-100">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-contain object-bottom"
                    />
                  </div>
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit">
                      {doctor.department}
                    </Badge>
                    <CardTitle>{doctor.name}</CardTitle>
                    <CardDescription>{doctor.specialty}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock3 className="size-4 text-primary" />
                        {doctor.availability}
                      </div>
                      <div className="flex items-center gap-2">
                        <Languages className="size-4 text-primary" />
                        {doctor.languages}
                      </div>
                    </div>
                    <Button asChild className="w-full">
                      <Link href="/appointment">Request appointment</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                <Bot className="size-3.5" />
                Smart matching workflow
              </Badge>
              <h2 className="text-3xl font-bold tracking-normal md:text-4xl">
                AI doctor matching can use profile data without making diagnosis
                claims
              </h2>
              <p className="mt-5 leading-8 text-slate-600">
                The assistant should route patients to a department or doctor
                type based on intent, availability, and service fit. It should
                not diagnose or replace professional medical judgment.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {matchingSignals.map((signal) => (
                  <div
                    key={signal}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4"
                  >
                    <BadgeCheck className="size-5 text-teal-600" />
                    <span className="font-medium text-slate-800">{signal}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-slate-950 text-white">
              <CardHeader>
                <CardDescription className="text-slate-300">
                  Example patient request
                </CardDescription>
                <CardTitle className="text-2xl">
                  My child has a fever and I need an appointment tomorrow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-6 text-slate-300">
                <div className="flex gap-3">
                  <Search className="mt-1 size-5 shrink-0 text-primary" />
                  <p>AI detects pediatrics intent and appointment timing.</p>
                </div>
                <div className="flex gap-3">
                  <Brain className="mt-1 size-5 shrink-0 text-primary" />
                  <p>System suggests pediatrician and prepares admin notes.</p>
                </div>
                <div className="flex gap-3">
                  <MessageCircle className="mt-1 size-5 shrink-0 text-primary" />
                  <p>Staff can confirm by phone, email, SMS, or WhatsApp.</p>
                </div>
                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 size-5 shrink-0 text-primary" />
                  <p>Emergency language is routed to urgent-care guidance.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DoctorsPage;
