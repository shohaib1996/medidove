import { notFound } from "next/navigation";
import BlogArticlePage from "@/components/blogs/BlogArticlePage";
import {
  getPublicBlogPostBySlug,
  getPublicBlogPosts,
} from "@/lib/blog/content";

type BlogArticleRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const generateMetadata = async ({ params }: BlogArticleRouteProps) => {
  const { slug } = await params;
  const post = await getPublicBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | MediDove Clinic",
    };
  }

  return {
    title: `${post.title} | MediDove Clinic`,
    description: post.excerpt,
  };
};

export const generateStaticParams = async () => {
  const posts = await getPublicBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
};

export default async function BlogArticleRoute({
  params,
}: BlogArticleRouteProps) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([
    getPublicBlogPostBySlug(slug),
    getPublicBlogPosts(),
  ]);

  if (!post) {
    notFound();
  }

  const relatedPosts = posts
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

  return <BlogArticlePage post={post} relatedPosts={relatedPosts} />;
}
