import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  HeartPulse,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import PublicHeader from "@/components/marketing/PublicHeader";
import type { PublicService } from "@/lib/clinic/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const aiWorkflows = [
  {
    icon: Bot,
    title: "Service guidance",
    text: "Patients ask natural questions and get grounded answers from service knowledge.",
  },
  {
    icon: PhoneCall,
    title: "Reception support",
    text: "Reception can capture phone requests and prepare structured notes for staff review.",
  },
  {
    icon: MessageCircle,
    title: "Patient follow-up",
    text: "Opt-in patients receive confirmations, reminders, and follow-up prompts.",
  },
];

const ServicesPage = ({ services }: { services: PublicService[] }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicHeader />

      <main>
        <section className="relative overflow-hidden bg-slate-950 px-4 py-20 text-white md:px-8">
          <Image
            src="/assets/img/bg/appointment.jpg"
            alt="Medical services"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-slate-950/75" />
          <div className="relative mx-auto max-w-7xl">
              <Badge className="mb-5 bg-white/10 text-white hover:bg-white/15">
                <Sparkles className="size-3.5" />
              Clinic departments
            </Badge>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-normal md:text-6xl">
              Medical services built for smart patient routing
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              MediDove connects service information, appointment requests,
              reception support, and visit reminders so patients can find the
              right next step.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/appointment">
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
                <Link href="/contact">
                  <PhoneCall />
                  Contact care team
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-4 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase text-primary">
                Departments
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl">
                Services that guide each appointment request
              </h2>
              <p className="mt-4 text-slate-600">
                Explore departments, care options, and support paths before
                sending an appointment request to the clinic team.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <Card key={service.title} className="transition hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <service.icon className="size-6" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription className="leading-6">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border border-teal-100 bg-teal-50 p-4 text-sm leading-6 text-teal-900">
                      {service.aiUse}
                    </div>
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
                <HeartPulse className="size-3.5" />
                Patient intake logic
              </Badge>
              <h2 className="text-3xl font-bold tracking-normal md:text-4xl">
                From department pages to clearer clinic follow-up
              </h2>
              <p className="mt-5 leading-8 text-slate-600">
                Each service helps patients understand what care path may fit
                their request and helps staff prepare reminders or follow-up
                communication after review.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Show department details, FAQs, and booking guidance.",
                  "Help patients search services using everyday language.",
                  "Route appointment requests to the right care team.",
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <ShieldCheck className="mt-1 size-5 shrink-0 text-teal-600" />
                    <p className="text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
              <Image
                src="/assets/img/about/about-img-3.jpg"
                alt="Medical department support"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="bg-slate-950 px-4 py-20 text-white md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase text-primary">
                Patient workflows
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl">
                Turn service interest into the right next step
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {aiWorkflows.map((workflow) => (
                <Card key={workflow.title} className="border-white/10 bg-white/10 text-white">
                  <CardHeader>
                    <workflow.icon className="size-8 text-primary" />
                    <CardTitle>{workflow.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-6 text-slate-300">
                      {workflow.text}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 md:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-lg border border-slate-200 bg-slate-50 p-8 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-bold uppercase text-primary">
                Ready to book
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-normal">
                Choose a service and request an appointment
              </h2>
              <p className="mt-3 max-w-2xl text-slate-600">
                Share your reason for visit and the clinic team will review the
                best service, doctor, and appointment option.
              </p>
            </div>
            <Button asChild>
              <Link href="/appointment">
                Start booking
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ServicesPage;
