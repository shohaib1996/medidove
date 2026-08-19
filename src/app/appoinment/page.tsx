import { redirect } from "next/navigation";

export const metadata = {
  title: "Book Appointment | MediDove Clinic",
  description:
    "Submit an appointment request for MediDove clinic services and staff review.",
};

const LegacyAppointmentPage = () => {
  redirect("/appointment");
};

export default LegacyAppointmentPage;
