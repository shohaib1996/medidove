import {
  logInboundVoiceCall,
  parseTwilioForm,
  voiceResponse,
} from "@/lib/communications/twilio";

export async function POST(request: Request) {
  try {
    const { from, callSid, callStatus } = await parseTwilioForm(request);

    if (from || callSid) {
      await logInboundVoiceCall({ from, callSid, callStatus });
    }

    return voiceResponse(
      "Hello, this is MediDove Clinic. You are speaking with an AI-assisted phone workflow demo. Your call has been logged for the reception team. If this is urgent, please contact emergency services.",
    );
  } catch (error) {
    console.error("Twilio voice inbound webhook failed", error);

    return voiceResponse(
      "Hello, this is MediDove Clinic. We could not connect the AI receptionist right now. Please try again later, or contact emergency services for urgent symptoms.",
    );
  }
}
