import Image from "next/image";
import Link from "next/link";
import { CalendarDays, FileText, Sparkles, UserRound } from "lucide-react";
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
import type { PublicBlogPost } from "@/lib/blog/content";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));

const BlogPage = ({ posts }: { posts: PublicBlogPost[] }) => {
  const featured = posts[0];
  const remaining = posts.slice(1);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicHeader />
      <main>
        <section className="bg-slate-950 px-4 py-20 text-white md:px-8">
          <div className="mx-auto max-w-7xl">
            <Badge className="mb-6 bg-white/10 text-white">
              <Sparkles className="size-3.5" />
              AI healthcare content
            </Badge>
            <h1 className="max-w-4xl text-4xl font-bold tracking-normal md:text-6xl">
              Clinic growth, AI reception, and patient engagement insights
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Publish Supabase-managed SEO content for healthcare buyers,
              clinics, and care teams interested in automation without unsafe
              diagnosis claims.
            </p>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8">
          <div className="mx-auto max-w-7xl space-y-10">
            {featured ? (
              <Card className="overflow-hidden">
                <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="relative min-h-80 bg-slate-100">
                    <Image
                      src={featured.imageUrl}
                      alt={featured.title}
                      fill
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      className="object-cover"
                      unoptimized={featured.imageUrl.startsWith("http")}
                    />
                  </div>
                  <div className="p-6 md:p-10">
                    <Badge>{featured.category}</Badge>
                    <h2 className="mt-5 text-3xl font-bold tracking-normal md:text-4xl">
                      {featured.title}
                    </h2>
                    <p className="mt-5 leading-8 text-slate-600">
                      {featured.excerpt}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="size-4" />
                        {formatDate(featured.publishedAt)}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <UserRound className="size-4" />
                        {featured.authorName}
                      </span>
                    </div>
                    <Button asChild className="mt-8">
                      <Link href={`/blog/${featured.slug}`}>
                        Read article
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ) : null}

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {remaining.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                      unoptimized={post.imageUrl.startsWith("http")}
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-xs text-slate-500">
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 text-xl">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3 leading-6">
                      {post.excerpt}
                    </CardDescription>
                    <Button asChild variant="outline" className="mt-6">
                      <Link href={`/blog/${post.slug}`}>
                        <FileText />
                        Read more
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
};

export default BlogPage;
