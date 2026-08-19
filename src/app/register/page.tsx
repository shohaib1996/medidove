import RegisterPage from "@/components/auth/RegisterPage";

export const metadata = {
  title: "Register | MediDove",
  description:
    "Create a MediDove account for appointment requests, reminders, and patient portal access.",
};

const RegisterRoute = () => {
  return <RegisterPage />;
};

export default RegisterRoute;
