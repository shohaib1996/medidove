import { LogOut } from "lucide-react";

type SignOutButtonProps = {
  className?: string;
  variant?: "outline" | "secondary";
};

const variantClasses = {
  outline: "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
};

const SignOutButton = ({ className = "", variant = "outline" }: SignOutButtonProps) => {
  return (
    // Use a native navigation so logout still works if client-side routing is stale.
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a
      href="/auth/signout"
      className={`pointer-events-auto relative z-9999 inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition ${variantClasses[variant]} ${className}`}
    >
      <LogOut className="h-4 w-4" />
      <span>Sign out</span>
    </a>
  );
};

export default SignOutButton;
