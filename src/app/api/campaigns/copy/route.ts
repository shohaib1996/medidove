import { NextResponse } from "next/server";
import { generateOpenAIText } from "@/lib/ai/openai";
import {
  generateCampaignCopy,
  getCampaignRecommendation,
} from "@/lib/campaigns/copy";
import { createClient } from "@/lib/supabase/server";

const campaignTypes = [
  "appointment_reminder",
  "missed_appointment",
  "feedback_request",
  "wellness_check",
  "screening_campaign",
] as const;
const channels = ["email", "sms", "whatsapp", "voice"] as const;
const audiences = [
  "recent_appointments",
  "missed_appointments",
  "feedback_needed",
  "whatsapp_opt_ins",
  "all_patients",
] as const;

type CampaignCopyRequest = {
  name?: string;
  campaignType?: string;
  audience?: string;
  channel?: string;
  goal?: string;
};

type CampaignCopyResponse = {
  message?: string;
  recommendation?: string;
};

const cleanText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const assertAdmin = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin";
};

const parseCopy = (
  text: string,
  fallbackMessage: string,
  fallbackRecommendation: string,
): CampaignCopyResponse | null => {
  try {
    const jsonText = text.match(/\{[\s\S]*\}/)?.[0] || text;
    const parsed = JSON.parse(jsonText) as CampaignCopyResponse;
    const message = cleanText(parsed.message);
    const recommendation = cleanText(parsed.recommendation);

    return {
      message: message || fallbackMessage,
      recommendation: recommendation || fallbackRecommendation,
    };
  } catch (error) {
    console.error("OpenAI campaign copy parse failed:", error);
    return null;
  }
};

export async function POST(request: Request) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as
    | CampaignCopyRequest
    | null;
  const name = cleanText(body?.name) || "Patient engagement campaign";
  const campaignType = cleanText(body?.campaignType);
  const audience = cleanText(body?.audience);
  const channel = cleanText(body?.channel);
  const goal = cleanText(body?.goal);

  if (!campaignTypes.includes(campaignType as (typeof campaignTypes)[number])) {
    return NextResponse.json(
      { error: "Choose a valid campaign type." },
      { status: 400 },
    );
  }

  if (!audiences.includes(audience as (typeof audiences)[number])) {
    return NextResponse.json(
      { error: "Choose a valid audience." },
      { status: 400 },
    );
  }

  if (!channels.includes(channel as (typeof channels)[number])) {
    return NextResponse.json(
      { error: "Choose a valid channel." },
      { status: 400 },
    );
  }

  const fallbackMessage = generateCampaignCopy({
    name,
    campaignType,
    audience,
    channel,
    goal,
  });
  const fallbackRecommendation = getCampaignRecommendation(campaignType);
  const result = await generateOpenAIText({
    instructions: [
      "You write consent-first patient engagement campaign copy for MediDove Clinic.",
      "Do not create diagnosis claims, disease-risk claims, treatment instructions, or cold marketing copy.",
      "The copy must be useful for opted-in patients and include an opt-out or staff-support path where appropriate.",
      "Voice scripts should sound natural when read aloud. SMS and WhatsApp should be short. Email can be warmer but concise.",
      "Always include emergency safety language when the campaign could be confused with medical advice.",
    ].join("\n"),
    input: [
      `Campaign name: ${name}`,
      `Campaign type: ${campaignType}`,
      `Audience: ${audience}`,
      `Channel: ${channel}`,
      `Goal: ${goal || "Not specified"}`,
      "",
      "Fallback draft:",
      fallbackMessage,
      "",
      "Return a JSON object with message and recommendation.",
    ].join("\n"),
    metadata: {
      feature: "campaign_copy",
      campaign_type: campaignType,
      channel,
    },
    textFormat: {
      type: "json_schema",
      name: "campaign_copy",
      strict: true,
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          message: { type: "string" },
          recommendation: { type: "string" },
        },
        required: ["message", "recommendation"],
      },
    },
  });

  if (!result.ok) {
    return NextResponse.json({
      message: fallbackMessage,
      recommendation: fallbackRecommendation,
      provider: "rules",
    });
  }

  const parsed = parseCopy(result.text, fallbackMessage, fallbackRecommendation);

  return NextResponse.json({
    ...(parsed || {
      message: fallbackMessage,
      recommendation: fallbackRecommendation,
    }),
    provider: parsed ? "openai" : "rules",
    model: parsed ? result.model : undefined,
  });
}
