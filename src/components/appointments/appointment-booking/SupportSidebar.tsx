import { ShieldCheck, Stethoscope } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supportCards } from "./constants";

const SupportSidebar = () => (
  <aside className="space-y-5">
    <Card>
      <CardHeader>
        <CardDescription>Emergency note</CardDescription>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" />
          Safety first
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-6 text-slate-600">
        This form is for appointment requests only. For chest pain, severe
        breathing trouble, stroke symptoms, heavy bleeding, or loss of
        consciousness, contact emergency services immediately.
      </CardContent>
    </Card>

    {supportCards.map((card) => (
      <Card key={card.title}>
        <CardHeader>
          <card.icon className="size-7 text-primary" />
          <CardTitle className="text-lg">{card.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="leading-6">{card.text}</CardDescription>
        </CardContent>
      </Card>
    ))}

    <Card className="bg-slate-950 text-white">
      <CardHeader>
        <CardDescription className="text-slate-300">
          Intake support
        </CardDescription>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="size-5 text-primary" />
          Smart routing
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-6 text-slate-300">
        The care request is reviewed for department fit, doctor type, urgency,
        and staff notes without making diagnosis claims.
      </CardContent>
    </Card>
  </aside>
);

export default SupportSidebar;
