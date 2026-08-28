import type { AvailabilityOption } from "@/lib/clinic/content";
import type { SlotTime } from "./types";

export const getSelectedDateWeekday = (requestedDate: string) => {
  if (!requestedDate) {
    return null;
  }

  const date = new Date(`${requestedDate}T00:00:00`);

  return Number.isNaN(date.getTime()) ? null : date.getDay();
};

export const getMatchingAvailability = ({
  availability,
  doctorId,
  weekday,
}: {
  availability: AvailabilityOption[];
  doctorId: string;
  weekday: number | null;
}) =>
  availability.filter((block) => {
    const matchesDoctor = !doctorId || block.doctorId === doctorId;
    const matchesDate = weekday === null || block.weekday === weekday;

    return matchesDoctor && matchesDate;
  });

export const getSlotTimes = (
  matchingAvailability: AvailabilityOption[],
): SlotTime[] => {
  const slots: SlotTime[] = [];

  matchingAvailability.forEach((block) => {
    const [startHour, startMinute] = block.startTime.split(":").map(Number);
    const [endHour, endMinute] = block.endTime.split(":").map(Number);
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    for (let minute = start; minute < end; minute += block.slotMinutes) {
      const hour = Math.floor(minute / 60).toString().padStart(2, "0");
      const minutes = (minute % 60).toString().padStart(2, "0");
      const value = `${hour}:${minutes}`;

      slots.push({
        label: `${block.doctorName} - ${value}`,
        value,
        location: block.location,
      });
    }
  });

  return slots.slice(0, 8);
};
