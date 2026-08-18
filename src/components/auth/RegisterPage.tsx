"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { ArrowRight, Mail, ShieldCheck, Sparkles, UserRound } from "lucide-react";
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

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !email || !password) {
      toast.error("Name, email, and password are required.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      toast.success("Account created. Check your email if confirmation is enabled.");
      router.refresh();
      router.push("/login");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to create account.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader />

      <main className="grid min-h-[calc(100vh-80px)] lg:grid-cols-[0.9fr_1fr]">
        <section className="flex items-center justify-center px-4 py-14 md:px-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardDescription>Patient access</CardDescription>
              <CardTitle className="text-3xl">Create your account</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter your full name"
                      className="pl-10"
                    />
                  </div>
                </div>

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
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimum 6 characters"
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  <Sparkles />
                  {isSubmitting ? "Creating account..." : "Register"}
                </Button>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Already registered?{" "}
                  <Link href="/login" className="font-semibold text-primary">
                    Login here
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

        <section className="relative hidden overflow-hidden bg-slate-950 text-white lg:block">
          <Image
            src="/assets/img/slider/slider-bg-2.jpg"
            alt="Clinic patient support"
            fill
            priority
            sizes="50vw"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-slate-950/70" />
          <div className="relative flex h-full flex-col justify-end p-12">
            <Badge className="mb-5 w-fit bg-white/10 text-white">
              <ShieldCheck className="size-3.5" />
              Role-based Supabase profile
            </Badge>
            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-normal">
              Patient accounts are the base for appointments, reminders, and AI
              chat history.
            </h1>
            <p className="mt-5 max-w-xl leading-7 text-slate-300">
              New users are created through Supabase Auth and receive a patient
              profile row automatically through the database trigger.
            </p>
          </div>
        </section>
      </main>

      <ToastContainer />
    </div>
  );
};

export default RegisterPage;
