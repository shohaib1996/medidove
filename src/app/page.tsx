import HomePage from "@/components/marketing/HomePage";
import { getPublicDoctors, getPublicServices } from "@/lib/clinic/content";
import { getClinicSettings } from "@/lib/clinic/settings";
import { getPublicTestimonials } from "@/lib/testimonials/content";

export const metadata = {
  title: "MediDove Online Clinic",
  description:
    "Book appointments, contact reception, receive reminders, and get safe service guidance from MediDove Online Clinic.",
};

const HomeMain = async () => {
  const [services, { doctors }, testimonials, settings] = await Promise.all([
    getPublicServices(),
    getPublicDoctors({ pageSize: 8 }),
    getPublicTestimonials(),
    getClinicSettings(),
  ]);

  return (
    <HomePage
      services={services}
      doctors={doctors}
      testimonials={testimonials}
      settings={settings}
    />
  );
};

export default HomeMain;
