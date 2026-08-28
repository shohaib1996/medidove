import { Button } from "@/components/ui/button";
import { updateCareTaskStatus } from "./actions";
import type { TaskFilter } from "./types";

const StatusAction = ({
  id,
  status,
  label,
}: {
  id: string;
  status: Exclude<TaskFilter, "all">;
  label: string;
}) => (
  <form action={updateCareTaskStatus}>
    <input type="hidden" name="id" value={id} />
    <input type="hidden" name="status" value={status} />
    <Button type="submit" size="sm" variant="outline">
      {label}
    </Button>
  </form>
);


export default StatusAction;
