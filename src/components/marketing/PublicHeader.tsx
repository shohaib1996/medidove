"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  LayoutDashboard,
  LogIn,
  Loader2,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ClinicAssistantWidget from "@/components/ai/ClinicAssistantWidget";
import PublicSearchButton from "@/components/common/PublicSearchButton";
import { getBookDestination } from "@/lib/auth/actions";

const destinationMeta: Record<
  string,
  { label: string; icon: typeof CalendarDays }
> = {
  "/admin": { label: "Admin Dashboard", icon: LayoutDashboard },
  "/doctor-portal": { label: "Doctor Portal", icon: Stethoscope },
  "/portal": { label: "Patient Portal", icon: UserRound },
  "/login": { label: "Login", icon: LogIn },
};

const PublicHeader = () => {
  const router = useRouter();
  const [isResolving, startTransition] = useTransition();
  const [destination, setDestination] = useState<string | null>(null);

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

          <div className="flex items-center gap-2">
            <PublicSearchButton />
            <Button
              size="sm"
              onClick={handleBookClick}
              disabled={isResolving}
            >
              {isResolving ? <Loader2 className="animate-spin" /> : <Icon />}
              {label}
            </Button>
          </div>
        </div>
      </header>
      <ClinicAssistantWidget />
    </>
  );
};

export default PublicHeader;
