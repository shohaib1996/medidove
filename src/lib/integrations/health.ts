type IntegrationStatus = {
  name: string;
  category: string;
  configured: boolean;
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
    category: "AI voice calls",
    requiredKeys: ["ELEVENLABS_OUTBOUND_CALL_WEBHOOK_URL"],
    workflow: "Outbound call dispatch from communication outbox",
    href: "/admin/outreach",
  },
  {
    name: "Twilio SMS",
    category: "Patient messaging",
    requiredKeys: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_PHONE"],
    workflow: "SMS outreach delivery",
    href: "/admin/outreach",
  },
  {
    name: "Twilio WhatsApp",
    category: "Patient messaging",
    requiredKeys: [
      "TWILIO_ACCOUNT_SID",
      "TWILIO_AUTH_TOKEN",
      "TWILIO_WHATSAPP_FROM",
    ],
    workflow: "WhatsApp reminders and follow-up delivery",
    href: "/engagement",
  },
  {
    name: "Email Webhook",
    category: "Email delivery",
    requiredKeys: ["EMAIL_DELIVERY_WEBHOOK_URL"],
    workflow: "Email outreach dispatch",
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
      ...integration,
      configured: missingKeys.length === 0,
      missingKeys,
    };
  });
