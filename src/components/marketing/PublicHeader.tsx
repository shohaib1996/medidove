"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClinicAssistantWidget from "@/components/ai/ClinicAssistantWidget";
import PublicSearchButton from "@/components/common/PublicSearchButton";
import { getBookDestination } from "@/lib/auth/actions";

const PublicHeader = () => {
  const router = useRouter();
  const [isResolving, startTransition] = useTransition();

  const handleBookClick = () => {
    startTransition(async () => {
      const destination = await getBookDestination();
      router.push(destination);
    });
  };

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
              {isResolving ? <Loader2 className="animate-spin" /> : <CalendarDays />}
              Book
            </Button>
          </div>
        </div>
      </header>
      <ClinicAssistantWidget />
    </>
  );
};

export default PublicHeader;
