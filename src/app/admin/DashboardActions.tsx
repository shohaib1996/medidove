import { Button } from "@/components/ui/button";
import { updateAdminRecordStatus } from "./actions";

export const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) => (
  <div>
    <dt className="text-xs font-semibold uppercase text-slate-400">{label}</dt>
    <dd className="mt-1 break-words text-sm text-slate-700">
      {value || "Not provided"}
    </dd>
  </div>
);

export const StatusAction = ({
  table,
  id,
  status,
  label,
}: {
  table: "appointments" | "contact_leads" | "call_logs" | "whatsapp_messages";
  id: string;
  status: string;
  label: string;
}) => (
  <form action={updateAdminRecordStatus}>
    <input type="hidden" name="table" value={table} />
    <input type="hidden" name="id" value={id} />
    <input type="hidden" name="status" value={status} />
    <Button type="submit" variant="outline" size="sm">
      {label}
    </Button>
  </form>
);
