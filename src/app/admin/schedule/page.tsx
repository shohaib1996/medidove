
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ScheduleDashboard from "./ScheduleDashboard";
import { doctorName } from "./utils";
import type { Appointment, Availability, Doctor, DoctorUser } from "./types";

export const metadata = {
  title: "Doctor Schedule | MediDove Admin",
};

const PAGE_SIZE = 8;

type AdminSchedulePageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function AdminSchedulePage({
  searchParams,
}: AdminSchedulePageProps) {
  const { q, page: pageParam } = await searchParams;
  const search = (q || "").trim();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/admin");
  }

  const [
    { data: doctorsData },
    { data: doctorUsersData },
    { data: availabilityData },
    { data: appointmentsData },
  ] = await Promise.all([
    supabase
      .from("doctors")
      .select("id, profile_id, full_name, specialty, is_active")
      .order("full_name", { ascending: true }),
    supabase
      .from("profiles")
      .select("id, full_name, phone")
      .eq("role", "doctor")
      .order("created_at", { ascending: false }),
    supabase
      .from("doctor_availability")
      .select(
        "id, doctor_id, weekday, start_time, end_time, slot_minutes, location, is_active",
      )
      .order("weekday", { ascending: true }),
    supabase
      .from("appointments")
      .select(
        "id, patient_name, requested_department, requested_doctor, requested_at, status",
      )
      .in("status", ["pending", "rescheduled"])
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  const doctors = (doctorsData || []) as Doctor[];
  const doctorUsers = (doctorUsersData || []) as DoctorUser[];
  const availability = (availabilityData || []) as Availability[];
  const appointments = (appointmentsData || []) as Appointment[];
  const activeDoctors = doctors.filter((doctor) => doctor.is_active).length;
  const activeBlocks = availability.filter((block) => block.is_active).length;
  const pendingAppointments = appointments.length;

  const filteredAvailability = search
    ? availability.filter((block) =>
        doctorName(doctors, block.doctor_id)
          .toLowerCase()
          .includes(search.toLowerCase()),
      )
    : availability;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAvailability.length / PAGE_SIZE),
  );
  const page = Math.min(
    Math.max(1, Number.parseInt(pageParam || "1", 10) || 1),
    totalPages,
  );
  const visibleAvailability = filteredAvailability.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <ScheduleDashboard
      doctors={doctors}
      doctorUsers={doctorUsers}
      availability={visibleAvailability}
      appointments={appointments}
      activeDoctors={activeDoctors}
      activeBlocks={activeBlocks}
      pendingAppointments={pendingAppointments}
      search={search}
      page={page}
      totalPages={totalPages}
    />
  );
}
