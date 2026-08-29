import { createClient } from "@/lib/supabase/server";
import { fallbackDoctors, fallbackServices } from "./static-content";

export type PublicService = (typeof fallbackServices)[number];
export type PublicDoctor = (typeof fallbackDoctors)[number];
export type BookingOption = {
  label: string;
  value: string;
  id?: string;
  department?: string;
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

export type PublicDoctorFilters = {
  search?: string;
  department?: string;
  page?: number;
  pageSize?: number;
};

export type PublicDoctorsResult = {
  doctors: PublicDoctor[];
  total: number;
  page: number;
  pageSize: number;
};

export const getPublicDoctors = async (
  filters: PublicDoctorFilters = {},
): Promise<PublicDoctorsResult> => {
  const supabase = await createClient();
  const search = filters.search?.trim();
  const department = filters.department?.trim();
  const hasDepartmentFilter = Boolean(department && department !== "all");
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? 9;

  let departmentId: string | null = null;

  if (department && hasDepartmentFilter) {
    const { data: departmentRow } = await supabase
      .from("departments")
      .select("id")
      .eq("name", department)
      .maybeSingle();

    departmentId = departmentRow?.id ?? null;

    if (!departmentId) {
      return { doctors: [], total: 0, page, pageSize };
    }
  }

  let query = supabase
    .from("doctors")
    .select("full_name, specialty, image_url, departments(name)", {
      count: "exact",
    })
    .eq("is_active", true)
    .order("full_name", { ascending: true });

  if (search) {
    const escaped = search.replace(/[%,]/g, "");
    query = query.or(
      `full_name.ilike.%${escaped}%,specialty.ilike.%${escaped}%`,
    );
  }

  if (departmentId) {
    query = query.eq("department_id", departmentId);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, count } = await query.range(from, to);

  const hasFilters = Boolean(search) || hasDepartmentFilter;

  if (!data?.length) {
    if (hasFilters || page > 1) {
      return { doctors: [], total: count ?? 0, page, pageSize };
    }

    return {
      doctors: fallbackDoctors,
      total: fallbackDoctors.length,
      page,
      pageSize,
    };
  }

  const doctors = data.map((doctor, index) => ({
    name: doctor.full_name,
    specialty: doctor.specialty,
    department: doctor.departments?.name || "Clinic Care",
    image: doctor.image_url || fallbackDoctors[index % fallbackDoctors.length].image,
    availability: "Admin managed",
    languages: "Configured by clinic",
  }));

  return { doctors, total: count ?? doctors.length, page, pageSize };
};

export const getDoctorDepartments = async (): Promise<string[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("departments")
    .select("name")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (!data?.length) {
    return [...new Set(fallbackDoctors.map((doctor) => doctor.department))];
  }

  return data.map((department) => department.name);
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
      .select("id, full_name, specialty, departments(name)")
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
          department: doctor.departments?.name,
        })),
      ]
    : [
        { label: "First available doctor", value: "First available doctor" },
        ...fallbackDoctors.map((doctor) => ({
          label: `${doctor.name} - ${doctor.specialty}`,
          value: doctor.name,
          department: doctor.department,
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
