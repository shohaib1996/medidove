import { createClient } from "@/lib/supabase/server";
import { fallbackDoctors, fallbackServices } from "./static-content";

export type PublicService = (typeof fallbackServices)[number];
export type PublicDoctor = (typeof fallbackDoctors)[number];
export type BookingOption = {
  label: string;
  value: string;
  id?: string;
};
export type AvailabilityOption = {
  id: string;
  doctorId: string;
  doctorName: string;
  weekday: number;
  startTime: string;
  endTime: string;
  slotMinutes: number;
  location: string | null;
};

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

export const getBookingOptions = async (): Promise<{
  departments: BookingOption[];
  doctors: BookingOption[];
  availability: AvailabilityOption[];
}> => {
  const supabase = await createClient();
  const [
    { data: departmentsData },
    { data: doctorsData },
    { data: availabilityData },
  ] = await Promise.all([
    supabase
      .from("departments")
      .select("name")
      .eq("is_active", true)
      .order("name", { ascending: true }),
    supabase
      .from("doctors")
      .select("id, full_name, specialty")
      .eq("is_active", true)
      .order("full_name", { ascending: true }),
    supabase
      .from("doctor_availability")
      .select("id, doctor_id, weekday, start_time, end_time, slot_minutes, location, doctors(full_name)")
      .eq("is_active", true)
      .order("weekday", { ascending: true }),
  ]);

  const departments = departmentsData?.length
    ? departmentsData.map((department) => ({
        label: department.name,
        value: department.name,
      }))
    : fallbackServices.map((service) => ({
        label: service.title,
        value: service.title,
      }));

  const doctors = doctorsData?.length
    ? [
        { label: "First available doctor", value: "First available doctor" },
        ...doctorsData.map((doctor) => ({
          label: `${doctor.full_name} - ${doctor.specialty}`,
          value: doctor.full_name,
          id: doctor.id,
        })),
      ]
    : [
        { label: "First available doctor", value: "First available doctor" },
        ...fallbackDoctors.map((doctor) => ({
          label: `${doctor.name} - ${doctor.specialty}`,
          value: doctor.name,
        })),
      ];

  const availability = availabilityData?.length
    ? availabilityData.map((block) => ({
        id: block.id,
        doctorId: block.doctor_id,
        doctorName: block.doctors?.full_name || "Clinic doctor",
        weekday: block.weekday,
        startTime: block.start_time,
        endTime: block.end_time,
        slotMinutes: block.slot_minutes,
        location: block.location,
      }))
    : [];

  return { departments, doctors, availability };
};
