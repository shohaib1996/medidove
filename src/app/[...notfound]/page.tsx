 
import { notFound } from "next/navigation";

export const metadata = {
  title: "Page Not Found | MediDove",
};

const NotFoundCatchAllPage = () => {
  notFound();
};

export default NotFoundCatchAllPage;
