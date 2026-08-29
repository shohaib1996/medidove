"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";
import SignOutButton from "@/app/portal/SignOutButton";

const navItems = [
  { href: "/portal", label: "Dashboard" },
  { href: "/portal/timeline", label: "Timeline" },
  { href: "/portal/consents", label: "Consents" },
];

const PortalHeader = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/portal" className="flex items-center gap-3">
          <Image
            src="/assets/img/logo/logo.png"
            alt="MediDove"
            width={140}
            height={40}
            priority
          />
        </Link>

        <nav className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-semibold transition",
                  isActive
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-900",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-primary hover:text-primary"
            aria-label="Back to website"
          >
            <Home className="size-4" />
          </Link>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
};

export default PortalHeader;
