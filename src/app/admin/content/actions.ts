"use server";

import { revalidatePath } from "next/cache";
import { triageLead } from "@/lib/ai/lead-triage";
import { createClient } from "@/lib/supabase/server";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const text = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

const assertAdmin = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Admin access is required.");
  }

  return supabase;
};

const refreshContent = () => {
  revalidatePath("/admin/content");
  revalidatePath("/admin");
  revalidatePath("/admin/analytics");
  revalidatePath("/service");
  revalidatePath("/doctor");
};

export const createDepartment = async (formData: FormData) => {
  const name = text(formData.get("name"));
  const description = text(formData.get("description"));

  if (!name) {
    throw new Error("Department name is required.");
  }

  const supabase = await assertAdmin();
  const { error } = await supabase.from("departments").insert({
    name,
    slug: slugify(name),
    description: description || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  refreshContent();
};

export const createService = async (formData: FormData) => {
  const title = text(formData.get("title"));
  const summary = text(formData.get("summary"));
  const description = text(formData.get("description"));
  const departmentId = text(formData.get("department_id"));

  if (!title || !summary) {
    throw new Error("Service title and summary are required.");
  }

  const supabase = await assertAdmin();
  const { error } = await supabase.from("services").insert({
    department_id: departmentId || null,
    title,
    slug: slugify(title),
    summary,
    description: description || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  refreshContent();
};

export const createDoctor = async (formData: FormData) => {
  const fullName = text(formData.get("full_name"));
  const specialty = text(formData.get("specialty"));
  const bio = text(formData.get("bio"));
  const imageUrl = text(formData.get("image_url"));
  const departmentId = text(formData.get("department_id"));

  if (!fullName || !specialty) {
    throw new Error("Doctor name and specialty are required.");
  }

  const supabase = await assertAdmin();
  const { error } = await supabase.from("doctors").insert({
    department_id: departmentId || null,
    full_name: fullName,
    slug: slugify(fullName),
    specialty,
    bio: bio || null,
    image_url: imageUrl || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  refreshContent();
};

export const createKnowledgeDocument = async (formData: FormData) => {
  const title = text(formData.get("title"));
  const content = text(formData.get("content"));
  const sourceType = text(formData.get("source_type")) || "faq";

  if (!title || !content) {
    throw new Error("Knowledge title and content are required.");
  }

  const supabase = await assertAdmin();
  const { error } = await supabase.from("ai_documents").insert({
    source_type: sourceType,
    title,
    content,
    metadata: {
      managed_by: "admin_content_page",
      searchable_without_embeddings: true,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/content");
};

const demoDepartments = [
  {
    name: "Primary Care",
    slug: "primary-care",
    description:
      "General medicine, checkups, common illness support, and first-line patient routing.",
  },
  {
    name: "Dental Care",
    slug: "dental-care",
    description:
      "Dental pain, cleaning, fillings, oral care questions, and follow-up reminders.",
  },
  {
    name: "Pediatrics",
    slug: "pediatrics",
    description:
      "Child health visits, vaccination reminders, parent questions, and family care coordination.",
  },
  {
    name: "Diagnostics",
    slug: "diagnostics",
    description:
      "Radiology and imaging appointment support with preparation guidance.",
  },
];

const demoServices = [
  {
    title: "AI-assisted general checkup",
    slug: "ai-assisted-general-checkup",
    departmentSlug: "primary-care",
    summary:
      "Primary care visit with smart intake notes prepared before the patient arrives.",
    description:
      "Use for routine checkups, fever, cough, general concerns, and follow-up routing.",
  },
  {
    title: "Dental pain consultation",
    slug: "dental-pain-consultation",
    departmentSlug: "dental-care",
    summary:
      "Dental triage for tooth pain, cleaning requests, fillings, and oral care questions.",
    description:
      "AI should collect pain duration, preferred time, and whether swelling or bleeding is present.",
  },
  {
    title: "Child fever appointment",
    slug: "child-fever-appointment",
    departmentSlug: "pediatrics",
    summary:
      "Pediatric appointment workflow for fever, vaccines, and parent follow-up.",
    description:
      "Route parent requests to pediatrics and ask staff to confirm urgency before appointment.",
  },
  {
    title: "Radiology booking support",
    slug: "radiology-booking-support",
    departmentSlug: "diagnostics",
    summary:
      "Imaging appointment requests with preparation and result pickup support.",
    description:
      "AI can answer preparation FAQs and collect preferred imaging date.",
  },
];

const demoDoctors = [
  {
    fullName: "Dr. Amina Rahman",
    slug: "dr-amina-rahman",
    specialty: "Primary Care Physician",
    departmentSlug: "primary-care",
    imageUrl: "/assets/img/team/member1.png",
    bio: "Focuses on preventive care, chronic condition follow-up, and AI-assisted intake review.",
  },
  {
    fullName: "Dr. Sarah Patel",
    slug: "dr-sarah-patel",
    specialty: "Pediatrician",
    departmentSlug: "pediatrics",
    imageUrl: "/assets/img/team/member5.png",
    bio: "Supports child health appointments, vaccination planning, and parent communication workflows.",
  },
  {
    fullName: "Dr. Michael Chen",
    slug: "dr-michael-chen",
    specialty: "Dental Surgeon",
    departmentSlug: "dental-care",
    imageUrl: "/assets/img/team/member2.png",
    bio: "Handles dental pain consults, preventive care, and follow-up reminders.",
  },
];

const demoKnowledge = [
  {
    source_type: "faq",
    title: "Appointment booking policy",
    content:
      "Patients can request an appointment online with name, phone, preferred department, date, time, and reason. Admin staff must confirm the appointment before it is final.",
  },
  {
    source_type: "policy",
    title: "Emergency safety guidance",
    content:
      "The AI assistant must not diagnose emergencies. If a patient mentions chest pain, trouble breathing, heavy bleeding, stroke symptoms, or unconsciousness, guide them to local emergency services immediately.",
  },
  {
    source_type: "reception_script",
    title: "AI receptionist booking script",
    content:
      "The voice receptionist should greet the patient, collect their name and phone number, ask for the reason for visit, preferred department, preferred date and time, and confirm consent for follow-up.",
  },
];

const seedLeadIfMissing = async (
  supabase: Awaited<ReturnType<typeof assertAdmin>>,
) => {
  const email = "demo.patient@medidove.ai";
  const { data: existing } = await supabase
    .from("contact_leads")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    return;
  }

  const triage = triageLead({
    name: "Demo Patient",
    subject: "Need appointment help",
    message:
      "I have dental pain and want help booking the right doctor this week.",
  });

  await supabase.from("contact_leads").insert({
    name: "Demo Patient",
    email,
    phone: "+1 555 0101",
    subject: "Need appointment help",
    message:
      "I have dental pain and want help booking the right doctor this week.",
    ai_category: triage.category,
    ai_summary: triage.summary,
    ai_urgency: triage.urgency,
    ai_suggested_reply: triage.suggestedReply,
    status: "new",
  });
};

export const seedDemoWorkspace = async () => {
  const supabase = await assertAdmin();

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
