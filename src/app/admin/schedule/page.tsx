
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ScheduleDashboard from "./ScheduleDashboard";
import type { Appointment, Availability, Doctor, DoctorUser } from "./types";

export const metadata = {
  title: "Doctor Schedule | MediDove Admin",
};

export default async function AdminSchedulePage() {
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

  return (
    <ScheduleDashboard
      doctors={doctors}
      doctorUsers={doctorUsers}
      availability={availability}
      appointments={appointments}
      activeDoctors={activeDoctors}
      activeBlocks={activeBlocks}
      pendingAppointments={pendingAppointments}
    />
  );
}
