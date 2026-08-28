import Image from "next/image";
import Link from "next/link";
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

type RegisterPageProps = {
  errorMessage?: string;
};

const RegisterPage = ({ errorMessage }: RegisterPageProps) => {

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
              <form className="space-y-5" action="/auth/register" method="post">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

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
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    minLength={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Sparkles />
                  Register
                </Button>

                {errorMessage ? (
                  <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {errorMessage}
                  </p>
                ) : null}

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
              Secure patient profile
            </Badge>
            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-normal">
              Patient accounts are the base for appointments, reminders, and
              care history.
            </h1>
            <p className="mt-5 max-w-xl leading-7 text-slate-300">
              New users receive a patient profile for appointments, reminders,
              messages, and portal access.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RegisterPage;
