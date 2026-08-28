import { fallbackBlogPosts } from "@/lib/blog/content";
import { fallbackHealthPackages } from "@/lib/packages/content";
import { fallbackProducts } from "@/lib/products/content";
import { fallbackTestimonials } from "@/lib/testimonials/content";
import type { Database } from "@/lib/supabase/database.types";

type MessageTemplateInsert =
  Database["public"]["Tables"]["message_templates"]["Insert"];

export const demoDepartments = [
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

export const demoServices = [
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

export const demoDoctors = [
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

export const demoAvailability = [
  {
    doctorSlug: "dr-amina-rahman",
    weekday: 1,
    start_time: "09:00",
    end_time: "13:00",
    slot_minutes: 30,
    location: "Main clinic",
  },
  {
    doctorSlug: "dr-sarah-patel",
    weekday: 3,
    start_time: "10:00",
    end_time: "15:00",
    slot_minutes: 30,
    location: "Pediatrics wing",
  },
  {
    doctorSlug: "dr-michael-chen",
    weekday: 5,
    start_time: "11:00",
    end_time: "16:00",
    slot_minutes: 30,
    location: "Dental suite",
  },
];

export const demoStaffMembers = [
  {
    full_name: "Alex Morgan",
    email: "alex.reception@medidove.ai",
    phone: "+1 555 0201",
    role: "receptionist" as const,
    status: "active" as const,
    notes:
      "Primary owner for AI receptionist callbacks, WhatsApp replies, and appointment handoffs.",
  },
  {
    full_name: "Dr. Amina Rahman",
    email: "amina.rahman@medidove.ai",
    phone: "+1 555 0202",
    role: "doctor" as const,
    status: "active" as const,
    notes:
      "Reviews primary care appointment requests and AI-prepared intake summaries.",
  },
  {
    full_name: "Mira Patel",
    email: "mira.admin@medidove.ai",
    phone: "+1 555 0203",
    role: "admin" as const,
    status: "invited" as const,
    notes:
      "Demo admin user for operations, content, reporting, and campaign review.",
  },
];

export const demoKnowledge = [
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

export const demoTemplates: MessageTemplateInsert[] = [
  {
    name: "Appointment confirmation",
    channel: "whatsapp" as const,
    category: "appointment",
    body: "Hi {{patient_name}}, your MediDove appointment request for {{appointment_time}} has been received. A coordinator will confirm the final schedule shortly.",
    variables: ["patient_name", "appointment_time"],
  },
  {
    name: "AI receptionist callback",
    channel: "voice" as const,
    category: "callback",
    body: "Hello {{patient_name}}, this is MediDove calling about your callback request. I can help collect your preferred department, doctor, and appointment time.",
    variables: ["patient_name"],
  },
  {
    name: "Lead follow-up",
    channel: "email" as const,
    category: "lead",
    body: "Hi {{patient_name}}, thanks for contacting MediDove. We reviewed your message and a care coordinator will help with the next step.",
    variables: ["patient_name"],
  },
];

export {
  fallbackBlogPosts,
  fallbackHealthPackages,
  fallbackProducts,
  fallbackTestimonials,
};
