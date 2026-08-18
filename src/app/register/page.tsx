import RegisterPage from "@/components/auth/RegisterPage";

export const metadata = {
  title: "Register | MediDove AI Clinic",
  description:
    "Create a MediDove AI Clinic account backed by Supabase authentication.",
};

const RegisterRoute = () => {
  return <RegisterPage />;
};

export default RegisterRoute;
