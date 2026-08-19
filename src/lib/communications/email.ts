import nodemailer from "nodemailer";

type EmailDeliveryInput = {
  to: string | null;
  subject: string | null;
  message: string;
};

export type EmailDeliveryResult = {
  ok: boolean;
  provider: "smtp";
  providerMessageId?: string;
  error?: string;
};

const optionalEnv = (key: string) => process.env[key]?.trim() || "";

const getSmtpPort = () => {
  const port = Number(optionalEnv("SMTP_PORT") || "587");

  return Number.isFinite(port) ? port : 587;
};

export const sendSmtpEmail = async ({
  to,
  subject,
  message,
}: EmailDeliveryInput): Promise<EmailDeliveryResult> => {
  const host = optionalEnv("SMTP_HOST");
  const user = optionalEnv("SMTP_USER");
  const pass = optionalEnv("SMTP_PASSWORD");
  const from = optionalEnv("SMTP_FROM_EMAIL") || user;
  const port = getSmtpPort();

  if (!host || !user || !pass || !from) {
    return {
      ok: false,
      provider: "smtp",
      error:
        "Missing SMTP_HOST, SMTP_USER, SMTP_PASSWORD, or SMTP_FROM_EMAIL.",
    };
  }

  if (!to) {
    return {
      ok: false,
      provider: "smtp",
      error: "Recipient email is required.",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const result = await transporter.sendMail({
      from,
      to,
      subject: subject || "MediDove Clinic",
      text: message,
    });

    return {
      ok: true,
      provider: "smtp",
      providerMessageId: result.messageId,
    };
  } catch (error) {
    return {
      ok: false,
      provider: "smtp",
      error: error instanceof Error ? error.message : "SMTP delivery failed.",
    };
  }
};

