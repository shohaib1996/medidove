const DEFAULT_COUNTRY_CODE = "880";

export const normalizePhone = (value: string | null | undefined): string => {
  if (!value) return "";

  const digits = value.trim().replace(/[^\d+]/g, "");
  if (!digits) return "";

  if (digits.startsWith("+")) {
    return digits;
  }

  if (digits.startsWith(DEFAULT_COUNTRY_CODE)) {
    return `+${digits}`;
  }

  if (digits.startsWith("0")) {
    return `+${DEFAULT_COUNTRY_CODE}${digits.slice(1)}`;
  }

  return `+${digits}`;
};

export const phonesMatch = (
  a: string | null | undefined,
  b: string | null | undefined,
) => {
  const normalizedA = normalizePhone(a);
  const normalizedB = normalizePhone(b);

  return Boolean(normalizedA) && normalizedA === normalizedB;
};
