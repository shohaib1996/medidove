
import ServicesPage from "@/components/services/ServicesPage";
import { getPublicServices } from "@/lib/clinic/content";

export const metadata = {
  title: "Services | MediDove",
  description:
    "Explore MediDove medical services, departments, appointment options, and patient support workflows.",
};

const index = async () => {
  const services = await getPublicServices();

  return <ServicesPage services={services} />;
};

export default index;
