import type { Channel, Json } from "@/lib/supabase/database.types";

export const optionalEnv = (key: string) => process.env[key]?.trim() || "";

export const getMessagingProvider = (provider: string | null) =>
  provider || optionalEnv("OUTBOUND_MESSAGING_PROVIDER") || "disabled";

export const getEmailProvider = (provider: string | null) =>
  provider || optionalEnv("OUTBOUND_EMAIL_PROVIDER") || "smtp";

export const getProvider = (channel: Channel, provider: string | null) => {
  if (provider) {
    return provider;
  }

  if (channel === "voice") {
    return "elevenlabs";
  }

  if (channel === "sms" || channel === "whatsapp") {
    return getMessagingProvider(provider);
  }

  return getEmailProvider(provider);
};

export const metadataObject = (metadata: Json) =>
  metadata && typeof metadata === "object" && !Array.isArray(metadata)
    ? metadata
    : {};
