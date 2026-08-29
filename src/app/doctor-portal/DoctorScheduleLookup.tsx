"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { buildDateSlots, toDateKey, weekdays } from "./utils";
import type { AppointmentRow, AvailabilityRow } from "./types";

const parseDateKey = (value: string) => new Date(`${value}T00:00:00`);

const shiftDateKey = (dateKey: string, days: number) => {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
};

type DoctorScheduleLookupProps = {
  activeAvailability: AvailabilityRow[];
  appointments: AppointmentRow[];
  bookedDates: string[];
};

const DoctorScheduleLookup = ({
  activeAvailability,
  appointments,
  bookedDates,
}: DoctorScheduleLookupProps) => {
  const [selectedDateKey, setSelectedDateKey] = useState(() => toDateKey(new Date()));

  const selectedWeekday = useMemo(
    () => parseDateKey(selectedDateKey).getDay(),
    [selectedDateKey],
  );

  const selectedDateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(parseDateKey(selectedDateKey)),
    [selectedDateKey],
  );

  const dayBlocks = useMemo(
    () => activeAvailability.filter((block) => block.weekday === selectedWeekday),
    [activeAvailability, selectedWeekday],
  );

  const bookedDateObjects = useMemo(
    () => bookedDates.map(parseDateKey),
    [bookedDates],
  );

  return (
    <div className="grid gap-5 md:grid-cols-[auto_1fr]">
      <Calendar
        mode="single"
        selected={parseDateKey(selectedDateKey)}
        onSelect={(date) => {
          if (date) setSelectedDateKey(toDateKey(date));
        }}
        modifiers={{ booked: bookedDateObjects }}
        components={{
          DayButton: ({ className, ...props }) => (
            <CalendarDayButton
              className={cn(
                props.modifiers.booked &&
                  "font-bold text-emerald-700 data-[selected-single=true]:bg-emerald-600",
                className,
              )}
              {...props}
            />
          ),
        }}
        className="rounded-md border bg-white"
      />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardDescription>{weekdays[selectedWeekday]}</CardDescription>
              <CardTitle className="text-xl">{selectedDateLabel}</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setSelectedDateKey((key) => shiftDateKey(key, -1))}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev day
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setSelectedDateKey(toDateKey(new Date()))}
              >
                Today
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setSelectedDateKey((key) => shiftDateKey(key, 1))}
              >
                Next day
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-sm bg-emerald-600" />
              Booked
            </span>
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-sm border border-slate-300 bg-white" />
              Open
            </span>
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {dayBlocks.length > 0 ? (
            dayBlocks.map((block) => {
              const slots = buildDateSlots(selectedDateKey, block, appointments);

              return (
                <div key={block.id} className="rounded-md border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
                    <span>
                      {block.start_time.slice(0, 5)}-{block.end_time.slice(0, 5)} ·{" "}
                      {block.slot_minutes} min slots
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {block.location || "Location not set"}
                    </span>
                  </div>
                  {slots.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {slots.map((slot) => (
                        <span
                          key={slot.time}
                          title={slot.booked ? `Booked - ${slot.patientName}` : "Open"}
                          className={cn(
                            "rounded-md border px-3 py-1.5 text-sm font-medium",
                            slot.booked
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-200 bg-white text-slate-600",
                          )}
                        >
                          {slot.time}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">
                      This block does not produce any slots yet.
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-10 text-center text-slate-500">
              <Clock className="mx-auto mb-3 h-9 w-9" />
              No availability configured for {weekdays[selectedWeekday]}s.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorScheduleLookup;
