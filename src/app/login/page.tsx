import LoginPage from "@/components/auth/LoginPage";

export const metadata = {
  title: "Login | MediDove AI Clinic",
  description:
    "Login to the MediDove AI Clinic platform with Supabase authentication.",
};

const LoginRoute = () => {
  return <LoginPage />;
};

export default LoginRoute;
