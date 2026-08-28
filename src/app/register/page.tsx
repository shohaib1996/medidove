import RegisterPage from "@/components/auth/RegisterPage";

export const metadata = {
  title: "Register | MediDove",
  description:
    "Create a MediDove account for appointment requests, reminders, and patient portal access.",
};

const getParam = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

const RegisterRoute = async ({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) => {
  const params = await searchParams;

  return <RegisterPage errorMessage={getParam(params.error)} />;
};

export default RegisterRoute;
