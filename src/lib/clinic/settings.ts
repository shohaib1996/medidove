import { createClient } from "@supabase/supabase-js";
import { getSupabaseBrowserEnv } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/database.types";

export type ClinicSettings = {
  clinicName: string;
  phone: string;
  email: string;
  address: string;
  businessHours: string;
  whatsappNumber: string;
  emergencyNotice: string;
  aiDisclosure: string;
};

export const fallbackClinicSettings: ClinicSettings = {
  clinicName: "MediDove Care Center",
  phone: "+1 800 833 9780",
  email: "care@medidove.ai",
  address: "MediDove Care Center",
  businessHours: "Monday to Friday, 9:00 AM - 6:00 PM",
  whatsappNumber: "+1 555 0103",
  emergencyNotice:
    "For urgent or life-threatening symptoms, contact emergency services or visit the nearest emergency department.",
  aiDisclosure:
    "MediDove uses AI for scheduling, routing, summaries, and communication support. AI does not provide diagnosis or treatment.",
};

export const getClinicSettings = async (): Promise<ClinicSettings> => {
  try {
    const { url, publishableKey } = getSupabaseBrowserEnv();
    const supabase = createClient<Database>(url, publishableKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    const { data } = await supabase
      .from("clinic_settings")
      .select(
        "clinic_name, phone, email, address, business_hours, whatsapp_number, emergency_notice, ai_disclosure",
      )
      .eq("id", "default")
      .maybeSingle();

    if (!data) {
      return fallbackClinicSettings;
    }

    return {
      clinicName: data.clinic_name || fallbackClinicSettings.clinicName,
      phone: data.phone || fallbackClinicSettings.phone,
      email: data.email || fallbackClinicSettings.email,
      address: data.address || fallbackClinicSettings.address,
      businessHours: data.business_hours || fallbackClinicSettings.businessHours,
      whatsappNumber:
        data.whatsapp_number || fallbackClinicSettings.whatsappNumber,
      emergencyNotice:
        data.emergency_notice || fallbackClinicSettings.emergencyNotice,
      aiDisclosure: data.ai_disclosure || fallbackClinicSettings.aiDisclosure,
    };
  } catch (error) {
    console.error("Clinic settings lookup failed:", error);
    return fallbackClinicSettings;
  }
};
