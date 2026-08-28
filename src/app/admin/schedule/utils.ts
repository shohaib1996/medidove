import type { Doctor } from "./types";

export const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const formatDate = (value: string | null) => {
  if (!value) {
    return "Not selected";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export const doctorName = (doctors: Doctor[], id: string) =>
  doctors.find((doctor) => doctor.id === id)?.full_name || "Unknown doctor";
