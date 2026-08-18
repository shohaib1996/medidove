
import AppointmentBookingPage from "@/components/appointments/AppointmentBookingPage";

export const metadata = {
  title: "Book Appointment | MediDove AI Clinic",
  description:
    "Submit a Supabase-backed appointment request for the MediDove AI clinic platform.",
};

const index = () => {
  return <AppointmentBookingPage />;
};

export default index;
