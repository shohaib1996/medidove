import { redirect } from "next/navigation";

export const metadata = {
  title: "Book Appointment | MediDove AI Clinic",
  description:
    "Submit a Supabase-backed appointment request for the MediDove AI clinic platform.",
};

const LegacyAppointmentPage = () => {
  redirect("/appointment");
};

export default LegacyAppointmentPage;
