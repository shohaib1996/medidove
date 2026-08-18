"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
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
import { createClient } from "@/lib/supabase/client";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success("Login successful.");
      router.refresh();
      router.push("/portal");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to log in.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Enter your email address first.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password reset email sent.");
  };

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
              Supabase protected access
            </Badge>
            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-normal">
              Sign in to manage appointments, leads, and AI clinic workflows.
            </h1>
            <p className="mt-5 max-w-xl leading-7 text-slate-300">
              This login connects to Supabase Auth and prepares the platform for
              patient, admin, doctor, and receptionist roles.
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
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter password"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <label className="flex items-center gap-2 text-slate-600">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(event) => setRemember(event.target.checked)}
                      className="size-4 rounded border-slate-300"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="font-medium text-primary hover:underline"
                  >
                    Reset password
                  </button>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  <KeyRound />
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>

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

      <ToastContainer />
    </div>
  );
};

export default LoginPage;
