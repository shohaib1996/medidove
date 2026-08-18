import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, ShieldCheck, UserRound } from "lucide-react";
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
    dateStyle: "long",
  }).format(new Date(value));

const getParagraphs = (content: string) =>
  content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

const BlogArticlePage = ({
  post,
  relatedPosts,
}: {
  post: PublicBlogPost;
  relatedPosts: PublicBlogPost[];
}) => {
  const paragraphs = getParagraphs(post.content);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicHeader />
      <main>
        <article>
          <section className="bg-slate-950 px-4 py-16 text-white md:px-8">
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <Button
                  asChild
                  variant="secondary"
                  className="mb-8 bg-white/10 text-white hover:bg-white/20"
                >
                  <Link href="/blog">
                    <ArrowLeft />
                    Back to blog
                  </Link>
                </Button>
                <Badge className="bg-white/10 text-white">{post.category}</Badge>
                <h1 className="mt-5 text-4xl font-bold tracking-normal md:text-6xl">
                  {post.title}
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-300">
                  {post.excerpt}
                </p>
                <div className="mt-7 flex flex-wrap gap-4 text-sm text-slate-300">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="size-4" />
                    {formatDate(post.publishedAt)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <UserRound className="size-4" />
                    {post.authorName}
                  </span>
                </div>
              </div>
              <div className="relative min-h-80 overflow-hidden rounded-lg bg-slate-900 md:min-h-[460px]">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  unoptimized={post.imageUrl.startsWith("http")}
                />
              </div>
            </div>
          </section>

          <section className="px-4 py-14 md:px-8">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_340px]">
              <div className="max-w-3xl">
                <div className="space-y-6 text-lg leading-9 text-slate-700">
                  {(paragraphs.length > 0 ? paragraphs : [post.excerpt]).map(
                    (paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ),
                  )}
                </div>

                <div className="mt-10 rounded-lg border border-cyan-100 bg-cyan-50 p-6">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-1 size-5 shrink-0 text-cyan-700" />
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        Safety note
                      </h2>
                      <p className="mt-2 leading-7 text-slate-700">
                        MediDove AI content is for clinic automation,
                        scheduling, routing, and patient engagement workflows.
                        It is not a diagnosis or treatment recommendation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="space-y-5">
                <Card>
                  <CardHeader>
                    <CardDescription>Next step</CardDescription>
                    <CardTitle>Turn content into bookings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-6 text-slate-600">
                      Use this article content with the AI assistant,
                      appointment intake, and receptionist workflow to show a
                      complete clinic growth system.
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/appointment">Book appointment</Link>
                    </Button>
                  </CardContent>
                </Card>

                {relatedPosts.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardDescription>More insights</CardDescription>
                      <CardTitle>Related articles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <Link
                          key={relatedPost.id}
                          href={`/blog/${relatedPost.slug}`}
                          className="block rounded-lg border border-slate-200 p-4 transition hover:border-primary hover:bg-slate-50"
                        >
                          <Badge variant="secondary">
                            {relatedPost.category}
                          </Badge>
                          <p className="mt-3 font-semibold leading-6 text-slate-900">
                            {relatedPost.title}
                          </p>
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                ) : null}
              </aside>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
};

export default BlogArticlePage;
