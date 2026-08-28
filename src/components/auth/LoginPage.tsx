import Image from "next/image";
import Link from "next/link";
import { ArrowRight, KeyRound, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import PublicHeader from "@/components/marketing/PublicHeader";
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

type LoginPageProps = {
  errorMessage?: string;
  statusMessage?: string;
};

const LoginPage = ({ errorMessage, statusMessage }: LoginPageProps) => {

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader />

      <main className="grid min-h-[calc(100vh-80px)] lg:grid-cols-[1fr_0.9fr]">
        <section className="relative hidden overflow-hidden bg-slate-950 text-white lg:block">
          <Image
            src="/assets/img/bg/appointment.jpg"
            alt="MediDove care team"
            fill
            priority
            sizes="50vw"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-slate-950/70" />
          <div className="relative flex h-full flex-col justify-end p-12">
            <Badge className="mb-5 w-fit bg-white/10 text-white">
              <ShieldCheck className="size-3.5" />
              Secure patient access
            </Badge>
            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-normal">
              Sign in to manage appointments, messages, and clinic workflows.
            </h1>
            <p className="mt-5 max-w-xl leading-7 text-slate-300">
              This secure login supports patient, doctor, receptionist, and
              admin workspaces.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-14 md:px-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardDescription>Welcome back</CardDescription>
              <CardTitle className="text-3xl">Login to MediDove</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" action="/auth/login" method="post">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <label className="flex items-center gap-2 text-slate-600">
                    <input
                      type="checkbox"
                      className="size-4 rounded border-slate-300"
                      defaultChecked
                    />
                    Remember me
                  </label>
                  <button
                    type="submit"
                    name="intent"
                    value="reset"
                    formNoValidate
                    className="font-medium text-primary hover:underline"
                  >
                    Reset password
                  </button>
                </div>

                <Button type="submit" name="intent" value="login" className="w-full" size="lg">
                  <KeyRound />
                  Login
                </Button>

                {errorMessage ? (
                  <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {errorMessage}
                  </p>
                ) : null}

                {statusMessage ? (
                  <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    {statusMessage}
                  </p>
                ) : null}

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  New to MediDove?{" "}
                  <Link href="/register" className="font-semibold text-primary">
                    Create an account
                  </Link>
                </div>

                <Button asChild variant="ghost" className="w-full">
                  <Link href="/">
                    Back to website
                    <ArrowRight />
                  </Link>
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
