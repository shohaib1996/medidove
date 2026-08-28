import { writeAuditLog } from "@/lib/audit/log";
import { createAdminClient } from "@/lib/supabase/admin";
import { getLatestConsent } from "./dispatch/consent";
import { deliverRecord } from "./dispatch/delivery";
import { getProvider, metadataObject } from "./dispatch/providers";
import type { OutboxRecord } from "./dispatch/types";

export type { ConsentResult, DeliveryResult, OutboxRecord } from "./dispatch/types";

export const dispatchQueuedOutbox = async (limit = 20) => {
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("communication_outbox")
    .select(
      "id, patient_id, channel, recipient_name, recipient_phone, recipient_email, subject, message, provider, metadata, scheduled_for",
    )
    .eq("status", "queued")
    .or(`scheduled_for.is.null,scheduled_for.lte.${now}`)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  const records = (data || []) as OutboxRecord[];
  let sent = 0;
  let failed = 0;
  let blocked = 0;
  const results = [];

  for (const record of records) {
    const deliveredAt = new Date().toISOString();
    const consent = await getLatestConsent(record);

    if (!consent.consented) {
      const metadata = {
        ...metadataObject(record.metadata),
        consent_required: true,
        consent_block_reason: consent.reason,
        blocked_at: deliveredAt,
      };

      const { error: updateError } = await supabase
        .from("communication_outbox")
        .update({
          status: "blocked",
          updated_at: deliveredAt,
          metadata,
        })
        .eq("id", record.id);

      blocked += 1;
      results.push({
        id: record.id,
        channel: record.channel,
        ok: false,
        provider: getProvider(record.channel, record.provider),
        error: updateError?.message || consent.reason,
      });

      await writeAuditLog(supabase, {
        actorType: "system",
        eventType: "outbox_dispatch_blocked",
        entityType: "communication_outbox",
        entityId: record.id,
        summary: `Blocked ${record.channel} outreach because consent was not active.`,
        metadata: {
          channel: record.channel,
          reason: updateError?.message || consent.reason,
        },
      });

      continue;
    }

    const result = await deliverRecord(record);
    const metadata = {
      ...metadataObject(record.metadata),
      consent_required: true,
      consent_verified: true,
      delivery_provider: result.provider,
      delivery_error: result.error || null,
      dispatched_at: deliveredAt,
    };

    const { error: updateError } = await supabase
      .from("communication_outbox")
      .update({
        status: result.ok ? "sent" : "failed",
        provider: result.provider,
        provider_message_id: result.providerMessageId || null,
        sent_at: result.ok ? deliveredAt : null,
        updated_at: deliveredAt,
        metadata,
      })
      .eq("id", record.id);

    if (updateError || !result.ok) {
      failed += 1;
    } else {
      sent += 1;
    }

    results.push({
      id: record.id,
      channel: record.channel,
      ok: result.ok && !updateError,
      provider: result.provider,
      error: updateError?.message || result.error || null,
    });
  }

  const summary = {
    ok: true,
    scanned: records.length,
    sent,
    failed,
    blocked,
    results,
  };

  await writeAuditLog(supabase, {
    actorType: "system",
    eventType: "outbox_dispatch_executed",
    entityType: "communication_outbox",
    summary: `Outbox dispatch scanned ${summary.scanned} records, sent ${summary.sent}, failed ${summary.failed}, and blocked ${summary.blocked}.`,
    metadata: summary,
  });

  return summary;
};
