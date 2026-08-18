import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, Plus, Search, Sparkles } from "lucide-react";
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
import { createBlogPost, toggleBlogPostPublish } from "./actions";

export const metadata = {
  title: "Blog CMS | MediDove Admin",
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
};

const formatDate = (value: string | null) => {
  if (!value) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
};

export default async function AdminBlogPage() {
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
    .from("blog_posts")
    .select("id, title, slug, category, excerpt, is_published, published_at, created_at")
    .order("created_at", { ascending: false })
    .limit(40);

  const posts = (data || []) as BlogPost[];
  const published = posts.filter((post) => post.is_published).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase text-primary">Blog CMS</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">
              AI healthcare content management
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Publish buyer-facing clinic content for AI reception, smart
              intake, patient engagement, and safe healthcare automation.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/blog">View blog</Link>
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
                <CardDescription>Total posts</CardDescription>
                <CardTitle className="mt-2 text-3xl">{posts.length}</CardTitle>
              </div>
              <FileText className="size-8 text-primary" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Published</CardDescription>
                <CardTitle className="mt-2 text-3xl">{published}</CardTitle>
              </div>
              <Search className="size-8 text-emerald-600" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Drafts</CardDescription>
                <CardTitle className="mt-2 text-3xl">
                  {posts.length - published}
                </CardTitle>
              </div>
              <Sparkles className="size-8 text-cyan-600" />
            </CardHeader>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <Card>
            <CardHeader>
              <CardDescription>New article</CardDescription>
              <CardTitle>Create blog post</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createBlogPost} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="How AI receptionists reduce missed calls"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      placeholder="AI Reception"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author_name">Author</Label>
                    <Input
                      id="author_name"
                      name="author_name"
                      placeholder="MediDove Team"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    placeholder="/assets/img/blog/news-thumb-1.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    rows={4}
                    placeholder="Short SEO summary."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    rows={8}
                    placeholder="Write the article body."
                  />
                </div>
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
                  Save post
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div>
                        <CardDescription>{formatDate(post.published_at)}</CardDescription>
                        <CardTitle className="mt-2 text-xl">{post.title}</CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge>{post.category}</Badge>
                        <Badge variant={post.is_published ? "secondary" : "outline"}>
                          {post.is_published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-6 text-slate-600">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/blog-details?post=${post.slug}`}>
                          Preview
                        </Link>
                      </Button>
                      <form action={toggleBlogPostPublish}>
                        <input type="hidden" name="id" value={post.id} />
                        <input
                          type="hidden"
                          name="publish"
                          value={String(!post.is_published)}
                        />
                        <Button type="submit" variant="outline" size="sm">
                          {post.is_published ? "Unpublish" : "Publish"}
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-14 text-center text-slate-500">
                  <FileText className="mx-auto mb-3 size-9" />
                  No blog posts yet.
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
