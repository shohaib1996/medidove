import Image from "next/image";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock, UsersRound } from "lucide-react";
import PublicHeader from "@/components/marketing/PublicHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { HealthPackage } from "@/lib/packages/content";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const PackagesPage = ({ packages }: { packages: HealthPackage[] }) => (
  <div className="min-h-screen bg-white text-slate-900">
    <PublicHeader />
    <main>
      <section className="bg-slate-950 px-4 py-20 text-white md:px-8">
        <div className="mx-auto max-w-7xl">
          <Badge className="mb-6 bg-white/10 text-white">
            Preventive care packages
          </Badge>
          <h1 className="max-w-4xl text-4xl font-bold tracking-normal md:text-6xl">
            Book health packages with AI-assisted intake and follow-up
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Offer clear care packages for wellness, dental, screening, and
            follow-up workflows while keeping clinical decisions with staff.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {packages.map((item) => (
            <Card
              key={item.id}
              className={
                item.isFeatured
                  ? "overflow-hidden border-primary/40 shadow-lg"
                  : "overflow-hidden"
              }
            >
              <div className="relative aspect-[16/10] bg-slate-100">
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
                <CardTitle className="text-2xl">{item.name}</CardTitle>
                <CardDescription className="leading-6">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <Clock className="size-4 text-primary" />
                    {item.duration}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <UsersRound className="size-4 text-primary" />
                    {item.audience}
                  </span>
                </div>
                <ul className="space-y-3">
                  {item.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-3 text-sm leading-6 text-slate-700"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button asChild>
                    <Link
                      href={`/appointment?package=${encodeURIComponent(
                        item.name,
                      )}`}
                    >
                      <CalendarDays />
                      Book
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link
                      href={`/contact?package=${encodeURIComponent(item.name)}`}
                    >
                      Ask staff
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  </div>
);

export default PackagesPage;
