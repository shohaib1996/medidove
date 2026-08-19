type IntegrationStatus = {
  name: string;
  category: string;
  configured: boolean;
  optional: boolean;
  requiredKeys: string[];
  missingKeys: string[];
  workflow: string;
  href: string;
};

const hasEnv = (key: string) => Boolean(process.env[key]?.trim());

const integrationDefinitions = [
  {
    name: "Supabase",
    category: "Database and auth",
    requiredKeys: [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
    ],
    workflow: "Auth, admin data, patient records, automation storage",
    href: "/admin",
  },
  {
    name: "ElevenLabs Conversational AI",
    category: "Voice receptionist",
    requiredKeys: ["ELEVENLABS_API_KEY", "NEXT_PUBLIC_ELEVENLABS_AGENT_ID"],
    workflow: "Browser voice receptionist session",
    href: "/receptionist",
  },
  {
    name: "OpenAI Responses API",
    category: "AI assistant",
    requiredKeys: ["OPENAI_API_KEY"],
    workflow: "LLM answers for the website clinic assistant",
    href: "/",
  },
  {
    name: "ElevenLabs Outbound Webhook",
    category: "Optional voice calls",
    optional: true,
    requiredKeys: ["ELEVENLABS_OUTBOUND_CALL_WEBHOOK_URL"],
    workflow: "Fallback outbound call dispatch from communication outbox",
    href: "/admin/outreach",
  },
  {
    name: "Twilio SMS",
    category: "Optional messaging fallback",
    optional: true,
    requiredKeys: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_PHONE"],
    workflow: "Fallback SMS outreach delivery",
    href: "/admin/outreach",
  },
  {
    name: "Meta WhatsApp Cloud API",
    category: "Optional patient messaging",
    optional: true,
    requiredKeys: [
      "META_WHATSAPP_ACCESS_TOKEN",
      "META_WHATSAPP_PHONE_NUMBER_ID",
      "META_WHATSAPP_VERIFY_TOKEN",
    ],
    workflow: "WhatsApp reminders and follow-up delivery",
    href: "/engagement",
  },
  {
    name: "Twilio WhatsApp",
    category: "Optional messaging fallback",
    optional: true,
    requiredKeys: [
      "TWILIO_ACCOUNT_SID",
      "TWILIO_AUTH_TOKEN",
      "TWILIO_WHATSAPP_FROM",
    ],
    workflow: "Fallback WhatsApp reminders and follow-up delivery",
    href: "/engagement",
  },
  {
    name: "SMTP Email",
    category: "Email delivery",
    requiredKeys: ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM_EMAIL"],
    workflow: "Email outreach delivery through Nodemailer SMTP",
    href: "/admin/outreach",
  },
  {
    name: "Email Webhook",
    category: "Optional email fallback",
    optional: true,
    requiredKeys: ["EMAIL_DELIVERY_WEBHOOK_URL"],
    workflow: "Fallback email outreach dispatch",
    href: "/admin/outreach",
  },
  {
    name: "Automation Runner",
    category: "Background jobs",
    requiredKeys: ["AUTOMATION_RUN_SECRET"],
    workflow: "Protected cron endpoint for automation rules",
    href: "/admin/automations",
  },
  {
    name: "Outbox Dispatch",
    category: "Background jobs",
    requiredKeys: ["OUTBOX_DISPATCH_SECRET"],
    workflow: "Protected cron endpoint for provider delivery",
    href: "/admin/outreach",
  },
  {
    name: "Task Generation",
    category: "Background jobs",
    requiredKeys: ["TASK_GENERATION_SECRET"],
    workflow: "Protected cron endpoint for AI-generated care tasks",
    href: "/admin/tasks",
  },
];

export const getIntegrationStatuses = (): IntegrationStatus[] =>
  integrationDefinitions.map((integration) => {
    const missingKeys = integration.requiredKeys.filter((key) => !hasEnv(key));

    return {
      optional: false,
      ...integration,
      configured: missingKeys.length === 0,
      missingKeys,
    };
  });
