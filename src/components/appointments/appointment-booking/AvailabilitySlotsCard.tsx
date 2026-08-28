import { CalendarDays, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AppointmentFieldUpdater, AppointmentForm, SlotTime } from "./types";

type AvailabilitySlotsCardProps = {
  form: AppointmentForm;
  slotTimes: SlotTime[];
  updateField: AppointmentFieldUpdater;
};

const AvailabilitySlotsCard = ({
  form,
  slotTimes,
  updateField,
}: AvailabilitySlotsCardProps) => (
  <Card className="border-slate-200 bg-white shadow-none">
    <CardHeader>
      <CardDescription>Doctor availability</CardDescription>
      <CardTitle className="flex items-center gap-2 text-xl">
        <CalendarDays className="size-5 text-primary" />
        Matching open slots
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {form.requestedDate ? (
        slotTimes.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {slotTimes.map((slot) => (
              <Button
                key={`${slot.label}-${slot.value}`}
                type="button"
                variant={form.requestedTime === slot.value ? "default" : "outline"}
                onClick={() => updateField("requestedTime", slot.value)}
                className="h-auto justify-start py-3 text-left"
              >
                <Clock3 className="size-4" />
                <span className="min-w-0">
                  <span className="block font-semibold">{slot.value}</span>
                  <span className="block truncate text-xs opacity-80">
                    {slot.location || "Clinic"}
                  </span>
                </span>
              </Button>
            ))}
          </div>
        ) : (
          <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            No configured slots match this date and doctor yet. You can still
            request a preferred time.
          </p>
        )
      ) : (
        <p className="text-sm leading-6 text-slate-600">
          Select a date to see matching doctor availability from the admin
          schedule.
        </p>
      )}
    </CardContent>
  </Card>
);

export default AvailabilitySlotsCard;
