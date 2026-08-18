import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type AppointmentRequest = {
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  requestedDepartment?: string;
  requestedDoctor?: string;
  requestedDate?: string;
  requestedTime?: string;
  reason?: string;
  aiSummary?: string;
  urgency?: string;
  consentAccepted?: boolean;
};

const cleanText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const isEmail = (value: string) =>
  value.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const getRequestedAt = (date: string, time: string) => {
  if (!date) {
    return null;
  }

  const timestamp = time ? `${date}T${time}:00` : `${date}T09:00:00`;
  const parsed = new Date(timestamp);

  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

export async function POST(request: Request) {
  let body: AppointmentRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const patientName = cleanText(body.patientName);
  const patientEmail = cleanText(body.patientEmail);
  const patientPhone = cleanText(body.patientPhone);
  const requestedDepartment = cleanText(body.requestedDepartment);
  const requestedDoctor = cleanText(body.requestedDoctor);
  const requestedDate = cleanText(body.requestedDate);
  const requestedTime = cleanText(body.requestedTime);
  const reason = cleanText(body.reason);
  const aiSummary = cleanText(body.aiSummary);
  const urgency = cleanText(body.urgency);

  if (!patientName || !patientPhone || !reason) {
    return NextResponse.json(
      { error: "Name, phone, and appointment reason are required." },
      { status: 400 },
    );
  }

  if (!isEmail(patientEmail)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  if (!body.consentAccepted) {
    return NextResponse.json(
      { error: "Consent is required before submitting an appointment." },
      { status: 400 },
    );
  }

  const requestedAt = getRequestedAt(requestedDate, requestedTime);
  const userClient = await createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      patient_id: user?.id || null,
      patient_name: patientName,
      patient_email: patientEmail || user?.email || null,
      patient_phone: patientPhone,
      requested_department: requestedDepartment || null,
      requested_doctor: requestedDoctor || null,
      requested_at: requestedAt,
      reason,
      ai_summary: aiSummary || null,
      urgency: urgency || null,
      status: "pending",
      source_channel: "website",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Appointment create failed:", error);

    return NextResponse.json(
      { error: "Unable to create appointment request." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    appointmentId: data.id,
    message: "Appointment request submitted successfully.",
  });
}
