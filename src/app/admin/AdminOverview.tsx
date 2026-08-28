import {
  Activity,
  CalendarClock,
  Headphones,
  Inbox,
  MessageCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AdminOverviewProps = {
  appointmentsCount: number;
  pendingAppointments: number;
  whatsAppCount: number;
  requestedWhatsApp: number;
  leadsCount: number;
  newLeads: number;
  urgentLeads: number;
  callLogsCount: number;
  requestedCallbacks: number;
  todayCount: number;
};

const StatCard = ({
  title,
  value,
  detail,
  icon: Icon,
  iconClassName,
}: {
  title: string;
  value: number;
  detail: string;
  icon: typeof Activity;
  iconClassName: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between gap-4">
      <div>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="mt-2 text-3xl">{value}</CardTitle>
      </div>
      <Icon className={`size-8 ${iconClassName}`} />
    </CardHeader>
    <CardContent className="text-sm text-slate-500">{detail}</CardContent>
  </Card>
);

const AdminOverview = ({
  appointmentsCount,
  pendingAppointments,
  whatsAppCount,
  requestedWhatsApp,
  leadsCount,
  newLeads,
  urgentLeads,
  callLogsCount,
  requestedCallbacks,
  todayCount,
}: AdminOverviewProps) => (
  <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
    <StatCard
      title="Total requests"
      value={appointmentsCount}
      detail={`${pendingAppointments} pending appointments`}
      icon={CalendarClock}
      iconClassName="text-primary"
    />
    <StatCard
      title="WhatsApp"
      value={whatsAppCount}
      detail={`${requestedWhatsApp} opt-ins waiting`}
      icon={MessageCircle}
      iconClassName="text-emerald-600"
    />
    <StatCard
      title="Contact leads"
      value={leadsCount}
      detail={`${newLeads} new leads, ${urgentLeads} high urgency`}
      icon={Inbox}
      iconClassName="text-teal-600"
    />
    <StatCard
      title="AI callbacks"
      value={callLogsCount}
      detail={`${requestedCallbacks} waiting for review`}
      icon={Headphones}
      iconClassName="text-indigo-600"
    />
    <StatCard
      title="Today"
      value={todayCount}
      detail="new website submissions"
      icon={Activity}
      iconClassName="text-sky-600"
    />
  </section>
);

export default AdminOverview;
