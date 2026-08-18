import Link from "next/link";
import { FileText, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PublicHeader from "@/components/marketing/PublicHeader";

export const metadata = {
  title: "Terms of Use | MediDove",
  description:
    "Terms of use for the MediDove AI clinic demo, including AI safety, communication consent, and demo limitations.",
};

const terms = [
  {
    title: "Administrative support only",
    body: "MediDove helps clinics manage appointments, messages, reminders, feedback, receptionist workflows, and staff tasks. It is not a medical device and does not provide diagnosis or treatment.",
  },
  {
    title: "Emergency symptoms",
    body: "Patients should not rely on this website, chatbot, WhatsApp, SMS, email, or AI voice assistant for emergencies. Emergency symptoms require local emergency services or the nearest emergency department.",
  },
  {
    title: "AI review",
    body: "AI-generated summaries, routing suggestions, scripts, and campaign copy are draft assistance. Clinics are responsible for reviewing outputs before using them in real care workflows.",
  },
  {
    title: "Communication rules",
    body: "Outbound calls, SMS, WhatsApp, and email campaigns must follow patient consent, opt-out, template approval, and local communication laws. Cold healthcare marketing is not supported by this demo.",
  },
  {
    title: "Production compliance",
    body: "A real deployment may require HIPAA, BAA agreements, call recording notices, data retention policies, staff access controls, and vendor-specific healthcare compliance review.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicHeader />
      <main>
        <section className="bg-slate-950 px-4 py-20 text-white md:px-8">
          <div className="mx-auto max-w-5xl">
            <Badge className="mb-6 bg-white/10 text-white">
              <FileText className="size-3.5" />
              Terms and limitations
            </Badge>
            <h1 className="text-4xl font-bold tracking-normal md:text-5xl">
              Terms of Use
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              These terms clarify the safe use boundaries for the MediDove AI
              clinic demo and its patient engagement workflows.
            </p>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8">
          <div className="mx-auto grid max-w-5xl gap-5">
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardDescription>Important safety notice</CardDescription>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="size-5 text-amber-700" />
                  This platform does not replace clinical care
                </CardTitle>
              </CardHeader>
              <CardContent className="leading-7 text-amber-950">
                MediDove can support booking, triage routing, communication, and
                staff operations, but licensed professionals remain responsible
                for patient care decisions.
              </CardContent>
            </Card>

            {terms.map((term) => (
              <Card key={term.title}>
                <CardHeader>
                  <CardTitle>{term.title}</CardTitle>
                </CardHeader>
                <CardContent className="leading-7 text-slate-600">
                  {term.body}
                </CardContent>
              </Card>
            ))}

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button asChild>
                <Link href="/contact">Contact clinic</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/privacy">View privacy policy</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
