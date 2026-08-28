export const triggerOptions = [
  "appointment_created",
  "appointment_confirmed",
  "appointment_reminder",
  "missed_appointment",
  "lead_created",
  "lead_high_urgency",
  "recall_due",
  "post_visit_follow_up",
];

export const audienceOptions = [
  "all_patients",
  "new_patients",
  "confirmed_appointments",
  "missed_appointments",
  "high_urgency_leads",
  "inactive_patients",
];

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export const formatDelay = (minutes: number) => {
  if (minutes === 0) {
    return "Immediate";
  }

  if (minutes < 60) {
    return `${minutes} min delay`;
  }

  if (minutes % 1440 === 0) {
    return `${minutes / 1440} day delay`;
  }

  if (minutes % 60 === 0) {
    return `${minutes / 60} hour delay`;
  }

  return `${minutes} min delay`;
};
