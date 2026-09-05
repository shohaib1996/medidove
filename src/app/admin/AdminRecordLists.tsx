import Link from "next/link";
import { Headphones, Inbox, MessageCircle, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailItem, StatusAction } from "./DashboardActions";
import { formatDate } from "./dashboard-utils";
import type {
  AppointmentRow,
  CallLogRow,
  LeadRow,
  WhatsAppMessageRow,
} from "./dashboard-types";

export const LatestPendingAppointment = ({
  appointment,
}: {
  appointment: AppointmentRow | null;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between gap-4">
      <div>
        <CardDescription>Appointments</CardDescription>
        <CardTitle>Latest pending request</CardTitle>
      </div>
      <Button asChild variant="outline" size="sm">
        <Link href="/admin/appointments">View all</Link>
      </Button>
    </CardHeader>
    <CardContent>
      {appointment ? (
        <article className="rounded-lg border border-slate-200 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                {appointment.patient_name}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                {appointment.reason || "No reason provided."}
              </p>
            </div>
            <Badge className="capitalize">{appointment.status}</Badge>
          </div>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <DetailItem label="Phone" value={appointment.patient_phone} />
            <DetailItem label="Department" value={appointment.requested_department || "Any"} />
            <DetailItem label="Doctor" value={appointment.requested_doctor || "Any"} />
            <DetailItem label="Requested" value={formatDate(appointment.requested_at)} />
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusAction table="appointments" id={appointment.id} status="confirmed" label="Confirm" />
            <StatusAction table="appointments" id={appointment.id} status="completed" label="Complete" />
            <StatusAction table="appointments" id={appointment.id} status="cancelled" label="Cancel" />
          </div>
        </article>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
          <Stethoscope className="mx-auto mb-3 size-8" />
          No pending appointment requests.
        </div>
      )}
    </CardContent>
  </Card>
);

export const CallbackList = ({ callLogs }: { callLogs: CallLogRow[] }) => {
  const callLog = callLogs[0] || null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardDescription>Voice</CardDescription>
          <CardTitle>AI receptionist callbacks</CardTitle>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/communications">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {callLog ? (
          <article className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-slate-900">{callLog.phone_number}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                  {callLog.ai_summary || callLog.transcript || "No call summary yet."}
                </p>
              </div>
              <Badge variant="secondary" className="capitalize">
                {callLog.status || callLog.direction}
              </Badge>
            </div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <DetailItem label="Direction" value={callLog.direction} />
              <DetailItem label="Provider" value={callLog.provider} />
              <DetailItem label="Started" value={formatDate(callLog.started_at)} />
              <DetailItem label="Created" value={formatDate(callLog.created_at)} />
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusAction table="call_logs" id={callLog.id} status="contacted" label="Contacted" />
              <StatusAction table="call_logs" id={callLog.id} status="completed" label="Complete" />
              <StatusAction table="call_logs" id={callLog.id} status="failed" label="Failed" />
            </div>
          </article>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
            <Headphones className="mx-auto mb-3 size-8" />
            No AI callback requests yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const WhatsAppList = ({
  messages,
}: {
  messages: WhatsAppMessageRow[];
}) => {
  const message = messages[0] || null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardDescription>WhatsApp</CardDescription>
          <CardTitle>Patient engagement opt-ins</CardTitle>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/communications">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {message ? (
          <article className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-slate-900">{message.phone_number}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                  {message.message}
                </p>
              </div>
              <Badge variant="secondary" className="capitalize">
                {message.status || message.direction}
              </Badge>
            </div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <DetailItem label="Direction" value={message.direction} />
              <DetailItem label="Status" value={message.status} />
              <DetailItem label="Created" value={formatDate(message.created_at)} />
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusAction table="whatsapp_messages" id={message.id} status="queued" label="Queue" />
              <StatusAction table="whatsapp_messages" id={message.id} status="sent" label="Mark sent" />
              <StatusAction table="whatsapp_messages" id={message.id} status="failed" label="Failed" />
            </div>
          </article>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
            <MessageCircle className="mx-auto mb-3 size-8" />
            No WhatsApp opt-ins yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const LeadList = ({ leads }: { leads: LeadRow[] }) => {
  const lead = leads[0] || null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardDescription>Leads</CardDescription>
          <CardTitle>Latest contact messages</CardTitle>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/leads">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {lead ? (
          <article className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-slate-900">{lead.name}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                  {lead.ai_summary || lead.message}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <Badge variant="secondary" className="capitalize">
                  {lead.ai_category || lead.status}
                </Badge>
                {lead.ai_urgency ? (
                  <Badge
                    className={lead.ai_urgency === "high" ? "bg-red-600 text-white" : "capitalize"}
                    variant={lead.ai_urgency === "high" ? "default" : "outline"}
                  >
                    {lead.ai_urgency}
                  </Badge>
                ) : null}
              </div>
            </div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <DetailItem label="Email" value={lead.email} />
              <DetailItem label="Phone" value={lead.phone} />
              <DetailItem label="Subject" value={lead.subject || "General"} />
              <DetailItem label="Created" value={formatDate(lead.created_at)} />
            </dl>
            {lead.ai_suggested_reply ? (
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-400">
                  AI suggested reply
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {lead.ai_suggested_reply}
                </p>
              </div>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusAction table="contact_leads" id={lead.id} status="contacted" label="Contacted" />
              <StatusAction table="contact_leads" id={lead.id} status="converted" label="Convert" />
              <StatusAction table="contact_leads" id={lead.id} status="closed" label="Close" />
            </div>
          </article>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
            <Inbox className="mx-auto mb-3 size-8" />
            No contact leads yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AdminRecordLists = ({
  latestPendingAppointment,
  callLogs,
  whatsAppMessages,
  leads,
}: {
  latestPendingAppointment: AppointmentRow | null;
  callLogs: CallLogRow[];
  whatsAppMessages: WhatsAppMessageRow[];
  leads: LeadRow[];
}) => (
  <section className="grid gap-6 xl:grid-cols-2">
    <LatestPendingAppointment appointment={latestPendingAppointment} />
    <CallbackList callLogs={callLogs} />
    <WhatsAppList messages={whatsAppMessages} />
    <LeadList leads={leads} />
  </section>
);

export default AdminRecordLists;
