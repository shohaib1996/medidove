import AppointmentBookingPage from "@/components/appointments/AppointmentBookingPage";
import { getBookingOptions } from "@/lib/clinic/content";

export const metadata = {
  title: "Book Appointment | MediDove",
  description:
    "Request an appointment with MediDove and let the clinic team review the right care option for you.",
};

const AppointmentPage = async () => {
  const bookingOptions = await getBookingOptions();

  return <AppointmentBookingPage bookingOptions={bookingOptions} />;
};

export default AppointmentPage;
