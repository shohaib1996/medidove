import ContactPage from "@/components/contact/ContactPage";

export const metadata = {
  title: "Contact | MediDove AI Clinic",
  description:
    "Send a message to MediDove AI Clinic. Contact leads are stored in Supabase for admin and AI follow-up workflows.",
};

const index = () => {
  return <ContactPage />;
};

export default index;
