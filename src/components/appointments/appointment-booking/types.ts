import type { AvailabilityOption, BookingOption } from "@/lib/clinic/content";

export type AppointmentBookingOptions = {
  departments: BookingOption[];
  doctors: BookingOption[];
  availability: AvailabilityOption[];
};

export type AppointmentForm = {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  requestedDepartment: string;
  requestedDoctor: string;
  doctorId: string;
  requestedDate: string;
  requestedTime: string;
  reason: string;
  consentAccepted: boolean;
};

export type IntakeResult = {
  suggestedDepartment: string;
  suggestedDoctor: string;
  urgency: "low" | "medium" | "high" | "urgent";
  summary: string;
  adminNote: string;
  safetyMessage: string | null;
  matchedSignals: string[];
  provider?: "rules" | "openai";
  model?: string;
};

export type SlotTime = {
  label: string;
  value: string;
  location: string | null;
};

export type AppointmentFieldUpdater = <Key extends keyof AppointmentForm>(
  key: Key,
  value: AppointmentForm[Key],
) => void;
