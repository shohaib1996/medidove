import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ContentForms, ContentHeader, ContentMetrics } from "./components";
import { ContentLists } from "./ContentLists";
import type { Department, Doctor, KnowledgeDocument, Service } from "./types";

export const metadata = {
  title: "Clinic Content | MediDove Admin",
};

export default async function AdminContentPage() {
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
    { data: departmentsData },
    { data: servicesData },
    { data: doctorsData },
    { data: knowledgeData },
  ] = await Promise.all([
    supabase
      .from("departments")
      .select("id, name, description")
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("services")
      .select("id, title, summary")
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("doctors")
      .select("id, full_name, specialty")
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("ai_documents")
      .select("id, title, source_type, content")
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  const departments = (departmentsData || []) as Department[];
  const services = (servicesData || []) as Service[];
  const doctors = (doctorsData || []) as Doctor[];
  const knowledgeDocuments = (knowledgeData || []) as KnowledgeDocument[];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <ContentHeader />
        <ContentMetrics
          departments={departments}
          services={services}
          doctors={doctors}
          knowledgeDocuments={knowledgeDocuments}
        />
        <ContentForms departments={departments} />
        <ContentLists
          departments={departments}
          services={services}
          knowledgeDocuments={knowledgeDocuments}
        />
      </div>
    </main>
  );
}
