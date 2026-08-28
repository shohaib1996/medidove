import Image from "next/image";
import { CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AppointmentHero = () => (
  <section className="relative overflow-hidden bg-slate-950 px-4 py-20 text-white md:px-8">
    <Image
      src="/assets/img/appoinment/appointment-bg.jpg"
      alt="Clinic appointment desk"
      fill
      priority
      sizes="100vw"
      className="object-cover opacity-25"
    />
    <div className="absolute inset-0 bg-slate-950/70" />
    <div className="relative mx-auto max-w-7xl">
      <Badge className="mb-5 bg-white/10 text-white hover:bg-white/15">
        <CalendarCheck className="size-3.5" />
        Online booking
      </Badge>
      <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-normal md:text-6xl">
        Book a smarter appointment with MediDove
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
        Submit a structured request for the clinic team. Your reason for visit
        helps reception prepare the right department, doctor preference, and
        follow-up details.
      </p>
    </div>
  </section>
);

export default AppointmentHero;
