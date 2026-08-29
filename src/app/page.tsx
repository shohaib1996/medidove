import HomePage from "@/components/marketing/HomePage";
import { getPublicDoctors, getPublicServices } from "@/lib/clinic/content";
import { getClinicSettings } from "@/lib/clinic/settings";
import { getHealthPackages } from "@/lib/packages/content";
import { getPublicProducts } from "@/lib/products/content";
import { getPublicTestimonials } from "@/lib/testimonials/content";

export const metadata = {
  title: "MediDove Online Clinic",
  description:
    "Book appointments, contact reception, receive reminders, and get safe service guidance from MediDove Online Clinic.",
};

const HomeMain = async () => {
  const [services, { doctors }, packages, products, testimonials, settings] =
    await Promise.all([
      getPublicServices(),
      getPublicDoctors({ pageSize: 8 }),
      getHealthPackages(),
      getPublicProducts(),
      getPublicTestimonials(),
      getClinicSettings(),
    ]);

  return (
    <HomePage
      services={services}
      doctors={doctors}
      packages={packages}
      products={products}
      testimonials={testimonials}
      settings={settings}
    />
  );
};

export default HomeMain;
