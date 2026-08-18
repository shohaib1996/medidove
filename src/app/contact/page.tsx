import ContactPage from "@/components/contact/ContactPage";
import { getClinicSettings } from "@/lib/clinic/settings";

export const metadata = {
  title: "Contact | MediDove AI Clinic",
  description:
    "Send a message to MediDove AI Clinic. Contact leads are stored in Supabase for admin and AI follow-up workflows.",
};

const index = async () => {
  const settings = await getClinicSettings();

  return <ContactPage settings={settings} />;
};

export default index;
