import {
  logInboundWhatsApp,
  messagingResponse,
  parseTwilioForm,
} from "@/lib/communications/twilio";

export async function POST(request: Request) {
  try {
    const { from, body, messageSid } = await parseTwilioForm(request);

    if (from) {
      await logInboundWhatsApp({ from, body, messageSid });
    }

    return messagingResponse(
      "Thanks for messaging MediDove Clinic. Our AI assistant has received your message and a care coordinator can review it. For urgent symptoms, contact emergency services.",
    );
  } catch (error) {
    console.error("Twilio WhatsApp inbound webhook failed", error);

    return messagingResponse(
      "MediDove received your message, but our system could not log it right now. Please call the clinic if this is urgent.",
    );
  }
}
