import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MessageCircle, PackageSearch, ShieldAlert } from "lucide-react";
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
import type { PublicProduct } from "@/lib/products/content";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const ShopCatalogPage = ({ products }: { products: PublicProduct[] }) => (
  <div className="min-h-screen bg-white text-slate-900">
    <PublicHeader />
    <main>
      <section className="bg-slate-950 px-4 py-20 text-white md:px-8">
        <div className="mx-auto max-w-7xl">
          <Badge className="mb-6 bg-white/10 text-white">
            <PackageSearch className="size-3.5" />
            Wellness product catalog
          </Badge>
          <h1 className="max-w-4xl text-4xl font-bold tracking-normal md:text-6xl">
            Clinic-approved products with staff-reviewed purchase inquiries
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Present safe wellness products, monitoring tools, and dental care
            bundles through a staff-reviewed inquiry process.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            <ShieldAlert className="mt-0.5 size-5 shrink-0" />
            <p>
              Product requests are reviewed by staff before payment or
              fulfillment. Prescription items, regulated devices, and medical
              advice require clinical and compliance review.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((item) => (
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
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                    unoptimized={item.imageUrl.startsWith("http")}
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant={item.isFeatured ? "default" : "secondary"}>
                      {item.category}
                    </Badge>
                    <p className="text-2xl font-bold">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <CardTitle className="text-2xl">{item.name}</CardTitle>
                  <CardDescription className="leading-6">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{item.stockStatus}</Badge>
                    {item.requiresPrescription ? (
                      <Badge variant="outline">Prescription review</Badge>
                    ) : (
                      <Badge variant="outline">No prescription required</Badge>
                    )}
                  </div>
                  <div className="flex gap-3 text-sm leading-6 text-slate-600">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    Request is routed to staff before payment or fulfillment.
                  </div>
                  <Button asChild className="w-full">
                    <Link
                      href={`/contact?product=${encodeURIComponent(item.name)}`}
                    >
                      <MessageCircle />
                      Ask staff
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  </div>
);

export default ShopCatalogPage;
