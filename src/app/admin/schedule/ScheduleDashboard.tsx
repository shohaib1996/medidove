import Link from "next/link";
import {
  CalendarClock,
  Clock,
  LinkIcon,
  MapPin,
  Power,
  Stethoscope,
  UserRoundCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DebouncedSearchInput from "@/components/common/DebouncedSearchInput";
import GlobalPagination from "@/components/common/GlobalPagination";
import {
  assignAppointmentDoctor,
  createDoctorAvailability,
  linkDoctorProfile,
  toggleDoctorAvailability,
} from "./actions";
import type { Appointment, Availability, Doctor, DoctorUser } from "./types";
import { doctorName, formatDate, weekdays } from "./utils";

type ScheduleDashboardProps = {
  doctors: Doctor[];
  doctorUsers: DoctorUser[];
  availability: Availability[];
  appointments: Appointment[];
  activeDoctors: number;
  activeBlocks: number;
  pendingAppointments: number;
  search: string;
  page: number;
  totalPages: number;
};

const ScheduleDashboard = ({
  doctors,
  doctorUsers,
  availability,
  appointments,
  activeDoctors,
  activeBlocks,
  pendingAppointments,
  search,
  page,
  totalPages,
}: ScheduleDashboardProps) => (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="flex flex-col justify-between gap-4 rounded-lg border bg-white p-6 shadow-sm lg:flex-row lg:items-center">
          <div>
            <Badge variant="secondary">Doctor Operations</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Doctor schedule
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Manage provider availability and assign appointment requests to
              the right doctor from one scheduling workspace.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/admin/appointments">Appointments</Link>
            </Button>
            <Button asChild>
              <Link href="/admin">Back to dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
              <Stethoscope className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{activeDoctors}</p>
              <p className="text-xs text-slate-500">Available public profiles</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Schedule Blocks</CardTitle>
              <Clock className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{activeBlocks}</p>
              <p className="text-xs text-slate-500">Active weekly blocks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Needs Assignment</CardTitle>
              <CalendarClock className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{pendingAppointments}</p>
              <p className="text-xs text-slate-500">Pending or rescheduled</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create availability</CardTitle>
                <CardDescription>
                  Add weekly schedule blocks for active doctors.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={createDoctorAvailability} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor_id">Doctor</Label>
                    <select
                      id="doctor_id"
                      name="doctor_id"
                      className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    >
                      <option value="">Choose doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.full_name} - {doctor.specialty}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="weekday">Weekday</Label>
                      <select
                        id="weekday"
                        name="weekday"
                        className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        defaultValue="1"
                      >
                        {weekdays.map((weekday, index) => (
                          <option key={weekday} value={index}>
                            {weekday}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slot_minutes">Slot minutes</Label>
                      <Input
                        id="slot_minutes"
                        min="10"
                        name="slot_minutes"
                        type="number"
                        defaultValue="30"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="start_time">Start</Label>
                      <Input
                        id="start_time"
                        name="start_time"
                        type="time"
                        defaultValue="09:00"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_time">End</Label>
                      <Input
                        id="end_time"
                        name="end_time"
                        type="time"
                        defaultValue="17:00"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Main clinic, Room 2"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Add availability
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Link doctor login</CardTitle>
                <CardDescription>
                  Connect a doctor content profile to a signed-in doctor account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={linkDoctorProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="link_doctor_id">Doctor record</Label>
                    <select
                      id="link_doctor_id"
                      name="doctor_id"
                      className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    >
                      <option value="">Choose doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.full_name} - {doctor.profile_id ? "linked" : "not linked"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile_id">Doctor user profile</Label>
                    <select
                      id="profile_id"
                      name="profile_id"
                      className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Remove profile link</option>
                      {doctorUsers.map((doctorUser) => (
                        <option key={doctorUser.id} value={doctorUser.id}>
                          {doctorUser.full_name || doctorUser.phone || doctorUser.id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button type="submit" className="w-full">
                    <LinkIcon className="h-4 w-4" />
                    Save doctor login link
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assign appointment</CardTitle>
                <CardDescription>
                  Confirm a pending request by assigning it to a doctor.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={assignAppointmentDoctor} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="appointment_id">Appointment</Label>
                    <select
                      id="appointment_id"
                      name="appointment_id"
                      className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    >
                      <option value="">Choose appointment</option>
                      {appointments.map((appointment) => (
                        <option key={appointment.id} value={appointment.id}>
                          {appointment.patient_name} -{" "}
                          {appointment.requested_department || "General care"} -{" "}
                          {formatDate(appointment.requested_at)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assign_doctor_id">Doctor</Label>
                    <select
                      id="assign_doctor_id"
                      name="doctor_id"
                      className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    >
                      <option value="">Choose doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.full_name} - {doctor.specialty}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requested_doctor">Display doctor name</Label>
                    <Input
                      id="requested_doctor"
                      name="requested_doctor"
                      placeholder="Dr. Amina Rahman"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <UserRoundCheck className="h-4 w-4" />
                    Assign and confirm
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-4">
            <DebouncedSearchInput
              basePath="/admin/schedule"
              defaultValue={search}
              placeholder="Search schedule by doctor name"
            />

            {availability.length > 0 ? (
              availability.map((block) => (
                <Card key={block.id}>
                  <CardHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <CardDescription>{doctorName(doctors, block.doctor_id)}</CardDescription>
                        <CardTitle className="mt-2 text-xl">
                          {weekdays[block.weekday]} {block.start_time.slice(0, 5)}-
                          {block.end_time.slice(0, 5)}
                        </CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={block.is_active ? "default" : "outline"}>
                          {block.is_active ? "Active" : "Paused"}
                        </Badge>
                        <Badge variant="secondary">{block.slot_minutes} min</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {block.location || "Location not set"}
                    </div>
                    <form action={toggleDoctorAvailability}>
                      <input type="hidden" name="id" value={block.id} />
                      <input
                        type="hidden"
                        name="is_active"
                        value={String(block.is_active)}
                      />
                      <Button type="submit" size="sm" variant="outline">
                        <Power className="h-4 w-4" />
                        {block.is_active ? "Pause" : "Activate"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-14 text-center text-slate-500">
                  <Clock className="mx-auto mb-3 h-9 w-9" />
                  {search
                    ? `No schedule blocks match "${search}".`
                    : "No doctor availability has been created yet."}
                </CardContent>
              </Card>
            )}

            <GlobalPagination
              page={page}
              totalPages={totalPages}
              buildHref={(targetPage) => {
                const params = new URLSearchParams();
                if (search) params.set("q", search);
                params.set("page", String(targetPage));
                return `/admin/schedule?${params.toString()}`;
              }}
            />
          </div>
        </section>
      </div>
    </main>
);

export default ScheduleDashboard;
