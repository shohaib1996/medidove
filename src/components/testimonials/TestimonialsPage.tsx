import Image from "next/image";
import Link from "next/link";
import { Quote, Star, UsersRound } from "lucide-react";
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
import type { PublicTestimonial } from "@/lib/testimonials/content";

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1 text-amber-500">
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

const TestimonialsPage = ({
  testimonials,
}: {
  testimonials: PublicTestimonial[];
}) => {
  const featured = testimonials.find((item) => item.isFeatured) || testimonials[0];
  const remaining = testimonials.filter((item) => item.id !== featured?.id);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicHeader />
      <main>
        <section className="bg-slate-950 px-4 py-20 text-white md:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <Badge className="mb-6 bg-white/10 text-white">
                <UsersRound className="size-3.5" />
                Clinic proof
              </Badge>
              <h1 className="text-4xl font-bold tracking-normal md:text-6xl">
                Stories that show the platform as an operational system
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Publish testimonials and case-study style proof points for
                buyers who want appointment automation, AI reception, and
                patient engagement in one workflow.
              </p>
            </div>

            {featured ? (
              <Card className="border-white/10 bg-white/10 text-white">
                <CardHeader>
                  <Quote className="size-10 text-cyan-300" />
                  <CardTitle className="text-2xl leading-9">
                    {featured.quote}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <Image
                    src={featured.imageUrl}
                    alt={featured.authorName}
                    width={64}
                    height={64}
                    className="size-16 rounded-full object-cover"
                    unoptimized={featured.imageUrl.startsWith("http")}
                  />
                  <div>
                    <StarRating rating={featured.rating} />
                    <p className="mt-2 font-semibold">{featured.authorName}</p>
                    <p className="text-sm text-slate-300">
                      {featured.authorRole}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </section>

        <section className="px-4 py-16 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {remaining.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="secondary">{item.category}</Badge>
                      <StarRating rating={item.rating} />
                    </div>
                    <CardTitle className="text-xl leading-8">
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

            <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-lg border border-slate-200 bg-slate-50 p-6 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-normal">
                  Turn patient engagement into a buyer-ready demo
                </h2>
                <p className="mt-2 max-w-2xl text-slate-600">
                  Combine testimonials with packages, appointment intake, and
                  AI receptionist workflows to show a full clinic operations
                  funnel.
                </p>
              </div>
              <Button asChild>
                <Link href="/appointment">Request appointment</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TestimonialsPage;
