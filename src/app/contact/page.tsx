import ContactPage from "@/components/contact/ContactPage";
import { getClinicSettings } from "@/lib/clinic/settings";

export const metadata = {
  title: "Contact | MediDove",
  description:
    "Contact the MediDove clinic team for appointment help, service questions, reminders, and patient support.",
};

const getSingleParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const index = async ({
  searchParams,
}: {
  searchParams: Promise<{
    product?: string | string[];
    "package"?: string | string[];
  }>;
}) => {
  const settings = await getClinicSettings();
  const params = await searchParams;
  const product = getSingleParam(params.product);
  const packageName = getSingleParam(params["package"]);
  const inquiryContext = product
    ? { type: "product" as const, label: product }
    : packageName
      ? { type: "package" as const, label: packageName }
      : undefined;

  return <ContactPage settings={settings} inquiryContext={inquiryContext} />;
};

export default index;
