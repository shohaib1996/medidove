
import BlogPage from "@/components/blogs/BlogPage";
import { getPublicBlogPosts } from "@/lib/blog/content";

export const metadata = {
  title: "Blog | MediDove AI Clinic",
  description:
    "AI healthcare automation articles about clinic reception, appointment intake, patient engagement, and safe medical workflow support.",
};

const index = async () => {
  const posts = await getPublicBlogPosts();

  return <BlogPage posts={posts} />;
};

export default index;  
