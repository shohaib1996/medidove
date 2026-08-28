import LoginPage from "@/components/auth/LoginPage";

export const metadata = {
  title: "Login | MediDove",
  description:
    "Login to your MediDove account to review appointments, messages, and patient support workflows.",
};

const getParam = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

const LoginRoute = async ({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[]; status?: string | string[] }>;
}) => {
  const params = await searchParams;

  return (
    <LoginPage
      errorMessage={getParam(params.error)}
      statusMessage={getParam(params.status)}
    />
  );
};

export default LoginRoute;
