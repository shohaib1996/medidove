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
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import GlobalPagination from "@/components/common/GlobalPagination";

const matchingSignals = [
  "Reason for visit",
  "Department fit",
  "Doctor specialty",
  "Preferred time",
  "Urgency language",
  "Communication consent",
];

type DoctorsPageProps = {
  doctors: PublicDoctor[];
  departments: string[];
  search: string;
  department: string;
  page: number;
  totalPages: number;
};

const DoctorsPage = ({
  doctors,
  departments,
  search,
  department,
  page,
  totalPages,
}: DoctorsPageProps) => {
  const hasActiveFilters = Boolean(search) || (department && department !== "all");

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (department && department !== "all") params.set("department", department);
    if (targetPage > 1) params.set("page", String(targetPage));
    const query = params.toString();
    return query ? `/doctor?${query}` : "/doctor";
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicHeader />

      <main>
        <section className="bg-slate-50 px-4 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase text-primary">
                  Care team
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl">
                  Doctor profiles for easier appointment planning
                </h2>
                <p className="mt-4 text-slate-600">
                  Browse the care team and request the doctor or department that
                  best matches your appointment need.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/appointment">
                  Start appointment
                  <CalendarCheck />
                </Link>
              </Button>
            </div>

            <form
              key={`${search}-${department}`}
              className="mt-8 grid gap-3 sm:grid-cols-[1fr_220px_auto]"
            >
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="search"
                  name="q"
                  defaultValue={search}
                  placeholder="Search by doctor name or specialty"
                  className="pl-9"
                />
              </div>
              <Select name="department" defaultValue={department}>
                <option value="all">All departments</option>
                {departments.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 sm:flex-none">
                  Search
                </Button>
                {hasActiveFilters ? (
                  <Button asChild variant="outline" type="button">
                    <Link href="/doctor">Clear</Link>
                  </Button>
                ) : null}
              </div>
            </form>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
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
                ))
              ) : (
                <div className="col-span-full rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
                  <Stethoscope className="mx-auto mb-3 size-9" />
                  No doctors match your search. Try a different name, specialty,
                  or department.
                </div>
              )}
            </div>

            <GlobalPagination
              page={page}
              totalPages={totalPages}
              buildHref={buildHref}
            />
          </div>
        </section>

        <section className="px-4 py-20 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                <Bot className="size-3.5" />
                Matching workflow
              </Badge>
              <h2 className="text-3xl font-bold tracking-normal md:text-4xl">
                Doctor matching uses care needs without making diagnosis claims
              </h2>
              <p className="mt-5 leading-8 text-slate-600">
                The system can guide patients toward a department or doctor type
                based on their request, availability, and service fit. It does
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
                  <p>The request suggests pediatrics and appointment timing.</p>
                </div>
                <div className="flex gap-3">
                  <Brain className="mt-1 size-5 shrink-0 text-primary" />
                  <p>The clinic receives a suggested doctor type and visit note.</p>
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
