import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ComingSoonOverlayProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

const ComingSoonOverlay = ({
  title,
  description,
  children,
}: ComingSoonOverlayProps) => (
  <>
    <div aria-hidden className="pointer-events-none select-none blur-sm">
      {children}
    </div>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/10 p-4 backdrop-blur-[2px]">
      <div className="max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="size-6 text-primary" />
        </div>
        <Badge variant="secondary" className="mt-4">
          Coming soon
        </Badge>
        <h2 className="mt-3 text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        <Button asChild className="mt-5">
          <Link href="/admin">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  </>
);

export default ComingSoonOverlay;
