"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMotionValueEvent, useScroll } from "motion/react";
import {
  CalendarDays,
  LayoutDashboard,
  LogIn,
  Loader2,
  Menu,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ClinicAssistantWidget from "@/components/ai/ClinicAssistantWidget";
import PublicSearchButton from "@/components/common/PublicSearchButton";
import { getBookDestination } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

const destinationMeta: Record<
  string,
  { label: string; icon: typeof CalendarDays }
> = {
  "/admin": { label: "Admin Dashboard", icon: LayoutDashboard },
  "/doctor-portal": { label: "Doctor Portal", icon: Stethoscope },
  "/portal": { label: "Patient Portal", icon: UserRound },
  "/login": { label: "Login", icon: LogIn },
};

export type HeaderNavLink = { label: string; href: string };

type PublicHeaderProps = {
  /** Float the header over a dark hero until the user scrolls. */
  overlay?: boolean;
  links?: HeaderNavLink[];
};

const PublicHeader = ({ overlay = false, links }: PublicHeaderProps) => {
  const router = useRouter();
  const { scrollY } = useScroll();
  const [isResolving, startTransition] = useTransition();
  const [destination, setDestination] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 40);
  });

  useEffect(() => {
    let isMounted = true;

    getBookDestination().then((result) => {
      if (isMounted) {
        setDestination(result);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleBookClick = () => {
    startTransition(async () => {
      const target = destination || (await getBookDestination());
      router.push(target);
    });
  };

  // Default to the "Login" state while the real destination is still
  // resolving, since most public visitors are logged out — this avoids
  // briefly flashing "Book" before switching to the correct label.
  const meta = (destination ? destinationMeta[destination] : null) ||
    destinationMeta["/login"];
  const label = meta.label;
  const Icon = meta.icon;

  // Transparent only while floating over a dark hero and still at the top.
  // An open mobile menu forces the solid treatment so its panel stays legible.
  const isFloating = overlay && !isScrolled && !isMenuOpen;

  return (
    <>
      <header
        className={cn(
          "z-50 transition-all duration-300",
          // Overlay mode must leave the flow so the hero renders behind it.
          overlay ? "fixed inset-x-0 top-0" : "sticky top-0",
          isFloating
            ? "border-b border-transparent bg-transparent"
            : "border-b border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-xl",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 transition-all duration-300 md:px-8",
            isFloating ? "min-h-22" : "min-h-18",
          )}
        >
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <Image
              src={isFloating ? "/assets/img/logo/logo-2.png" : "/assets/img/logo/logo.png"}
              alt="MediDove"
              width={164}
              height={48}
              priority
              className="h-10 w-auto"
            />
          </Link>

          {links?.length ? (
            <nav className="hidden items-center gap-1 lg:flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isFloating
                      ? "text-white/80 hover:bg-white/10 hover:text-white"
                      : "text-slate-600 hover:bg-rose-50 hover:text-rose-600",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ) : null}

          <div className="flex shrink-0 items-center gap-2">
            <PublicSearchButton
              className={cn(
                "hidden sm:inline-flex",
                isFloating && "text-white/85 hover:bg-white/10 hover:text-white",
              )}
            />
            <Button
              size="sm"
              onClick={handleBookClick}
              disabled={isResolving}
              className={cn(
                "h-10 rounded-full px-4 transition-transform hover:scale-[1.04] sm:px-5",
                isFloating
                  ? "bg-white text-slate-900 hover:bg-white/90"
                  : "glow-brand",
              )}
            >
              {isResolving ? <Loader2 className="animate-spin" /> : <Icon />}
              {/* Labels like "Admin Dashboard" overflow a 375px viewport. */}
              <span className="hidden sm:inline">{label}</span>
            </Button>

            {links?.length ? (
              <button
                type="button"
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className={cn(
                  "flex size-10 items-center justify-center rounded-full transition lg:hidden",
                  isFloating
                    ? "text-white hover:bg-white/10"
                    : "text-slate-700 hover:bg-slate-100",
                )}
              >
                {isMenuOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </button>
            ) : null}
          </div>
        </div>

        {links?.length && isMenuOpen ? (
          <div className="border-t border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 md:px-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-rose-50 hover:text-rose-600"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        ) : null}
      </header>
      <ClinicAssistantWidget />
    </>
  );
};

export default PublicHeader;
