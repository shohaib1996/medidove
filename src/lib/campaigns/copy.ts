type CampaignCopyInput = {
  name: string;
  campaignType: string;
  audience: string;
  channel: string;
  goal: string;
};

const normalize = (value: string) => value.trim();

const channelIntro: Record<string, string> = {
  whatsapp: "Hi {{patient_name}}, this is MediDove Clinic.",
  sms: "MediDove Clinic:",
  email: "Hello {{patient_name}},",
  voice: "Hello {{patient_name}}, this is the MediDove Clinic AI receptionist calling.",
};

const campaignPrompts: Record<string, string> = {
  appointment_reminder:
    "We are reminding you about your upcoming care plan and helping you confirm the next appointment step.",
  missed_appointment:
    "We noticed you missed a recent appointment and can help you reschedule at a convenient time.",
  feedback_request:
    "We would appreciate your feedback about your recent visit so our team can improve the patient experience.",
  wellness_check:
    "We are checking in to see whether you would like support scheduling a routine wellness visit.",
  screening_campaign:
    "We are sharing an opt-in preventive screening reminder that may be useful for your care needs.",
};

export const generateCampaignCopy = ({
  campaignType,
  audience,
  channel,
  goal,
}: CampaignCopyInput) => {
  const intro = channelIntro[channel] || channelIntro.whatsapp;
  const prompt =
    campaignPrompts[campaignType] ||
    "We are reaching out with a clinic care update.";
  const cleanGoal = normalize(goal);
  const cleanAudience = normalize(audience);

  const action =
    channel === "voice"
      ? "You can say confirm, reschedule, or request a callback."
      : "Reply CONFIRM to confirm, HELP for staff support, or STOP to opt out.";

  return [
    intro,
    prompt,
    cleanGoal ? `Goal: ${cleanGoal}` : null,
    cleanAudience ? `Audience: ${cleanAudience}.` : null,
    action,
    "This is not medical advice. For urgent symptoms, please contact emergency services.",
  ]
    .filter(Boolean)
    .join(" ");
};

export const getCampaignRecommendation = (campaignType: string) => {
  if (campaignType === "missed_appointment") {
    return "Prioritize WhatsApp or voice for faster recovery, but send only to patients with matching consent.";
  }

  if (campaignType === "feedback_request") {
    return "Use WhatsApp or SMS for short feedback requests and keep the message low-friction.";
  }

  if (campaignType === "screening_campaign") {
    return "Use approved templates and avoid disease-risk claims unless a clinician has reviewed the copy.";
  }

  return "Keep the copy short, include opt-out language, and dispatch only after consent validation.";
};
