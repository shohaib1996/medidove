import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BriefcaseMedical,
  Mail,
  Phone,
  Plus,
  Stethoscope,
  UserCog,
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
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import DebouncedSearchInput from "@/components/common/DebouncedSearchInput";
import GlobalPagination from "@/components/common/GlobalPagination";
import type { UserRole } from "@/lib/supabase/database.types";
import {
  createDoctor,
  createStaffMember,
  deleteStaffMember,
  updateStaffStatus,
} from "./actions";
import { DEFAULT_LOGIN_PASSWORD } from "./constants";
import DeleteStaffButton from "./DeleteStaffButton";

export const metadata = {
  title: "Staff Management | MediDove Admin",
};

const PAGE_SIZE = 8;

type StaffMemberRow = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  status: "active" | "inactive" | "invited";
  notes: string | null;
  created_at: string;
  source: "staff_members" | "doctors";
};

type DoctorRow = {
  id: string;
  profile_id: string | null;
  full_name: string;
  specialty: string;
  is_active: boolean;
  created_at: string;
};

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  doctor: "Doctor",
  receptionist: "Receptionist",
  patient: "Patient",
};

const statusStyles: Record<StaffMemberRow["status"], string> = {
  active: "bg-emerald-50 text-emerald-700",
  inactive: "bg-slate-100 text-slate-700",
  invited: "bg-amber-50 text-amber-700",
};

const StatusButton = ({
  id,
  status,
  label,
}: {
  id: string;
  status: StaffMemberRow["status"];
  label: string;
}) => (
  <form action={updateStaffStatus}>
    <input type="hidden" name="id" value={id} />
    <input type="hidden" name="status" value={status} />
    <Button type="submit" variant="outline" size="sm">
      {label}
    </Button>
  </form>
);

type AdminStaffPageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function AdminStaffPage({
  searchParams,
}: AdminStaffPageProps) {
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

  const [{ data }, { data: doctorsData }, { data: departmentsData }] = await Promise.all([
    supabase
      .from("staff_members")
      .select("id, full_name, email, phone, role, status, notes, created_at")
      .order("created_at", { ascending: false })
      .limit(80),
    supabase
      .from("doctors")
      .select("id, profile_id, full_name, specialty, is_active, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("departments")
      .select("id, name")
      .order("name", { ascending: true }),
  ]);

  const departments = (departmentsData || []) as { id: string; name: string }[];

  const doctors = (doctorsData || []) as DoctorRow[];
  const doctorProfileIds = doctors
    .map((doctor) => doctor.profile_id)
    .filter((id): id is string => Boolean(id));

  const { data: doctorProfilesData } =
    doctorProfileIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, phone")
          .in("id", doctorProfileIds)
      : { data: [] as { id: string; phone: string | null }[] };

  const doctorPhoneById = new Map(
    (doctorProfilesData || []).map((row) => [row.id, row.phone]),
  );

  let doctorEmailById = new Map<string, string | null>();
  if (doctorProfileIds.length > 0) {
    const adminSupabase = createAdminClient();
    const { data: usersPage } = await adminSupabase.auth.admin.listUsers({
      perPage: 200,
    });
    doctorEmailById = new Map(
      (usersPage?.users || []).map((authUser) => [authUser.id, authUser.email || null]),
    );
  }

  const manualStaff = ((data || []) as (StaffMemberRow & { email: string })[]).map(
    (item) => ({ ...item, source: "staff_members" as const }),
  );

  const doctorStaff: StaffMemberRow[] = doctors.map((doctor) => ({
    id: doctor.id,
    full_name: doctor.full_name,
    email: doctor.profile_id ? doctorEmailById.get(doctor.profile_id) || null : null,
    phone: doctor.profile_id ? doctorPhoneById.get(doctor.profile_id) || null : null,
    role: "doctor",
    status: doctor.is_active ? "active" : "inactive",
    notes: doctor.specialty ? `Specialty: ${doctor.specialty}` : null,
    created_at: doctor.created_at,
    source: "doctors",
  }));

  const staff = [...manualStaff, ...doctorStaff].sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );
  const activeCount = staff.filter((item) => item.status === "active").length;
  const doctorCount = staff.filter((item) => item.role === "doctor").length;

  const filteredStaff = search
    ? staff.filter(
        (item) =>
          item.full_name.toLowerCase().includes(search.toLowerCase()) ||
          item.email?.toLowerCase().includes(search.toLowerCase()),
      )
    : staff;

  const totalPages = Math.max(1, Math.ceil(filteredStaff.length / PAGE_SIZE));
  const page = Math.min(
    Math.max(1, Number.parseInt(pageParam || "1", 10) || 1),
    totalPages,
  );
  const visibleStaff = filteredStaff.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase text-primary">
              Staff management
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">
              Clinic team directory
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Track admins, doctors, and invited team members who handle
              appointments, calls, tasks, and patient follow-up.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="secondary">
              <Link href="/admin">Back to dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Total staff</CardDescription>
                <CardTitle className="mt-2 text-3xl">{staff.length}</CardTitle>
              </div>
              <UserCog className="size-8 text-primary" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Active</CardDescription>
                <CardTitle className="mt-2 text-3xl">{activeCount}</CardTitle>
              </div>
              <BriefcaseMedical className="size-8 text-emerald-600" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Doctors</CardDescription>
              <CardTitle className="mt-2 text-3xl">{doctorCount}</CardTitle>
            </CardHeader>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardDescription>New provider</CardDescription>
              <CardTitle>Create doctor</CardTitle>
              <p className="text-sm text-slate-500">
                Creates the public doctor profile and a portal login with
                the email below (password {DEFAULT_LOGIN_PASSWORD}) at the
                same time.
              </p>
            </CardHeader>
            <CardContent>
              <form action={createDoctor} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="doctor_full_name">Full name</Label>
                    <Input
                      id="doctor_full_name"
                      name="full_name"
                      placeholder="Dr. Amina Rahman"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor_email">Email</Label>
                    <Input
                      id="doctor_email"
                      name="email"
                      type="email"
                      placeholder="amina.rahman@medidove.com"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="department_id">Department</Label>
                    <select
                      id="department_id"
                      name="department_id"
                      className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    >
                      <option value="">Choose department</option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Input
                      id="specialty"
                      name="specialty"
                      placeholder="Adult General Medicine"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="consultation_fee">Consultation fee</Label>
                    <Input
                      id="consultation_fee"
                      name="consultation_fee"
                      type="number"
                      min="0"
                      placeholder="80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      name="image_url"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    placeholder="Training, focus areas, and patient approach."
                  />
                </div>
                <Button type="submit">
                  <Stethoscope />
                  Create doctor
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>New team member</CardDescription>
              <CardTitle>Add admin</CardTitle>
              <p className="text-sm text-slate-500">
                Creates an admin login with the email below (password{" "}
                {DEFAULT_LOGIN_PASSWORD}) — use Create doctor above for
                providers instead.
              </p>
            </CardHeader>
            <CardContent>
              <form action={createStaffMember} className="space-y-5">
                <input type="hidden" name="role" value="admin" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      placeholder="Alex Morgan"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staff_email">Email</Label>
                    <Input
                      id="staff_email"
                      name="email"
                      type="email"
                      placeholder="alex.morgan@medidove.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="active">Active</option>
                    <option value="invited">Invited</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    rows={5}
                    placeholder="Coverage, departments, language skills, or handoff notes."
                  />
                </div>
                <Button type="submit">
                  <Plus />
                  Add admin
                </Button>
              </form>
            </CardContent>
          </Card>
          </div>

          <div className="flex flex-col gap-4">
            <DebouncedSearchInput
              basePath="/admin/staff"
              defaultValue={search}
              placeholder="Search staff by name or email"
            />

            {visibleStaff.length > 0 ? (
              visibleStaff.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div>
                        <CardDescription>{roleLabels[item.role]}</CardDescription>
                        <CardTitle className="mt-2 text-xl">
                          {item.full_name}
                        </CardTitle>
                      </div>
                      <span
                        className={`inline-flex w-fit rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[item.status]}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                      <span className="flex min-w-0 gap-2">
                        <Mail className="mt-0.5 size-4 shrink-0 text-slate-400" />
                        <span className="wrap-break-word">
                          {item.email || "No portal login"}
                        </span>
                      </span>
                      <span className="flex gap-2">
                        <Phone className="mt-0.5 size-4 shrink-0 text-slate-400" />
                        {item.phone || "No phone"}
                      </span>
                    </div>
                    {item.notes ? (
                      <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                        {item.notes}
                      </p>
                    ) : null}
                    {item.source === "staff_members" ? (
                      <div className="flex flex-wrap gap-2">
                        {item.status !== "active" ? (
                          <StatusButton id={item.id} status="active" label="Activate" />
                        ) : null}
                        {item.status !== "invited" ? (
                          <StatusButton id={item.id} status="invited" label="Mark invited" />
                        ) : null}
                        {item.status !== "inactive" ? (
                          <StatusButton id={item.id} status="inactive" label="Deactivate" />
                        ) : null}
                        <DeleteStaffButton
                          id={item.id}
                          name={item.full_name}
                          action={deleteStaffMember}
                        />
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">
                        Manage this doctor&apos;s availability from Doctor
                        schedule.
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-14 text-center text-slate-500">
                  <UserCog className="mx-auto mb-3 size-9" />
                  {search
                    ? `No staff match "${search}".`
                    : "No staff records yet."}
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
                return `/admin/staff?${params.toString()}`;
              }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
