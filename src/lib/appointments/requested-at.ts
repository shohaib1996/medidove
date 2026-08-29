export const toDateTimeInputs = (value: string | null) => {
  if (!value) {
    return { date: "", time: "" };
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return { date: "", time: "" };
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
  const time = `${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;

  return { date, time };
};

export const getRequestedAt = (date: string, time: string) => {
  if (!date) {
    return null;
  }

  const timestamp = time ? `${date}T${time}:00` : `${date}T09:00:00`;
  const parsed = new Date(timestamp);

  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};
