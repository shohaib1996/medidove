import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  KeyRound,
  PlugZap,
  ShieldAlert,
  Workflow,
  XCircle,
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
import { getIntegrationStatuses } from "@/lib/integrations/health";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Integrations | MediDove Admin",
};

export default async function AdminIntegrationsPage() {
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

  const integrations = getIntegrationStatuses();
  const configured = integrations.filter((item) => item.configured).length;
  const missing = integrations.length - configured;
  const categories = new Set(integrations.map((item) => item.category)).size;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="flex flex-col justify-between gap-4 rounded-lg border bg-white p-6 shadow-sm lg:flex-row lg:items-center">
          <div>
            <Badge variant="secondary">Integration Health</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Provider readiness
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Check which environment variables are configured for database,
              voice, messaging, email, and background automation workflows.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin">Back to dashboard</Link>
          </Button>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Configured</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{configured}</p>
              <p className="text-xs text-slate-500">Ready integrations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Needs Setup</CardTitle>
              <ShieldAlert className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{missing}</p>
              <p className="text-xs text-slate-500">Missing env configuration</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Workflow className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{categories}</p>
              <p className="text-xs text-slate-500">Operational areas covered</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {integrations.map((integration) => (
            <Card key={integration.name}>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardDescription>{integration.category}</CardDescription>
                    <CardTitle className="mt-2 flex items-center gap-2 text-xl">
                      <PlugZap className="h-5 w-5 text-primary" />
                      {integration.name}
                    </CardTitle>
                  </div>
                  <Badge variant={integration.configured ? "default" : "destructive"}>
                    {integration.configured ? "Ready" : "Missing keys"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-slate-600">
                  {integration.workflow}
                </p>
                <div className="grid gap-2">
                  {integration.requiredKeys.map((key) => {
                    const missingKey = integration.missingKeys.includes(key);

                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <KeyRound className="h-4 w-4 shrink-0 text-slate-400" />
                          <span className="break-all font-mono text-xs">{key}</span>
                        </span>
                        {missingKey ? (
                          <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={integration.href}>Open workflow</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
