import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Clock3,
  Headphones,
  HeartPulse,
  Languages,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Stethoscope,
  Users,
  UsersRound,
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
import type { ClinicSettings } from "@/lib/clinic/settings";
import type { PublicDoctor, PublicService } from "@/lib/clinic/content";
import type { HealthPackage } from "@/lib/packages/content";
import type { PublicProduct } from "@/lib/products/content";
import type { PublicTestimonial } from "@/lib/testimonials/content";
import PublicHeader from "./PublicHeader";

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
  },
  {
    icon: Headphones,
    title: "Virtual Reception Desk",
    description:
      "Answers common clinic questions, captures callback requests, and prepares appointment details for staff review.",
    href: "/receptionist",
  },
  {
    icon: MessageCircle,
    title: "Appointment Reminders",
    description:
      "Patients can receive confirmations, visit reminders, follow-up messages, and support updates through preferred channels.",
    href: "/engagement",
  },
  {
    icon: Search,
    title: "Doctor And Department Guidance",
    description:
      "Patients describe what they need and receive safe guidance toward the most relevant service or doctor type.",
    href: "/doctor",
  },
];

const workflow = [
  "Patient asks for help online, by message, or by phone.",
  "The system collects the reason for visit, urgency, consent, and preferred time.",
  "Clinic staff review the request and confirm the best next step.",
  "Patients receive reminders, updates, and follow-up support when needed.",
];

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

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

type HomePageProps = {
  services: PublicService[];
  doctors: PublicDoctor[];
  packages: HealthPackage[];
  products: PublicProduct[];
  testimonials: PublicTestimonial[];
  settings: ClinicSettings;
};

const HomePage = ({
  services,
  doctors,
  packages,
  products,
  testimonials,
  settings,
}: HomePageProps) => {
  const featuredTestimonial =
    testimonials.find((item) => item.isFeatured) || testimonials[0];
  const otherTestimonials = testimonials.filter(
    (item) => item.id !== featuredTestimonial?.id,
  );

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

          <div className="relative mx-auto grid min-h-180 max-w-7xl items-center gap-12 px-4 py-20 md:px-8 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <Badge className="mb-6 bg-white/10 text-white hover:bg-white/15">
                <Sparkles className="size-3.5" />
                Modern patient care platform
              </Badge>
              <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-normal md:text-6xl">
                MediDove Online Clinic Reception And Patient Support
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                Book appointments, reach the reception team, get service
                guidance, receive visit reminders, and stay connected with your
                clinic before and after care.
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
                  <Link href="/receptionist">
                    <Headphones />
                    Talk to reception
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
                <CardDescription>Patient services</CardDescription>
                <CardTitle className="text-2xl">
                  Care support from first question to follow-up
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Book appointments with the right department",
                  "Ask reception questions any time",
                  "Get reminders before your visit",
                  "Receive follow-up support after care",
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
                Patient services
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl">
                Simple digital support for everyday clinic care
              </h2>
              <p className="mt-4 text-slate-600">
                MediDove helps patients find services, request appointments,
                talk with reception, and receive timely communication without
                replacing professional medical advice.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <CardHeader>
                    <feature.icon className="mb-3 size-9 text-primary" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="leading-6">
                      {feature.description}
                    </CardDescription>
                    <Link
                      href={feature.href}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                      Learn more
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="px-4 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-slate-100">
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
                  Care guidance
                </Badge>
                <h2 className="text-3xl font-bold tracking-normal md:text-4xl">
                  Find the right service before booking your visit
                </h2>
                <p className="mt-5 leading-8 text-slate-600">
                  Patients can describe their concern in plain language and get
                  directed toward the right department, doctor type, or next
                  appointment step. Urgent symptoms are handled with clear
                  safety guidance.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href="/service">
                      View all services
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/appointment">
                      <CalendarCheck />
                      Book appointment
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {services.slice(0, 6).map((service) => (
                <Card
                  key={service.title}
                  className="transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="mb-3 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <service.icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription className="leading-6">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="doctors" className="bg-slate-50 px-4 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase text-primary">
                  Doctors
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl">
                  Meet doctors matched to your care needs
                </h2>
                <p className="mt-4 text-slate-600">
                  Review specialties, departments, and availability before
                  requesting an appointment.
                </p>
              </div>
              <Button asChild variant="outline" className="w-fit">
                <Link href="/doctor">
                  View all doctors
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {doctors.slice(0, 4).map((doctor) => (
                <Card
                  key={doctor.name}
                  className="overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-4/3 bg-white">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="object-contain object-bottom"
                    />
                  </div>
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit">
                      {doctor.department}
                    </Badge>
                    <CardTitle className="text-lg">{doctor.name}</CardTitle>
                    <CardDescription>{doctor.specialty}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock3 className="size-4 text-primary" />
                      {doctor.availability}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Languages className="size-4 text-primary" />
                      {doctor.languages}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="packages" className="px-4 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase text-primary">
                  Health packages
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl">
                  Preventive care packages with guided intake
                </h2>
                <p className="mt-4 text-slate-600">
                  Bundled wellness, dental, and screening visits with
                  staff-reviewed booking and follow-up.
                </p>
              </div>
              <Button asChild variant="outline" className="w-fit">
                <Link href="/packages">
                  View all packages
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {packages.slice(0, 3).map((item) => (
                <Card
                  key={item.id}
                  className={
                    item.isFeatured
                      ? "overflow-hidden border-primary/40 shadow-lg"
                      : "overflow-hidden"
                  }
                >
                  <div className="relative aspect-16/10 bg-slate-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover"
                      unoptimized={item.imageUrl.startsWith("http")}
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant={item.isFeatured ? "default" : "secondary"}>
                        {item.badge}
                      </Badge>
                      <p className="text-2xl font-bold text-slate-900">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <CardTitle className="text-xl">{item.name}</CardTitle>
                    <CardDescription className="leading-6">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-2 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <Clock className="size-4 text-primary" />
                        {item.duration}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <UsersRound className="size-4 text-primary" />
                        {item.audience}
                      </span>
                    </div>
                    <Button asChild className="w-full">
                      <Link
                        href={`/contact?package=${encodeURIComponent(item.name)}`}
                      >
                        Ask staff
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="shop" className="bg-slate-50 px-4 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase text-primary">
                  Wellness shop
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl">
                  Non-prescription products for care at home
                </h2>
                <p className="mt-4 text-slate-600">
                  Staff-reviewed wellness products with a guided inquiry
                  workflow before purchase.
                </p>
              </div>
              <Button asChild variant="outline" className="w-fit">
                <Link href="/shop">
                  Visit the shop
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {products.slice(0, 3).map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative aspect-16/10 bg-white">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover"
                      unoptimized={item.imageUrl.startsWith("http")}
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant={item.isFeatured ? "default" : "secondary"}>
                        {item.category}
                      </Badge>
                      <p className="text-xl font-bold">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription className="leading-6">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link
                        href={`/contact?product=${encodeURIComponent(item.name)}`}
                      >
                        <ShoppingBag />
                        Ask about this product
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {featuredTestimonial ? (
          <section id="testimonials" className="px-4 py-20 md:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div className="max-w-2xl">
                  <p className="text-sm font-bold uppercase text-primary">
                    Proof
                  </p>
                  <h2 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl">
                    What clinic staff and patients say
                  </h2>
                </div>
                <Button asChild variant="outline" className="w-fit">
                  <Link href="/testimonials">
                    Read all testimonials
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-10 grid gap-5 lg:grid-cols-3">
                <Card className="border-primary/40 shadow-lg lg:col-span-1">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <Badge>{featuredTestimonial.category}</Badge>
                      <StarRating rating={featuredTestimonial.rating} />
                    </div>
                    <CardTitle className="text-xl leading-8">
                      {featuredTestimonial.quote}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <Image
                      src={featuredTestimonial.imageUrl}
                      alt={featuredTestimonial.authorName}
                      width={52}
                      height={52}
                      className="size-13 rounded-full object-cover"
                      unoptimized={featuredTestimonial.imageUrl.startsWith(
                        "http",
                      )}
                    />
                    <div>
                      <p className="font-semibold">
                        {featuredTestimonial.authorName}
                      </p>
                      <CardDescription>
                        {featuredTestimonial.authorRole}
                      </CardDescription>
                    </div>
                  </CardContent>
                </Card>

                {otherTestimonials.slice(0, 2).map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between gap-3">
                        <Badge variant="secondary">{item.category}</Badge>
                        <StarRating rating={item.rating} />
                      </div>
                      <CardTitle className="text-lg leading-8">
                        {item.quote}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                      <Image
                        src={item.imageUrl}
                        alt={item.authorName}
                        width={52}
                        height={52}
                        className="size-13 rounded-full object-cover"
                        unoptimized={item.imageUrl.startsWith("http")}
                      />
                      <div>
                        <p className="font-semibold">{item.authorName}</p>
                        <CardDescription>{item.authorRole}</CardDescription>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section id="reception" className="bg-slate-950 px-4 py-20 text-white md:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase text-primary">
                Reception and reminders
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl">
                A clinic reception experience that is available beyond office
                hours
              </h2>
              <p className="mt-5 leading-8 text-slate-300">
                Patients can request appointments, ask common questions, leave
                callback details, and receive reminder messages. Staff review
                every request before appointments or follow-up actions are
                confirmed.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/receptionist">
                    <PhoneCall />
                    Talk to reception
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-slate-950"
                >
                  <Link href="/engagement">
                    <MessageCircle />
                    Manage reminders
                  </Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Badge className="bg-white/10 text-white">Phone support</Badge>
                <Badge className="bg-white/10 text-white">Online booking</Badge>
                <Badge className="bg-white/10 text-white">Visit reminders</Badge>
                <Badge className="bg-white/10 text-white">Follow-up care</Badge>
              </div>
            </div>

            <Card className="border-white/10 bg-white/10 text-white">
              <CardHeader>
                <CardDescription className="text-slate-300">
                  How it works
                </CardDescription>
                <CardTitle>From patient request to confirmed care</CardTitle>
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

        <section id="contact" className="px-4 py-20 md:px-8">
          <div className="mx-auto max-w-7xl rounded-lg border border-slate-200 bg-slate-50 p-8">
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-bold uppercase text-primary">
                  Contact
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-normal">
                  Request care online or contact reception
                </h2>
                <p className="mt-3 max-w-2xl text-slate-600">
                  Share your reason for visit, choose a service, and let the
                  clinic team review the best appointment option for you.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="outline">
                  <Link href="/receptionist">
                    <PhoneCall />
                    Contact reception
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/appointment">
                    <Users />
                    Start intake
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-3">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 transition hover:border-primary"
              >
                <Phone className="size-5 text-primary" />
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Phone
                  </p>
                  <p className="font-medium text-slate-800">{settings.phone}</p>
                </div>
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 transition hover:border-primary"
              >
                <Mail className="size-5 text-primary" />
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Email
                  </p>
                  <p className="font-medium text-slate-800">{settings.email}</p>
                </div>
              </a>
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
                <MapPin className="size-5 text-primary" />
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Hours
                  </p>
                  <p className="font-medium text-slate-800">
                    {settings.businessHours}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/contact"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Send a message to the clinic team
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-4 py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-slate-500 md:flex-row">
          <p>MediDove Online Clinic</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
            <Link href="/unsubscribe" className="hover:text-primary">
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
