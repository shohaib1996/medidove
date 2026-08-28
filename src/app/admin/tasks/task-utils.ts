export const filters: import("./types").TaskFilter[] = ["all", "open", "in_progress", "done", "cancelled"];
export const priorities = ["low", "medium", "high", "urgent"];
export const sourceTypes = [
  "manual",
  "appointment",
  "lead",
  "feedback",
  "clinical_note",
  "automation",
];

export const formatDate = (value: string | null) => {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export const normalizeFilter = (value: string | string[] | undefined): import("./types").TaskFilter => {
  const filter = Array.isArray(value) ? value[0] : value;

  return filters.includes(filter as import("./types").TaskFilter) ? (filter as import("./types").TaskFilter) : "all";
};

export const profileLabel = (profiles: import("./types").ProfileOption[], id: string | null) => {
  if (!id) {
    return "Unassigned";
  }

  const profile = profiles.find((item) => item.id === id);

  return profile?.full_name || profile?.phone || profile?.role || "Unknown user";
};
