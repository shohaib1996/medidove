import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, Clock, Mail, Phone, ShieldAlert } from "lucide-react";
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
import { fallbackClinicSettings, getClinicSettings } from "@/lib/clinic/settings";
import { createClient } from "@/lib/supabase/server";
import { updateClinicSettings } from "./actions";

export const metadata = {
  title: "Clinic Settings | MediDove Admin",
};

export default async function AdminSettingsPage() {
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

  const settings = await getClinicSettings();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase text-primary">
              Clinic settings
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">
              Public contact and safety settings
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Manage the public clinic name, contact channels, business hours,
              emergency notice, and AI disclosure shown across buyer-facing
              pages.
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/admin">Back to dashboard</Link>
          </Button>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Clinic</CardDescription>
                <CardTitle className="mt-2 text-xl">
                  {settings.clinicName}
                </CardTitle>
              </div>
              <Building2 className="size-8 text-primary" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Phone</CardDescription>
                <CardTitle className="mt-2 text-xl">{settings.phone}</CardTitle>
              </div>
              <Phone className="size-8 text-emerald-600" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Email</CardDescription>
                <CardTitle className="mt-2 wrap-break-word text-xl">
                  {settings.email}
                </CardTitle>
              </div>
              <Mail className="size-8 text-cyan-600" />
            </CardHeader>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardDescription>Settings form</CardDescription>
            <CardTitle>Update public clinic details</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateClinicSettings} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clinic_name">Clinic name</Label>
                  <Input
                    id="clinic_name"
                    name="clinic_name"
                    defaultValue={settings.clinicName}
                    placeholder={fallbackClinicSettings.clinicName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={settings.phone}
                    placeholder={fallbackClinicSettings.phone}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={settings.email}
                    placeholder={fallbackClinicSettings.email}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp_number">WhatsApp number</Label>
                  <Input
                    id="whatsapp_number"
                    name="whatsapp_number"
                    defaultValue={settings.whatsappNumber}
                    placeholder={fallbackClinicSettings.whatsappNumber}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    defaultValue={settings.address}
                    placeholder={fallbackClinicSettings.address}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_hours" className="flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  Business hours
                </Label>
                <Textarea
                  id="business_hours"
                  name="business_hours"
                  rows={3}
                  defaultValue={settings.businessHours}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency_notice" className="flex items-center gap-2">
                  <ShieldAlert className="size-4 text-amber-600" />
                  Emergency notice
                </Label>
                <Textarea
                  id="emergency_notice"
                  name="emergency_notice"
                  rows={3}
                  defaultValue={settings.emergencyNotice}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai_disclosure">AI disclosure</Label>
                <Textarea
                  id="ai_disclosure"
                  name="ai_disclosure"
                  rows={4}
                  defaultValue={settings.aiDisclosure}
                />
              </div>

              <Button type="submit">Save clinic settings</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
