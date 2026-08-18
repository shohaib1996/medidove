import PackagesPage from "@/components/packages/PackagesPage";
import { getHealthPackages } from "@/lib/packages/content";

export const metadata = {
  title: "Health Packages | MediDove AI Clinic",
  description:
    "Browse preventive health, dental, and screening packages with AI-assisted appointment intake and patient follow-up workflows.",
};

export default async function PackagesRoute() {
  const packages = await getHealthPackages();

  return <PackagesPage packages={packages} />;
}
