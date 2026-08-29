export const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export type SlotCell = {
  time: string;
  booked: boolean;
  patientName: string | null;
  status: string | null;
};

const toMinutes = (time: string) => {
  const [hours, minutes] = time.slice(0, 5).split(":").map(Number);
  return hours * 60 + minutes;
};

const toTimeLabel = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export type AppointmentLike = {
  requested_at: string | null;
  patient_name: string;
  status: string;
};

export const toDateKey = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const isRelevant = (appointment: AppointmentLike) =>
  Boolean(appointment.requested_at) &&
  appointment.status !== "cancelled" &&
  appointment.status !== "completed";

const buildSlotsFromMatches = (
  block: { start_time: string; end_time: string; slot_minutes: number },
  relevantAppointments: AppointmentLike[],
): SlotCell[] => {
  const start = toMinutes(block.start_time);
  const end = toMinutes(block.end_time);
  const slots: SlotCell[] = [];

  for (let minute = start; minute < end; minute += block.slot_minutes) {
    const match = relevantAppointments.find((appointment) => {
      const date = new Date(appointment.requested_at as string);
      const appointmentMinutes = date.getHours() * 60 + date.getMinutes();
      return (
        appointmentMinutes >= minute && appointmentMinutes < minute + block.slot_minutes
      );
    });

    slots.push({
      time: toTimeLabel(minute),
      booked: Boolean(match),
      patientName: match?.patient_name ?? null,
      status: match?.status ?? null,
    });
  }

  return slots;
};

/** Slots for a specific calendar date, matched against real appointment dates. */
export const buildDateSlots = (
  dateKey: string,
  block: { start_time: string; end_time: string; slot_minutes: number },
  appointments: AppointmentLike[],
): SlotCell[] => {
  const relevantAppointments = appointments.filter(
    (appointment) =>
      isRelevant(appointment) &&
      toDateKey(new Date(appointment.requested_at as string)) === dateKey,
  );

  return buildSlotsFromMatches(block, relevantAppointments);
};

export const formatDate = (value: string | null) => {
  if (!value) {
    return "Not selected";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};
