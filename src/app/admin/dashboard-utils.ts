export const formatDate = (value: string | null) => {
  if (!value) {
    return "Not selected";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export const getTodayCount = (items: { created_at: string }[]) => {
  const today = new Date().toDateString();

  return items.filter((item) => new Date(item.created_at).toDateString() === today)
    .length;
};
