import Link from "next/link";
import { CalendarCheck, Home } from "lucide-react";
import PublicHeader from "@/components/marketing/PublicHeader";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Page Not Found | MediDove",
};

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicHeader />
      <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center md:px-8">
        <p className="text-sm font-bold uppercase text-primary">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 max-w-xl text-slate-600">
          The page you are looking for does not exist. It might have been
          moved or removed.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              <Home />
              Back to home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/appointment">
              <CalendarCheck />
              Book appointment
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
