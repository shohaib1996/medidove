import { NextResponse } from "next/server";

const ELEVENLABS_SIGNED_URL_ENDPOINT =
  "https://api.elevenlabs.io/v1/convai/conversation/get-signed-url";

export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  if (!apiKey || !agentId) {
    return NextResponse.json(
      { error: "ElevenLabs voice receptionist is not configured." },
      { status: 503 },
    );
  }

  const response = await fetch(
    `${ELEVENLABS_SIGNED_URL_ENDPOINT}?agent_id=${encodeURIComponent(agentId)}`,
    {
      headers: {
        "xi-api-key": apiKey,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Could not start the voice receptionist." },
      { status: 502 },
    );
  }

  const data = (await response.json()) as { signed_url?: string };

  if (!data.signed_url) {
    return NextResponse.json(
      { error: "ElevenLabs did not return a signed URL." },
      { status: 502 },
    );
  }

  return NextResponse.json({ signedUrl: data.signed_url });
}
