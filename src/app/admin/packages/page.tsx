import Link from "next/link";
import { redirect } from "next/navigation";
import { Archive, Boxes, Plus, Star } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/server";
import { createHealthPackage, toggleHealthPackageStatus } from "./actions";

export const metadata = {
  title: "Health Packages | MediDove Admin",
};

type HealthPackageRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  duration: string | null;
  audience: string | null;
  features: string[];
  badge: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default async function AdminPackagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/admin");
  }

  const { data } = await supabase
    .from("health_packages")
    .select(
      "id, name, slug, description, price, duration, audience, features, badge, is_featured, is_active, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(40);

  const packages = (data || []) as HealthPackageRow[];
  const activeCount = packages.filter((item) => item.is_active).length;
  const featuredCount = packages.filter((item) => item.is_featured).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase text-primary">
              Health packages
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">
              Manage preventive care offers
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Create package offers for wellness checks, dental recalls,
              screenings, and clinic campaigns that connect back to booking.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/packages">View packages</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/admin">Back to dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Total</CardDescription>
                <CardTitle className="mt-2 text-3xl">
                  {packages.length}
                </CardTitle>
              </div>
              <Boxes className="size-8 text-primary" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Active</CardDescription>
                <CardTitle className="mt-2 text-3xl">{activeCount}</CardTitle>
              </div>
              <Archive className="size-8 text-emerald-600" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Featured</CardDescription>
                <CardTitle className="mt-2 text-3xl">
                  {featuredCount}
                </CardTitle>
              </div>
              <Star className="size-8 text-amber-500" />
            </CardHeader>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <Card>
            <CardHeader>
              <CardDescription>New package</CardDescription>
              <CardTitle>Create care package</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createHealthPackage} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Family Wellness Screening"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" name="price" type="number" min="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="badge">Badge</Label>
                    <Input id="badge" name="badge" placeholder="Popular" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" name="duration" placeholder="60 minutes" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audience">Audience</Label>
                    <Input
                      id="audience"
                      name="audience"
                      placeholder="Families and preventive care patients"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    placeholder="/assets/img/blog/news-thumb-4.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Short buyer-facing package description."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="features">Features</Label>
                  <Textarea
                    id="features"
                    name="features"
                    rows={6}
                    placeholder={"One feature per line\nAI-prepared intake summary"}
                  />
                </div>
                <label className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  <input
                    name="is_featured"
                    type="checkbox"
                    className="mt-1 size-4 rounded border-slate-300"
                  />
                  Feature this package on the public page
                </label>
                <Button type="submit">
                  <Plus />
                  Save package
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {packages.length > 0 ? (
              packages.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div>
                        <CardDescription>
                          {item.duration || "Clinic visit"} ·{" "}
                          {item.audience || "Clinic patients"}
                        </CardDescription>
                        <CardTitle className="mt-2 text-xl">
                          {item.name}
                        </CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge>{item.badge || "Care package"}</Badge>
                        <Badge variant={item.is_active ? "secondary" : "outline"}>
                          {item.is_active ? "Active" : "Archived"}
                        </Badge>
                        {item.is_featured ? (
                          <Badge variant="outline">Featured</Badge>
                        ) : null}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-2xl font-bold">
                        {formatPrice(Number(item.price))}
                      </p>
                      <Button asChild variant="outline" size="sm">
                        <Link href="/packages">Public page</Link>
                      </Button>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.features.slice(0, 4).map((feature) => (
                        <Badge key={feature} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <form action={toggleHealthPackageStatus}>
                      <input type="hidden" name="id" value={item.id} />
                      <input
                        type="hidden"
                        name="active"
                        value={String(!item.is_active)}
                      />
                      <Button type="submit" variant="outline" size="sm">
                        {item.is_active ? "Archive" : "Activate"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-14 text-center text-slate-500">
                  <Boxes className="mx-auto mb-3 size-9" />
                  No health packages yet.
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
