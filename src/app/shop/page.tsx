import ShopCatalogPage from "@/components/shop/ShopCatalogPage";
import { getPublicProducts } from "@/lib/products/content";

export const metadata = {
  title: "Wellness Shop | MediDove AI Clinic",
  description:
    "Browse non-prescription wellness products and staff-reviewed product inquiry workflows for the MediDove AI Clinic demo.",
};

const index = async () => {
  const products = await getPublicProducts();

  return <ShopCatalogPage products={products} />;
};

export default index;
