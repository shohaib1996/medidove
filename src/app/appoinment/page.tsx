
import AppointmentBookingPage from "@/components/appointments/AppointmentBookingPage";
import { getBookingOptions } from "@/lib/clinic/content";

export const metadata = {
  title: "Book Appointment | MediDove AI Clinic",
  description:
    "Submit a Supabase-backed appointment request for the MediDove AI clinic platform.",
};

const index = async () => {
  const bookingOptions = await getBookingOptions();

  return <AppointmentBookingPage bookingOptions={bookingOptions} />;
};

export default index;
