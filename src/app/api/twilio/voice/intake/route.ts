import {
  logVoiceReceptionistIntake,
  parseTwilioForm,
  voiceResponse,
} from "@/lib/communications/twilio";

const getConfirmationMessage = (digits: string, speechResult: string) => {
  const speech = speechResult.toLowerCase();

  if (digits === "1" || speech.includes("appointment") || speech.includes("book")) {
    return "Thank you. I captured your appointment request for the MediDove reception team. A staff member can review it and follow up.";
  }

  if (digits === "2" || speech.includes("callback") || speech.includes("call back")) {
    return "Thank you. I captured your callback request for the MediDove reception team.";
  }

  if (digits === "3" || speech.includes("message")) {
    return "Thank you. I captured your message for the MediDove clinic team.";
  }

  return "Thank you. I captured your request for the MediDove reception team.";
};

export async function POST(request: Request) {
  try {
    const { from, callSid, callStatus, digits, speechResult } =
      await parseTwilioForm(request);

    await logVoiceReceptionistIntake({
      from,
      callSid,
      callStatus,
      digits,
      speechResult,
    });

    return voiceResponse(getConfirmationMessage(digits, speechResult));
  } catch (error) {
    console.error("Twilio voice intake webhook failed", error);

    return voiceResponse(
      "We could not save your request right now. Please call again later, or contact emergency services for urgent symptoms.",
    );
  }
}
