import { NextResponse } from "next/server";
import { writeAuditLog } from "@/lib/audit/log";
import { createAdminClient } from "@/lib/supabase/admin";

type MetaWebhookPayload = {
  entry?: {
    changes?: {
      value?: {
        messages?: {
          from?: string;
          id?: string;
          text?: { body?: string };
          type?: string;
        }[];
        statuses?: {
          id?: string;
          status?: string;
          recipient_id?: string;
        }[];
      };
    }[];
  }[];
};

const optionalEnv = (key: string) => process.env[key]?.trim() || "";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token &&
    token === optionalEnv("META_WHATSAPP_VERIFY_TOKEN") &&
    challenge
  ) {
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json(
    { error: "Meta WhatsApp webhook verification failed." },
    { status: 403 },
  );
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as
    | MetaWebhookPayload
    | null;

  if (!payload) {
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }

  const supabase = createAdminClient();

  for (const entry of payload.entry || []) {
    for (const change of entry.changes || []) {
      const value = change.value;

      for (const message of value?.messages || []) {
        const phone = message.from || "";
        const body =
          message.text?.body || `Inbound WhatsApp ${message.type || "message"}.`;

        if (!phone) {
          continue;
        }

        const { data, error } = await supabase
          .from("whatsapp_messages")
          .insert({
            phone_number: phone,
            direction: "inbound",
            message: body,
            provider_message_id: message.id || null,
            status: "received",
          })
          .select("id")
          .single();

        if (!error) {
          await writeAuditLog(supabase, {
            actorType: "system",
            eventType: "meta_whatsapp_inbound",
            entityType: "whatsapp_messages",
            entityId: data.id,
            summary: `Received WhatsApp message from ${phone}.`,
            metadata: {
              provider_message_id: message.id,
              phone,
              message_type: message.type,
            },
          });
        }
      }

      for (const status of value?.statuses || []) {
        if (!status.id || !status.status) {
          continue;
        }

        await supabase
          .from("whatsapp_messages")
          .update({ status: status.status })
          .eq("provider_message_id", status.id);

        await writeAuditLog(supabase, {
          actorType: "system",
          eventType: "meta_whatsapp_status",
          entityType: "whatsapp_messages",
          summary: `WhatsApp message ${status.id} marked ${status.status}.`,
          metadata: {
            provider_message_id: status.id,
            recipient_id: status.recipient_id,
            status: status.status,
          },
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}

