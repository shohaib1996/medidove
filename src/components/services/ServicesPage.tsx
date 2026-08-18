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
    title: "Website assistant",
    text: "Patients ask natural questions and get grounded answers from service knowledge.",
  },
  {
    icon: PhoneCall,
    title: "Voice receptionist",
    text: "ElevenLabs captures phone requests and creates structured Supabase records.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp follow-up",
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
              AI-ready departments
            </Badge>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-normal md:text-6xl">
              Medical services built for smart patient routing
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              MediDove connects public service pages, appointment requests,
              AI intake, phone reception, and WhatsApp reminders into one
              Supabase-backed workflow.
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
                Services that feed the AI assistant and booking flow
              </h2>
              <p className="mt-4 text-slate-600">
                These cards are the first clean Tailwind version of the
                department experience. The next database step can load them from
                Supabase instead of static arrays.
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
                From department pages to structured clinical admin tasks
              </h2>
              <p className="mt-5 leading-8 text-slate-600">
                Each service can become a knowledge source for the AI assistant,
                a routing option for appointment requests, and a campaign target
                for reminders or follow-ups.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Store department details, FAQs, and booking rules in Supabase.",
                  "Generate embeddings for semantic search and chatbot answers.",
                  "Route appointments to the correct admin queue or doctor type.",
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
                AI workflows
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl">
                Turn service interest into measurable clinic activity
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
                Next step
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-normal">
                Connect services to Supabase
              </h2>
              <p className="mt-3 max-w-2xl text-slate-600">
                The design is ready. The next phase can seed departments and
                services into Supabase and read them dynamically.
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
