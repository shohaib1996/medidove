import DoctorsPage from "@/components/doctors/DoctorsPage";
import { getDoctorDepartments, getPublicDoctors } from "@/lib/clinic/content";

export const metadata = {
  title: "Doctors | MediDove Clinic",
  description:
    "Explore MediDove doctors and care matching workflows for appointment booking.",
};

const PAGE_SIZE = 9;

const getSingleParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const index = async ({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string | string[];
    department?: string | string[];
    page?: string | string[];
  }>;
}) => {
  const params = await searchParams;
  const search = getSingleParam(params.q) || "";
  const department = getSingleParam(params.department) || "all";
  const page = Math.max(1, Number(getSingleParam(params.page)) || 1);

  const [{ doctors, total }, departments] = await Promise.all([
    getPublicDoctors({ search, department, page, pageSize: PAGE_SIZE }),
    getDoctorDepartments(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <DoctorsPage
      doctors={doctors}
      departments={departments}
      search={search}
      department={department}
      page={page}
      totalPages={totalPages}
    />
  );
};

export default index;
