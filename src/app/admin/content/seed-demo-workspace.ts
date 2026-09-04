"use server";

import { assertAdmin, refreshContent } from "./action-utils";
import { demoAvailability, demoDepartments, demoDoctors, demoKnowledge, demoServices, demoTemplates } from "./demo-data";
import { seedAiLeadIfMissing, seedBlogPosts, seedCampaignIfMissing, seedClinicSettings, seedConsentIfMissing, seedFeedbackIfMissing, seedHealthPackages, seedLeadIfMissing, seedOptOutIfMissing, seedProducts, seedStaffMembers, seedTestimonials } from "./demo-seeders";

export const seedDemoWorkspace = async () => {
  const supabase = await assertAdmin();
  await seedClinicSettings(supabase);
  await seedStaffMembers(supabase);
  await seedBlogPosts(supabase);
  await seedHealthPackages(supabase);
  await seedProducts(supabase);
  await seedTestimonials(supabase);

  await supabase.from("departments").upsert(
    demoDepartments.map((department) => ({
      ...department,
      is_active: true,
    })),
    { onConflict: "slug" },
  );

  const { data: departments } = await supabase
    .from("departments")
    .select("id, slug")
    .in(
      "slug",
      demoDepartments.map((department) => department.slug),
    );

  const departmentBySlug = new Map(
    (departments || []).map((department) => [department.slug, department.id]),
  );

  await supabase.from("services").upsert(
    demoServices.map((service) => ({
      department_id: departmentBySlug.get(service.departmentSlug) || null,
      title: service.title,
      slug: service.slug,
      summary: service.summary,
      description: service.description,
      is_active: true,
    })),
    { onConflict: "slug" },
  );

  await supabase.from("doctors").upsert(
    demoDoctors.map((doctor) => ({
      department_id: departmentBySlug.get(doctor.departmentSlug) || null,
      full_name: doctor.fullName,
      slug: doctor.slug,
      specialty: doctor.specialty,
      bio: doctor.bio,
      image_url: doctor.imageUrl,
      is_active: true,
    })),
    { onConflict: "slug" },
  );

  const { data: doctors } = await supabase
    .from("doctors")
    .select("id, slug")
    .in(
      "slug",
      demoDoctors.map((doctor) => doctor.slug),
    );

  const doctorBySlug = new Map(
    (doctors || []).map((doctor) => [doctor.slug, doctor.id]),
  );

  for (const block of demoAvailability) {
    const doctorId = doctorBySlug.get(block.doctorSlug);

    if (!doctorId) {
      continue;
    }

    const { data: existing } = await supabase
      .from("doctor_availability")
      .select("id")
      .eq("doctor_id", doctorId)
      .eq("weekday", block.weekday)
      .eq("start_time", block.start_time)
      .maybeSingle();

    if (!existing) {
      await supabase.from("doctor_availability").insert({
        doctor_id: doctorId,
        weekday: block.weekday,
        start_time: block.start_time,
        end_time: block.end_time,
        slot_minutes: block.slot_minutes,
        location: block.location,
        is_active: true,
      });
    }
  }

  for (const document of demoKnowledge) {
    const { data: existing } = await supabase
      .from("ai_documents")
      .select("id")
      .eq("title", document.title)
      .maybeSingle();

    if (!existing) {
      await supabase.from("ai_documents").insert({
        ...document,
        metadata: {
          seeded: true,
          searchable_without_embeddings: true,
        },
      });
    }
  }

  for (const template of demoTemplates) {
    const { data: existing } = await supabase
      .from("message_templates")
      .select("id")
      .eq("name", template.name)
      .maybeSingle();

    if (!existing) {
      await supabase.from("message_templates").insert(template);
    }
  }

  const { data: existingAppointment } = await supabase
    .from("appointments")
    .select("id")
    .eq("patient_phone", "+1 555 0100")
    .maybeSingle();

  if (!existingAppointment) {
    await supabase.from("appointments").insert({
      patient_name: "Demo Appointment",
      patient_email: "appointment.demo@medidove.ai",
      patient_phone: "+1 555 0100",
      requested_department: "Dental Care",
      requested_doctor: "Dr. Michael Chen",
      requested_at: new Date(Date.now() + 86400000).toISOString(),
      reason:
        "Demo request for dental pain consultation created from the seed workspace action.",
      ai_summary:
        "MEDIUM dental appointment request: patient needs dental pain consultation this week.",
      urgency: "medium",
      status: "pending",
      source_channel: "website",
    });
  }

  await seedLeadIfMissing(supabase);
  await seedConsentIfMissing(supabase);
  await seedOptOutIfMissing(supabase);
  await seedFeedbackIfMissing(supabase);
  await seedCampaignIfMissing(supabase);
  await seedAiLeadIfMissing(supabase);

  const { data: existingCall } = await supabase
    .from("call_logs")
    .select("id")
    .eq("phone_number", "+1 555 0102")
    .maybeSingle();

  if (!existingCall) {
    await supabase.from("call_logs").insert({
      phone_number: "+1 555 0102",
      direction: "outbound",
      provider: "elevenlabs",
      status: "requested",
      ai_summary:
        "Demo callback request: patient wants the AI receptionist to help choose a department.",
    });
  }

  const { data: existingWhatsApp } = await supabase
    .from("whatsapp_messages")
    .select("id")
    .eq("phone_number", "+1 555 0103")
    .maybeSingle();

  if (!existingWhatsApp) {
    await supabase.from("whatsapp_messages").insert({
      phone_number: "+1 555 0103",
      direction: "outbound",
      message:
        "Demo WhatsApp opt-in: patient wants appointment reminders and care coordinator follow-up.",
      status: "requested",
    });
  }

  refreshContent();
};
