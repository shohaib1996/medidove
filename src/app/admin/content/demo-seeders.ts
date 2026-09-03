import { triageLead } from "@/lib/ai/lead-triage";
import { assertAdmin } from "./action-utils";
import { fallbackBlogPosts, fallbackHealthPackages, fallbackProducts, fallbackTestimonials, demoStaffMembers } from "./demo-data";

type AdminSupabaseClient = Awaited<ReturnType<typeof assertAdmin>>;

export const seedConsentIfMissing = async (
  supabase: AdminSupabaseClient,
) => {
  const phone = "+1 555 0103";
  const { data: existing } = await supabase
    .from("consent_logs")
    .select("id")
    .eq("phone", phone)
    .eq("channel", "whatsapp")
    .eq("consented", true)
    .maybeSingle();

  if (existing) {
    return;
  }

  await supabase.from("consent_logs").insert({
    phone,
    email: "whatsapp.demo@medidove.ai",
    channel: "whatsapp",
    consented: true,
    reason: "Demo opt-in for appointment reminders and patient engagement.",
  });
};

export const seedOptOutIfMissing = async (
  supabase: AdminSupabaseClient,
) => {
  const email = "optout.demo@medidove.ai";
  const { data: existing } = await supabase
    .from("opt_outs")
    .select("id")
    .eq("email", email)
    .eq("channel", "email")
    .maybeSingle();

  if (existing) {
    return;
  }

  await supabase.from("opt_outs").insert({
    email,
    channel: "email",
    reason: "Demo patient opted out of marketing emails.",
    source: "demo_seed",
  });
};

export const seedLeadIfMissing = async (
  supabase: AdminSupabaseClient,
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

export const seedFeedbackIfMissing = async (
  supabase: AdminSupabaseClient,
) => {
  const email = "feedback.demo@medidove.ai";
  const { data: existing } = await supabase
    .from("patient_feedback")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    return;
  }

  await supabase.from("patient_feedback").insert({
    name: "Demo Feedback",
    email,
    phone: "+1 555 0104",
    rating: 3,
    category: "wait_time",
    message:
      "The doctor was helpful, but I waited longer than expected and would like better updates next time.",
    ai_sentiment: "mixed",
    ai_summary:
      "Mixed wait-time feedback: patient appreciated care quality but wants better delay communication.",
    ai_urgency: "medium",
    status: "new",
  });
};

export const seedClinicalNoteIfMissing = async (
  supabase: AdminSupabaseClient,
) => {
  const patientName = "Demo Appointment";
  const { data: existing } = await supabase
    .from("clinical_notes")
    .select("id")
    .eq("patient_name", patientName)
    .maybeSingle();

  if (existing) {
    return;
  }

  await supabase.from("clinical_notes").insert({
    patient_name: patientName,
    visit_type: "dental consultation",
    raw_note:
      "Patient requested dental pain consultation. Staff should confirm duration, swelling, bleeding, and preferred appointment time.",
    subjective: "Patient reports dental pain and requests appointment support.",
    objective: "No exam data recorded in demo note.",
    assessment:
      "Administrative note for routing only; clinician review is required before care decisions.",
    care_plan:
      "Schedule dental consultation, confirm red-flag symptoms, and send opt-in reminder after confirmation.",
    risk_flags: ["swelling_check"],
    status: "reviewed",
  });
};

export const seedCampaignIfMissing = async (
  supabase: AdminSupabaseClient,
) => {
  const name = "Demo wellness reactivation";
  const { data: existing } = await supabase
    .from("campaigns")
    .select("id")
    .eq("name", name)
    .maybeSingle();

  if (existing) {
    return;
  }

  await supabase.from("campaigns").insert({
    name,
    campaign_type: "wellness_check",
    audience: "whatsapp_opt_ins",
    channel: "whatsapp",
    goal: "Invite opted-in patients to book a routine wellness visit.",
    message:
      "Hi {{patient_name}}, this is MediDove Clinic. We are checking in to see whether you would like support scheduling a routine wellness visit. Reply CONFIRM to confirm, HELP for staff support, or STOP to opt out.",
    ai_recommendation:
      "Use approved WhatsApp templates for business-initiated outreach and dispatch only after consent validation.",
    status: "draft",
  });
};

export const seedAiLeadIfMissing = async (
  supabase: AdminSupabaseClient,
) => {
  const visitorId = "demo-ai-lead-visitor";
  const { data: existing } = await supabase
    .from("ai_leads")
    .select("id")
    .eq("visitor_id", visitorId)
    .maybeSingle();

  if (existing) {
    return;
  }

  await supabase.from("ai_leads").insert({
    visitor_id: visitorId,
    name: "Demo Chat Lead",
    email: "chat.lead.demo@medidove.ai",
    phone: "+1 555 0105",
    interest: "appointment",
    summary:
      "Demo chat lead asked the AI assistant for dental appointment help and shared contact details for staff follow-up.",
    urgency: "medium",
    status: "new",
  });
};

export const seedClinicSettings = async (
  supabase: AdminSupabaseClient,
) => {
  await supabase.from("clinic_settings").upsert({
    id: "default",
    clinic_name: "MediDove AI Care Center",
    phone: "+1 800 833 9780",
    email: "care@medidove.ai",
    address: "MediDove Care Center, Digital Health District",
    business_hours: "Monday to Friday, 9:00 AM - 6:00 PM",
    whatsapp_number: "+1 555 0103",
    emergency_notice:
      "For urgent or life-threatening symptoms, contact emergency services or visit the nearest emergency department.",
    ai_disclosure:
      "MediDove uses AI for scheduling, routing, summaries, and communication support. AI does not provide diagnosis or treatment.",
    updated_at: new Date().toISOString(),
  });
};

export const seedStaffMembers = async (
  supabase: AdminSupabaseClient,
) => {
  await supabase.from("staff_members").upsert(demoStaffMembers, {
    onConflict: "email",
  });
};

export const seedBlogPosts = async (
  supabase: AdminSupabaseClient,
) => {
  await supabase.from("blog_posts").upsert(
    fallbackBlogPosts.map((post) => ({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      image_url: post.imageUrl,
      author_name: post.authorName,
      is_published: true,
      published_at: post.publishedAt,
    })),
    { onConflict: "slug" },
  );
};

export const seedHealthPackages = async (
  supabase: AdminSupabaseClient,
) => {
  await supabase.from("health_packages").upsert(
    fallbackHealthPackages.map((item) => ({
      name: item.name,
      slug: item.slug,
      description: item.description,
      price: item.price,
      duration: item.duration,
      audience: item.audience,
      features: item.features,
      badge: item.badge,
      image_url: item.imageUrl,
      is_featured: item.isFeatured,
      is_active: true,
    })),
    { onConflict: "slug" },
  );
};

export const seedProducts = async (
  supabase: AdminSupabaseClient,
) => {
  await supabase.from("products").upsert(
    fallbackProducts.map((item) => ({
      name: item.name,
      slug: item.slug,
      category: item.category,
      description: item.description,
      price: item.price,
      image_url: item.imageUrl,
      stock_status: item.stockStatus,
      requires_prescription: item.requiresPrescription,
      is_featured: item.isFeatured,
      is_active: true,
    })),
    { onConflict: "slug" },
  );
};

export const seedTestimonials = async (
  supabase: AdminSupabaseClient,
) => {
  for (const item of fallbackTestimonials) {
    const { data: existing } = await supabase
      .from("testimonials")
      .select("id")
      .eq("author_name", item.authorName)
      .maybeSingle();

    if (!existing) {
      await supabase.from("testimonials").insert({
        author_name: item.authorName,
        author_role: item.authorRole,
        quote: item.quote,
        rating: item.rating,
        category: item.category,
        image_url: item.imageUrl,
        is_featured: item.isFeatured,
        is_published: true,
      });
    }
  }
};
