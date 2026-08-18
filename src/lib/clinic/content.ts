import { createClient } from "@/lib/supabase/server";
import { fallbackDoctors, fallbackServices } from "./static-content";

export type PublicService = (typeof fallbackServices)[number];
export type PublicDoctor = (typeof fallbackDoctors)[number];

export const getPublicServices = async (): Promise<PublicService[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("title, summary, description")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(12);

  if (!data?.length) {
    return fallbackServices;
  }

  return data.map((service, index) => ({
    icon: fallbackServices[index % fallbackServices.length].icon,
    title: service.title,
    description: service.summary,
    aiUse:
      service.description ||
      "AI assistant can use this service record for patient routing and booking support.",
  }));
};

export const getPublicDoctors = async (): Promise<PublicDoctor[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("doctors")
    .select("full_name, specialty, image_url, departments(name)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(12);

  if (!data?.length) {
    return fallbackDoctors;
  }

  return data.map((doctor, index) => ({
    name: doctor.full_name,
    specialty: doctor.specialty,
    department: doctor.departments?.name || "Clinic Care",
    image: doctor.image_url || fallbackDoctors[index % fallbackDoctors.length].image,
    availability: "Admin managed",
    languages: "Configured by clinic",
  }));
};
