import {
  logInboundVoiceCall,
  parseTwilioForm,
  receptionistGatherResponse,
  voiceResponse,
} from "@/lib/communications/twilio";

export async function POST(request: Request) {
  try {
    const { from, callSid, callStatus } = await parseTwilioForm(request);

    if (from || callSid) {
      await logInboundVoiceCall({ from, callSid, callStatus });
    }

    const actionUrl = new URL("/api/twilio/voice/intake", request.url);

    return receptionistGatherResponse(actionUrl.toString());
  } catch (error) {
    console.error("Twilio voice inbound webhook failed", error);

    return voiceResponse(
      "Hello, this is MediDove Clinic. We could not connect the AI receptionist right now. Please try again later, or contact emergency services for urgent symptoms.",
    );
  }
}
