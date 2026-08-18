import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquareQuote, Plus, Star } from "lucide-react";
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
import { createTestimonial, toggleTestimonialPublish } from "./actions";

export const metadata = {
  title: "Testimonials | MediDove Admin",
};

type TestimonialRow = {
  id: string;
  author_name: string;
  author_role: string | null;
  quote: string;
  rating: number;
  category: string;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
};

export default async function AdminTestimonialsPage() {
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
    .from("testimonials")
    .select(
      "id, author_name, author_role, quote, rating, category, is_featured, is_published, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(40);

  const testimonials = (data || []) as TestimonialRow[];
  const published = testimonials.filter((item) => item.is_published).length;
  const featured = testimonials.filter((item) => item.is_featured).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase text-primary">
              Testimonials
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">
              Manage buyer proof and patient stories
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Publish short proof points for clinic operations, AI reception,
              patient engagement, and admin workflow outcomes.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/testimonials">View proof page</Link>
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
                  {testimonials.length}
                </CardTitle>
              </div>
              <MessageSquareQuote className="size-8 text-primary" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Published</CardDescription>
                <CardTitle className="mt-2 text-3xl">{published}</CardTitle>
              </div>
              <Star className="size-8 text-amber-500" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Featured</CardDescription>
                <CardTitle className="mt-2 text-3xl">{featured}</CardTitle>
              </div>
              <Star className="size-8 text-emerald-600" />
            </CardHeader>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <Card>
            <CardHeader>
              <CardDescription>New proof point</CardDescription>
              <CardTitle>Create testimonial</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createTestimonial} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="author_name">Author name</Label>
                  <Input id="author_name" name="author_name" placeholder="Nadia Morgan" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author_role">Author role</Label>
                  <Input
                    id="author_role"
                    name="author_role"
                    placeholder="Clinic Operations Manager"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" placeholder="Operations" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating</Label>
                    <Input
                      id="rating"
                      name="rating"
                      type="number"
                      min="1"
                      max="5"
                      defaultValue="5"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    placeholder="/assets/img/testimonials/testi-author-icon.png"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quote">Quote</Label>
                  <Textarea
                    id="quote"
                    name="quote"
                    rows={6}
                    placeholder="Short testimonial or case-study style proof point."
                  />
                </div>
                <label className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  <input
                    name="is_featured"
                    type="checkbox"
                    className="mt-1 size-4 rounded border-slate-300"
                  />
                  Feature this testimonial
                </label>
                <label className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  <input
                    name="is_published"
                    type="checkbox"
                    className="mt-1 size-4 rounded border-slate-300"
                  />
                  Publish immediately
                </label>
                <Button type="submit">
                  <Plus />
                  Save testimonial
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {testimonials.length > 0 ? (
              testimonials.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div>
                        <CardDescription>
                          {item.author_role || "Patient"}
                        </CardDescription>
                        <CardTitle className="mt-2 text-xl">
                          {item.author_name}
                        </CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge>{item.category}</Badge>
                        <Badge variant={item.is_published ? "secondary" : "outline"}>
                          {item.is_published ? "Published" : "Draft"}
                        </Badge>
                        {item.is_featured ? (
                          <Badge variant="outline">Featured</Badge>
                        ) : null}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-6 text-slate-600">
                      {item.quote}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="secondary">{item.rating}/5 stars</Badge>
                      <form action={toggleTestimonialPublish}>
                        <input type="hidden" name="id" value={item.id} />
                        <input
                          type="hidden"
                          name="publish"
                          value={String(!item.is_published)}
                        />
                        <Button type="submit" variant="outline" size="sm">
                          {item.is_published ? "Unpublish" : "Publish"}
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-14 text-center text-slate-500">
                  <MessageSquareQuote className="mx-auto mb-3 size-9" />
                  No testimonials yet.
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
