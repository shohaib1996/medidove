import Link from "next/link";
import { Bot, Building2, Plus, Stethoscope, UserRound } from "lucide-react";
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
import {
  createDepartment,
  createDoctor,
  createKnowledgeDocument,
  createService,
  seedDemoWorkspace,
} from "./actions";
import type { Department, Doctor, KnowledgeDocument, Service } from "./types";

const DepartmentSelect = ({ departments }: { departments: Department[] }) => (
  <select
    name="department_id"
    className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
  >
    <option value="">No department</option>
    {departments.map((department) => (
      <option key={department.id} value={department.id}>
        {department.name}
      </option>
    ))}
  </select>
);

export const ContentHeader = () => (
  <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
    <div>
      <p className="text-xs font-bold uppercase text-primary">
        Clinic content
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">
        Manage departments, services, and doctors
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Add live Supabase content that feeds the public service and doctor
        pages, appointment routing, and future AI knowledge search.
      </p>
    </div>
    <Button asChild variant="secondary">
      <Link href="/admin">Back to dashboard</Link>
    </Button>
  </section>
);

export const DemoSeedCard = () => (
  <Card className="border-primary/20 bg-primary/5">
    <CardHeader className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <CardDescription>Demo setup</CardDescription>
        <CardTitle>Populate buyer-ready sample data</CardTitle>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Adds sample departments, services, doctors, AI knowledge, one
          appointment, one lead, one callback request, one WhatsApp opt-in,
          opt-out, schedules, staff records, feedback, public clinic settings,
          AI blog posts, plus one AI chat lead so the dashboard and analytics
          pages are ready to demo. It also seeds public health packages,
          products, and testimonials for buyer-ready proof pages.
        </p>
      </div>
      <form action={seedDemoWorkspace}>
        <Button type="submit">
          <Plus />
          Seed demo workspace
        </Button>
      </form>
    </CardHeader>
  </Card>
);

export const ContentMetrics = ({
  departments,
  services,
  doctors,
  knowledgeDocuments,
}: {
  departments: Department[];
  services: Service[];
  doctors: Doctor[];
  knowledgeDocuments: KnowledgeDocument[];
}) => (
  <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardDescription>Departments</CardDescription>
          <CardTitle className="mt-2 text-3xl">{departments.length}</CardTitle>
        </div>
        <Building2 className="size-8 text-primary" />
      </CardHeader>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardDescription>Services</CardDescription>
          <CardTitle className="mt-2 text-3xl">{services.length}</CardTitle>
        </div>
        <Stethoscope className="size-8 text-teal-600" />
      </CardHeader>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardDescription>Doctors</CardDescription>
          <CardTitle className="mt-2 text-3xl">{doctors.length}</CardTitle>
        </div>
        <UserRound className="size-8 text-indigo-600" />
      </CardHeader>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardDescription>AI knowledge</CardDescription>
          <CardTitle className="mt-2 text-3xl">
            {knowledgeDocuments.length}
          </CardTitle>
        </div>
        <Bot className="size-8 text-sky-600" />
      </CardHeader>
    </Card>
  </section>
);

export const ContentForms = ({ departments }: { departments: Department[] }) => (
  <section className="grid gap-6 xl:grid-cols-4">
    <Card>
      <CardHeader>
        <CardDescription>Department</CardDescription>
        <CardTitle>Add department</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createDepartment} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="department-name">Name</Label>
            <Input id="department-name" name="name" placeholder="Cardiology" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department-description">Description</Label>
            <Textarea
              id="department-description"
              name="description"
              rows={4}
              placeholder="Short public description."
            />
          </div>
          <Button type="submit">
            <Plus />
            Add department
          </Button>
        </form>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardDescription>Service</CardDescription>
        <CardTitle>Add service</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createService} className="space-y-4">
          <div className="space-y-2">
            <Label>Department</Label>
            <DepartmentSelect departments={departments} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="service-title">Title</Label>
            <Input id="service-title" name="title" placeholder="Heart checkup" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="service-summary">Summary</Label>
            <Textarea
              id="service-summary"
              name="summary"
              rows={3}
              placeholder="Patient-facing summary."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="service-description">AI note</Label>
            <Textarea
              id="service-description"
              name="description"
              rows={3}
              placeholder="Routing, preparation, or FAQ note."
            />
          </div>
          <Button type="submit">
            <Plus />
            Add service
          </Button>
        </form>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardDescription>Doctor</CardDescription>
        <CardTitle>Add doctor</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createDoctor} className="space-y-4">
          <div className="space-y-2">
            <Label>Department</Label>
            <DepartmentSelect departments={departments} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor-name">Full name</Label>
            <Input
              id="doctor-name"
              name="full_name"
              placeholder="Dr. Amina Rahman"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor-specialty">Specialty</Label>
            <Input
              id="doctor-specialty"
              name="specialty"
              placeholder="Cardiology"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor-image">Image URL</Label>
            <Input
              id="doctor-image"
              name="image_url"
              placeholder="/assets/img/team/member1.png"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor-bio">Bio</Label>
            <Textarea
              id="doctor-bio"
              name="bio"
              rows={3}
              placeholder="Short doctor profile."
            />
          </div>
          <Button type="submit">
            <Plus />
            Add doctor
          </Button>
        </form>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardDescription>AI knowledge</CardDescription>
        <CardTitle>Add FAQ or policy</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createKnowledgeDocument} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="knowledge-source">Source type</Label>
            <select
              id="knowledge-source"
              name="source_type"
              className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="faq">FAQ</option>
              <option value="policy">Clinic policy</option>
              <option value="service_note">Service note</option>
              <option value="reception_script">Reception script</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="knowledge-title">Title</Label>
            <Input
              id="knowledge-title"
              name="title"
              placeholder="Insurance and payment FAQ"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="knowledge-content">Content</Label>
            <Textarea
              id="knowledge-content"
              name="content"
              rows={7}
              placeholder="Add the answer or policy text the AI assistant should use."
            />
          </div>
          <Button type="submit">
            <Plus />
            Add knowledge
          </Button>
        </form>
      </CardContent>
    </Card>
  </section>
);
