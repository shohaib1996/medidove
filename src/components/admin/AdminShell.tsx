"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Ban,
  BarChart3,
  BookOpenText,
  Bot,
  CalendarClock,
  FileText,
  HeartPulse,
  Home,
  Inbox,
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  Stethoscope,
  UsersRound,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SignOutButton from "@/app/portal/SignOutButton";

const sections = [
  {
    label: "Operations",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/appointments", label: "Appointments", icon: CalendarClock },
      { href: "/admin/patients", label: "Patients", icon: UsersRound },
      { href: "/admin/staff", label: "Staff", icon: UserCog },
      { href: "/admin/schedule", label: "Schedule", icon: Stethoscope },
    ],
  },
  {
    label: "Growth",
    items: [
      { href: "/admin/leads", label: "Leads", icon: Inbox },
      { href: "/admin/ai-leads", label: "AI Leads", icon: Bot },
      { href: "/admin/communications", label: "Inbox", icon: MessageCircle },
      { href: "/admin/outreach", label: "Outreach", icon: Megaphone },
      { href: "/admin/opt-outs", label: "Opt-outs", icon: Ban },
      { href: "/admin/feedback", label: "Feedback", icon: HeartPulse },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/content", label: "Clinic Content", icon: BookOpenText },
      { href: "/admin/blog", label: "Blog CMS", icon: FileText },
      { href: "/admin/testimonials", label: "Proof", icon: ShieldCheck },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/conversations", label: "AI Conversations", icon: Bot },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin/automations", label: "Automations", icon: Search },
      { href: "/admin/integrations", label: "Integrations", icon: Activity },
      { href: "/admin/audit", label: "Audit", icon: ShieldCheck },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

const isActiveRoute = (pathname: string, href: string) =>
  href === "/admin" ? pathname === href : pathname.startsWith(href);

const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 px-4 lg:min-h-20 lg:px-5">
          <Link href="/admin" className="min-w-0">
            <p className="text-xs font-bold uppercase text-primary">MediDove</p>
            <h2 className="truncate text-lg font-bold tracking-normal">
              Admin Console
            </h2>
          </Link>
          <Link
            href="/"
            className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-primary hover:text-primary"
            aria-label="View website"
          >
            <Home className="size-4" />
          </Link>
        </div>

        <nav className="flex gap-4 overflow-x-auto px-4 py-4 lg:block lg:space-y-6 lg:overflow-x-visible lg:px-5">
          {sections.map((section) => (
            <div key={section.label} className="min-w-56 lg:min-w-0">
              <p className="mb-2 px-2 text-[11px] font-bold uppercase text-slate-400">
                {section.label}
              </p>
              <div className="grid gap-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950",
                        isActive && "bg-primary text-white hover:bg-primary hover:text-white",
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4 lg:px-5">
          <SignOutButton className="w-full justify-center" />
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
};

export default AdminShell;
