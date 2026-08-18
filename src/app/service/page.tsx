
import ServicesPage from "@/components/services/ServicesPage";
import { getPublicServices } from "@/lib/clinic/content";

export const metadata = {
  title: "Services | MediDove AI Clinic",
  description:
    "Explore AI-ready medical services and departments connected to the MediDove Supabase booking workflow.",
};

const index = async () => {
  const services = await getPublicServices();

  return <ServicesPage services={services} />;
};

export default index;
