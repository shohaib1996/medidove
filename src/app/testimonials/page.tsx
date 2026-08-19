import TestimonialsPage from "@/components/testimonials/TestimonialsPage";
import { getPublicTestimonials } from "@/lib/testimonials/content";

export const metadata = {
  title: "Testimonials | MediDove Clinic",
  description:
    "Read MediDove Clinic testimonials and proof points for appointment booking, reception, patient engagement, and admin workflows.",
};

export default async function TestimonialsRoute() {
  const testimonials = await getPublicTestimonials();

  return <TestimonialsPage testimonials={testimonials} />;
}
