import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Headphones,
  HeartPulse,
  Languages,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
  Quote,
  Search,
  Sparkles,
  Star,
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
import AnimatedCounter from "@/components/animation/AnimatedCounter";
import Parallax from "@/components/animation/Parallax";
import Reveal from "@/components/animation/Reveal";
import ScrollProgress from "@/components/animation/ScrollProgress";
import type { ClinicSettings } from "@/lib/clinic/settings";
import type { PublicDoctor, PublicService } from "@/lib/clinic/content";
import type { PublicTestimonial } from "@/lib/testimonials/content";
import HeroScene from "./HeroScene";
import PublicHeader from "./PublicHeader";
import WorkflowSteps from "./WorkflowSteps";

const platformStats = [
  { label: "Ways to reach care", value: "4" },
  { label: "Patient support flows", value: "12+" },
  { label: "Reception availability", value: "24/7" },
];

const features = [
  {
    icon: Bot,
    title: "Online Care Assistant",
    description:
      "Helps patients understand available services, choose the right department, and start an appointment request.",
    href: "/service",
    accent: "from-rose-500 to-pink-600",
    glow: "group-hover:shadow-rose-500/25",
  },
  {
    icon: Headphones,
    title: "Virtual Reception Desk",
    description:
      "Answers common clinic questions, captures callback requests, and prepares appointment details for staff review.",
    href: "/receptionist",
    accent: "from-cyan-500 to-blue-600",
    glow: "group-hover:shadow-cyan-500/25",
  },
  {
    icon: MessageCircle,
    title: "Appointment Reminders",
    description:
      "Patients can receive confirmations, visit reminders, follow-up messages, and support updates through preferred channels.",
    href: "/engagement",
    accent: "from-violet-500 to-purple-600",
    glow: "group-hover:shadow-violet-500/25",
  },
  {
    icon: Search,
    title: "Doctor And Department Guidance",
    description:
      "Patients describe what they need and receive safe guidance toward the most relevant service or doctor type.",
    href: "/doctor",
    accent: "from-amber-500 to-orange-600",
    glow: "group-hover:shadow-amber-500/25",
  },
];

// Asymmetric bento rhythm: wide, narrow, narrow, wide.
const bentoSpan = [
  "xl:col-span-2",
  "xl:col-span-1",
  "xl:col-span-1",
  "xl:col-span-2",
];

const serviceAccents = [
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-blue-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-fuchsia-500 to-rose-600",
];

const sectionLinks = [
  { label: "Services", href: "#services" },
  { label: "Doctors", href: "#doctors" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Reception", href: "#reception" },
  { label: "Contact", href: "#contact" },
];

const workflow = [
  "Patient asks for help online, by message, or by phone.",
  "The system collects the reason for visit, urgency, consent, and preferred time.",
  "Clinic staff review the request and confirm the best next step.",
  "Patients receive reminders, updates, and follow-up support when needed.",
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1 text-amber-500">
    {Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={
          index < rating ? "size-4 fill-current" : "size-4 text-slate-300"
        }
      />
    ))}
  </div>
);

const CurveDivider = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 1440 120"
    preserveAspectRatio="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M0,64 C240,120 480,8 720,40 C960,72 1200,128 1440,88 L1440,120 L0,120 Z"
      fill="currentColor"
    />
  </svg>
);

type HomePageProps = {
  services: PublicService[];
  doctors: PublicDoctor[];
  testimonials: PublicTestimonial[];
  settings: ClinicSettings;
};

const HomePage = ({
  services,
  doctors,
  testimonials,
  settings,
}: HomePageProps) => {
  const featuredTestimonial =
    testimonials.find((item) => item.isFeatured) || testimonials[0];
  const otherTestimonials = testimonials.filter(
    (item) => item.id !== featuredTestimonial?.id,
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <ScrollProgress />
      <PublicHeader overlay links={sectionLinks} />

      <main>
        {/* ---------------------------------------------------------------- */}
        {/* Hero                                                             */}
        {/* ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_0%,oklch(0.35_0.15_12),transparent_60%),radial-gradient(ellipse_70%_60%_at_90%_20%,oklch(0.32_0.13_255),transparent_55%),linear-gradient(180deg,oklch(0.16_0.03_270),oklch(0.13_0.02_280))]" />

          <div className="aurora left-[-10%] top-[-15%] size-144 bg-rose-500/40" />
          <div
            className="aurora right-[-12%] top-[10%] size-128 bg-cyan-400/30"
            style={{ animationDelay: "-7s" }}
          />
          <div
            className="aurora bottom-[-20%] left-[35%] size-120 bg-violet-500/30"
            style={{ animationDelay: "-14s" }}
          />

          <Image
            src="/assets/img/slider/slider-bg-1.jpg"
            alt="Modern medical team"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-[0.12] mix-blend-luminosity"
          />
          <HeroScene />

          <div className="relative mx-auto grid min-h-136 max-w-7xl items-center gap-12 px-4 pb-28 pt-28 md:min-h-168 md:gap-14 md:px-8 md:pb-32 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <Reveal immediate direction="none">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur">
                  <Sparkles className="size-3.5 text-rose-400" />
                  Modern patient care platform
                </span>
              </Reveal>

              <Reveal immediate delay={0.1}>
                <h1 className="mt-7 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-7xl">
                  MediDove Online{" "}
                  <span className="text-gradient-brand">Clinic Reception</span>{" "}
                  And{" "}
                  <span className="text-gradient-cool">Patient Support</span>
                </h1>
              </Reveal>

              <Reveal immediate delay={0.22}>
                <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
                  Book appointments, reach the reception team, get service
                  guidance, receive visit reminders, and stay connected with your
                  clinic before and after care.
                </p>
              </Reveal>

              <Reveal immediate delay={0.34}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="glow-brand h-13 rounded-full px-7 text-base transition hover:scale-[1.03]"
                  >
                    <Link href="/appointment">
                      <CalendarCheck />
                      Book appointment
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-13 rounded-full border-white/25 bg-white/5 px-7 text-base text-white backdrop-blur transition hover:scale-[1.03] hover:bg-white hover:text-slate-950"
                  >
                    <Link href="/receptionist">
                      <Headphones />
                      Talk to reception
                    </Link>
                  </Button>
                </div>
              </Reveal>

              <div className="mt-14 flex flex-wrap gap-3">
                {platformStats.map((stat, index) => (
                  <Reveal key={stat.label} immediate delay={0.46 + index * 0.1}>
                    <div className="glass-panel flex items-center gap-3 rounded-2xl px-5 py-4 transition hover:scale-[1.04] hover:border-rose-400/40">
                      <AnimatedCounter
                        value={stat.value}
                        className="text-gradient-brand text-3xl font-bold"
                      />
                      <span className="max-w-28 text-xs leading-4 text-slate-300">
                        {stat.label}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal immediate direction="left" delay={0.28}>
              <div className="animate-float-slow">
                <Card className="gradient-ring rotate-1 rounded-3xl border-white/10 bg-white/95 text-slate-900 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] transition hover:rotate-0">
                  <CardHeader>
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      Patient services
                    </span>
                    <CardTitle className="mt-3 text-2xl leading-8">
                      Care support from first question to follow-up
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      "Book appointments with the right department",
                      "Ask reception questions any time",
                      "Get reminders before your visit",
                      "Receive follow-up support after care",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-rose-50"
                      >
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-rose-500" />
                        <p className="text-sm leading-6 text-slate-600">
                          {item}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </Reveal>
          </div>

          <CurveDivider className="absolute inset-x-0 -bottom-px h-20 w-full text-white md:h-28" />
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Features — bento grid                                            */}
        {/* ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden px-4 py-16 md:px-8 md:py-24">
          <div className="aurora left-[-8%] top-[10%] size-96 bg-rose-300/30" />
          <div
            className="aurora right-[-6%] top-[40%] size-80 bg-cyan-300/30"
            style={{ animationDelay: "-9s" }}
          />

          <div className="relative mx-auto max-w-7xl">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-rose-500">
                Patient services
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                Simple digital support for{" "}
                <span className="text-gradient-brand">everyday clinic care</span>
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                MediDove helps patients find services, request appointments,
                talk with reception, and receive timely communication without
                replacing professional medical advice.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature, index) => (
                <Reveal
                  key={feature.title}
                  delay={index * 0.09}
                  className={bentoSpan[index]}
                >
                  <Card
                    className={`group gradient-ring relative h-full overflow-hidden rounded-3xl border-slate-200/80 bg-white p-2 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${feature.glow}`}
                  >
                    <div
                      className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${feature.accent} opacity-0 transition group-hover:opacity-100`}
                    />
                    <CardHeader>
                      <div
                        className={`mb-4 flex size-14 items-center justify-center rounded-2xl bg-linear-to-br ${feature.accent} text-white shadow-lg transition duration-300 group-hover:scale-110 group-hover:rotate-3`}
                      >
                        <feature.icon className="size-6" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <CardDescription className="text-base leading-7">
                        {feature.description}
                      </CardDescription>
                      <Link
                        href={feature.href}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600 transition hover:gap-3"
                      >
                        Learn more
                        <ArrowRight className="size-4" />
                      </Link>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Services                                                         */}
        {/* ---------------------------------------------------------------- */}
        <section
          id="services"
          className="relative overflow-hidden bg-linear-to-b from-slate-50 via-white to-slate-50 px-4 py-16 md:px-8 md:py-24"
        >
          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <Parallax
                className="relative aspect-4/3 overflow-hidden rounded-4xl bg-slate-100 shadow-2xl"
                distance={40}
              >
                <div className="relative h-[125%] w-full translate-y-[-10%]">
                  <Image
                    src="/assets/img/about/about-img.jpg"
                    alt="Doctor consulting patient"
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-tr from-rose-600/35 via-transparent to-cyan-500/25" />
                </div>
              </Parallax>

              <Reveal direction="left">
                <Badge
                  variant="secondary"
                  className="mb-5 rounded-full bg-rose-50 px-4 py-1.5 text-rose-600"
                >
                  <HeartPulse className="size-3.5" />
                  Care guidance
                </Badge>
                <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                  Find the right service{" "}
                  <span className="text-gradient-brand">
                    before booking your visit
                  </span>
                </h2>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  Patients can describe their concern in plain language and get
                  directed toward the right department, doctor type, or next
                  appointment step. Urgent symptoms are handled with clear
                  safety guidance.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="glow-brand h-12 rounded-full px-6"
                  >
                    <Link href="/service">
                      View all services
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-12 rounded-full px-6"
                  >
                    <Link href="/appointment">
                      <CalendarCheck />
                      Book appointment
                    </Link>
                  </Button>
                </div>
              </Reveal>
            </div>

            {/* Staggered offset grid rather than a flat row of equal cards. */}
            <div className="mt-20 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {services.slice(0, 6).map((service, index) => (
                <Reveal
                  key={service.title}
                  delay={(index % 3) * 0.09}
                  className={index % 2 === 1 ? "xl:translate-y-8" : undefined}
                >
                  <Card className="group gradient-ring h-full rounded-3xl border-slate-200/80 bg-white/80 backdrop-blur transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
                    <CardHeader>
                      <div
                        className={`mb-4 flex size-12 items-center justify-center rounded-2xl bg-linear-to-br ${serviceAccents[index % serviceAccents.length]} text-white shadow-lg transition duration-300 group-hover:scale-110`}
                      >
                        <service.icon className="size-5" />
                      </div>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <CardDescription className="leading-7">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Doctors                                                          */}
        {/* ---------------------------------------------------------------- */}
        <section id="doctors" className="relative overflow-hidden px-4 py-16 md:px-8 md:py-24">
          <div
            className="aurora left-[45%] top-[5%] size-96 bg-violet-300/25"
            style={{ animationDelay: "-5s" }}
          />

          <div className="relative mx-auto max-w-7xl">
            <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-widest text-rose-500">
                  Doctors
                </p>
                <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                  Meet doctors matched to{" "}
                  <span className="text-gradient-brand">your care needs</span>
                </h2>
                <p className="mt-5 text-lg text-slate-600">
                  Review specialties, departments, and availability before
                  requesting an appointment.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="h-12 w-fit rounded-full px-6"
              >
                <Link href="/doctor">
                  View all doctors
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </Reveal>

            <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {doctors.slice(0, 4).map((doctor, index) => (
                <Reveal key={doctor.name} delay={index * 0.09}>
                  <Card className="group h-full overflow-hidden rounded-3xl border-slate-200/80 pt-0 transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
                    <div className="relative aspect-4/3 overflow-hidden bg-linear-to-br from-slate-100 to-slate-200">
                      <Image
                        src={doctor.image}
                        alt={doctor.name}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                        className="object-contain object-bottom transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-rose-600/25 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                      <Badge className="absolute left-4 top-4 rounded-full bg-white/90 text-slate-900 shadow-sm backdrop-blur hover:bg-white">
                        {doctor.department}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{doctor.name}</CardTitle>
                      <CardDescription>{doctor.specialty}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock3 className="size-4 text-rose-500" />
                        {doctor.availability}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Languages className="size-4 text-cyan-600" />
                        {doctor.languages}
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Testimonials                                                     */}
        {/* ---------------------------------------------------------------- */}
        {featuredTestimonial ? (
          <section
            id="testimonials"
            className="relative overflow-hidden bg-linear-to-br from-slate-50 via-rose-50/40 to-cyan-50/40 px-4 py-16 md:px-8 md:py-24"
          >
            <div className="relative mx-auto max-w-7xl">
              <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div className="max-w-2xl">
                  <p className="text-sm font-bold uppercase tracking-widest text-rose-500">
                    Proof
                  </p>
                  <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                    What clinic staff and{" "}
                    <span className="text-gradient-brand">patients say</span>
                  </h2>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 w-fit rounded-full bg-white/60 px-6 backdrop-blur"
                >
                  <Link href="/testimonials">
                    Read all testimonials
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </Reveal>

              <div className="mt-14 grid gap-5 lg:grid-cols-3">
                <Reveal direction="right" className="lg:col-span-2">
                  <Card className="relative h-full overflow-hidden rounded-3xl border-0 bg-slate-950 text-white shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_10%_0%,oklch(0.38_0.16_12),transparent_60%),radial-gradient(ellipse_60%_70%_at_100%_100%,oklch(0.34_0.14_255),transparent_55%)]" />
                    <Quote className="absolute right-8 top-6 size-28 text-white/[0.07]" />
                    <CardHeader className="relative">
                      <div className="flex items-center justify-between gap-3">
                        <Badge className="rounded-full bg-white/10 text-white hover:bg-white/15">
                          {featuredTestimonial.category}
                        </Badge>
                        <StarRating rating={featuredTestimonial.rating} />
                      </div>
                      <CardTitle className="mt-5 text-2xl font-medium leading-10 md:text-3xl">
                        {featuredTestimonial.quote}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative flex items-center gap-4">
                      <Image
                        src={featuredTestimonial.imageUrl}
                        alt={featuredTestimonial.authorName}
                        width={56}
                        height={56}
                        className="size-14 rounded-full object-cover ring-2 ring-rose-400/60"
                        unoptimized={featuredTestimonial.imageUrl.startsWith(
                          "http",
                        )}
                      />
                      <div>
                        <p className="font-semibold">
                          {featuredTestimonial.authorName}
                        </p>
                        <p className="text-sm text-slate-400">
                          {featuredTestimonial.authorRole}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>

                <div className="grid gap-5">
                  {otherTestimonials.slice(0, 2).map((item, index) => (
                    <Reveal key={item.id} delay={0.12 + index * 0.1}>
                      <Card className="group gradient-ring h-full rounded-3xl border-slate-200/80 bg-white/80 backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                        <CardHeader>
                          <div className="flex items-center justify-between gap-3">
                            <Badge
                              variant="secondary"
                              className="rounded-full bg-rose-50 text-rose-600"
                            >
                              {item.category}
                            </Badge>
                            <StarRating rating={item.rating} />
                          </div>
                          <CardTitle className="mt-3 text-base font-medium leading-7">
                            {item.quote}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-3">
                          <Image
                            src={item.imageUrl}
                            alt={item.authorName}
                            width={44}
                            height={44}
                            className="size-11 rounded-full object-cover"
                            unoptimized={item.imageUrl.startsWith("http")}
                          />
                          <div>
                            <p className="text-sm font-semibold">
                              {item.authorName}
                            </p>
                            <CardDescription className="text-xs">
                              {item.authorRole}
                            </CardDescription>
                          </div>
                        </CardContent>
                      </Card>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* ---------------------------------------------------------------- */}
        {/* Reception                                                        */}
        {/* ---------------------------------------------------------------- */}
        <section
          id="reception"
          className="relative overflow-hidden bg-slate-950 px-4 py-24 text-white md:px-8"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_5%_10%,oklch(0.34_0.15_12),transparent_55%),radial-gradient(ellipse_60%_70%_at_95%_90%,oklch(0.32_0.14_255),transparent_55%)]" />
          <div className="aurora right-[10%] top-[15%] size-80 bg-violet-500/25" />

          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-widest text-rose-400">
                Reception and reminders
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                A clinic reception experience that is{" "}
                <span className="text-gradient-cool">
                  available beyond office hours
                </span>
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                Patients can request appointments, ask common questions, leave
                callback details, and receive reminder messages. Staff review
                every request before appointments or follow-up actions are
                confirmed.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="glow-brand h-13 rounded-full px-7"
                >
                  <Link href="/receptionist">
                    <PhoneCall />
                    Talk to reception
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-13 rounded-full border-white/25 bg-white/5 px-7 text-white backdrop-blur hover:bg-white hover:text-slate-950"
                >
                  <Link href="/engagement">
                    <MessageCircle />
                    Manage reminders
                  </Link>
                </Button>
              </div>
              <div className="mt-9 flex flex-wrap gap-2.5">
                {[
                  "Phone support",
                  "Online booking",
                  "Visit reminders",
                  "Follow-up care",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="glass-panel rounded-full px-4 py-2 text-sm text-slate-200 transition hover:border-rose-400/40 hover:text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal direction="left">
              <Card className="glass-panel rounded-3xl text-white">
                <CardHeader>
                  <CardDescription className="text-slate-300">
                    How it works
                  </CardDescription>
                  <CardTitle className="text-2xl">
                    From patient request to confirmed care
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WorkflowSteps steps={workflow} />
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Contact                                                          */}
        {/* ---------------------------------------------------------------- */}
        <section id="contact" className="px-4 py-16 md:px-8 md:py-24">
          <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-linear-to-br from-rose-600 via-pink-600 to-violet-700 p-6 text-white shadow-2xl sm:rounded-[2.5rem] sm:p-10 md:p-14">
            <div className="aurora right-[-5%] top-[-30%] size-96 bg-white/20" />
            <div
              className="aurora bottom-[-40%] left-[10%] size-80 bg-cyan-300/25"
              style={{ animationDelay: "-11s" }}
            />

            <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-white/80">
                  Contact
                </p>
                <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                  Request care online or contact reception
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/85">
                  Share your reason for visit, choose a service, and let the
                  clinic team review the best appointment option for you.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full border-white/40 bg-white/10 px-6 text-white backdrop-blur hover:bg-white hover:text-rose-700"
                >
                  <Link href="/receptionist">
                    <PhoneCall />
                    Contact reception
                  </Link>
                </Button>
                <Button
                  asChild
                  className="h-12 rounded-full bg-white px-6 text-rose-700 hover:bg-white/90"
                >
                  <Link href="/appointment">
                    <Users />
                    Start intake
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative mt-10 grid gap-4 border-t border-white/20 pt-10 sm:grid-cols-3">
              <a
                href={`tel:${settings.phone}`}
                className="glass-panel flex items-center gap-3 rounded-2xl p-4 transition hover:scale-[1.03] hover:bg-white/15"
              >
                <Phone className="size-5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold uppercase text-white/70">
                    Phone
                  </p>
                  <p className="font-medium">{settings.phone}</p>
                </div>
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="glass-panel flex items-center gap-3 rounded-2xl p-4 transition hover:scale-[1.03] hover:bg-white/15"
              >
                <Mail className="size-5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold uppercase text-white/70">
                    Email
                  </p>
                  <p className="font-medium">{settings.email}</p>
                </div>
              </a>
              <div className="glass-panel flex items-center gap-3 rounded-2xl p-4">
                <MapPin className="size-5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold uppercase text-white/70">
                    Hours
                  </p>
                  <p className="font-medium">{settings.businessHours}</p>
                </div>
              </div>
            </div>

            <div className="relative mt-8 text-center">
              <Link
                href="/contact"
                className="text-sm font-semibold text-white underline-offset-4 hover:underline"
              >
                Send a message to the clinic team
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-slate-500 md:flex-row">
          <p className="font-semibold text-slate-700">MediDove Online Clinic</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-rose-600">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-rose-600">
              Terms
            </Link>
            <Link href="/unsubscribe" className="hover:text-rose-600">
              Unsubscribe
            </Link>
            <span>Appointments, reminders, reception, and patient support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
