import LoginPage from "@/components/auth/LoginPage";

export const metadata = {
  title: "Login | MediDove",
  description:
    "Login to your MediDove account to review appointments, messages, and patient support workflows.",
};

const LoginRoute = () => {
  return <LoginPage />;
};

export default LoginRoute;
