import Image from "next/image";
import Link from "next/link";
import { CalendarDays, LayoutDashboard, LogIn, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClinicAssistantWidget from "@/components/ai/ClinicAssistantWidget";
import PublicSearchButton from "@/components/common/PublicSearchButton";

const navItems = [
  { href: "/service", label: "Services" },
  { href: "/doctor", label: "Doctors" },
  { href: "/packages", label: "Packages" },
  { href: "/shop", label: "Shop" },
  { href: "/testimonials", label: "Proof" },
  { href: "/receptionist", label: "Reception" },
  { href: "/engagement", label: "Engagement" },
  { href: "/appointment", label: "Appointment" },
  { href: "/contact", label: "Contact" },
];

const PublicHeader = () => {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 px-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/assets/img/logo/logo.png"
              alt="MediDove"
              width={164}
              height={48}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-slate-600 transition hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <PublicSearchButton />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/login">
                <LogIn />
                Login
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
              <Link href="/admin">
                <LayoutDashboard />
                Admin
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
              <Link href="/portal">
                <UserRound />
                Portal
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/appointment">
                <CalendarDays />
                Book
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <ClinicAssistantWidget />
    </>
  );
};

export default PublicHeader;
