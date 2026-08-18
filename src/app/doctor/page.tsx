
import DoctorsPage from "@/components/doctors/DoctorsPage";
import { getPublicDoctors } from "@/lib/clinic/content";

export const metadata = {
  title: "Doctors | MediDove AI Clinic",
  description:
    "Explore MediDove doctors and AI-ready care matching workflows for appointment booking.",
};

const index = async () => {
  const doctors = await getPublicDoctors();

  return <DoctorsPage doctors={doctors} />;
};

export default index;
