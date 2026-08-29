"use client";

import { useRef, useState, useTransition } from "react";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/common/DatePicker";

type RescheduleDialogProps = {
  appointmentId: string;
  defaultDate?: string;
  defaultTime?: string;
  action: (formData: FormData) => Promise<void>;
  triggerLabel?: string;
  triggerVariant?: "outline" | "default" | "secondary";
};

const RescheduleDialog = ({
  appointmentId,
  defaultDate,
  defaultTime,
  action,
  triggerLabel = "Reschedule",
  triggerVariant = "outline",
}: RescheduleDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [dialogNode, setDialogNode] = useState<HTMLDialogElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const openDialog = () => {
    setError(null);
    dialogRef.current?.showModal();
  };

  const closeDialog = () => dialogRef.current?.close();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      try {
        await action(formData);
        closeDialog();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not update the appointment.",
        );
      }
    });
  };

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant={triggerVariant}
        onClick={openDialog}
      >
        <CalendarClock />
        {triggerLabel}
      </Button>

      <dialog
        ref={(node) => {
          dialogRef.current = node;
          setDialogNode(node);
        }}
        className="fixed inset-0 m-auto w-full max-w-sm rounded-lg border border-slate-200 bg-white p-0 shadow-xl backdrop:bg-slate-950/60"
      >
        <form action={handleSubmit} className="space-y-4 p-6">
          <div>
            <h3 className="text-lg font-semibold">Reschedule appointment</h3>
            <p className="mt-1 text-sm text-slate-500">
              Choose a new date and time for this appointment.
            </p>
          </div>

          <input type="hidden" name="id" value={appointmentId} />

          <div className="space-y-2">
            <Label htmlFor={`date-${appointmentId}`}>Date</Label>
            <DatePicker
              id={`date-${appointmentId}`}
              name="date"
              defaultValue={defaultDate}
              portalContainer={dialogNode}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`time-${appointmentId}`}>Time</Label>
            <Input
              id={`time-${appointmentId}`}
              name="time"
              type="time"
              defaultValue={defaultTime}
              required
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default RescheduleDialog;
