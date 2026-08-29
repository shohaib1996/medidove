"use client";

import PublicHeader from "@/components/marketing/PublicHeader";
import AppointmentFormCard from "./appointment-booking/AppointmentFormCard";
import AppointmentHero from "./appointment-booking/AppointmentHero";
import SupportSidebar from "./appointment-booking/SupportSidebar";
import { useAppointmentBooking } from "./appointment-booking/useAppointmentBooking";
import type { AppointmentBookingOptions } from "./appointment-booking/types";

const AppointmentBookingPage = ({
  bookingOptions,
}: {
  bookingOptions: AppointmentBookingOptions;
}) => {
  const {
    form,
    intakeResult,
    isAnalyzing,
    isSubmitting,
    slotTimes,
    updateField,
    handleDoctorChange,
    handleSmartIntake,
    handleSubmit,
  } = useAppointmentBooking(bookingOptions);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader />

      <main>
        <AppointmentHero />

        <section className="px-4 py-16 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_380px]">
            <AppointmentFormCard
              bookingOptions={bookingOptions}
              form={form}
              intakeResult={intakeResult}
              isAnalyzing={isAnalyzing}
              isSubmitting={isSubmitting}
              slotTimes={slotTimes}
              updateField={updateField}
              onDoctorChange={handleDoctorChange}
              onAnalyze={handleSmartIntake}
              onSubmit={handleSubmit}
            />

            <SupportSidebar />
          </div>
        </section>
      </main>
    </div>
  );
};

export default AppointmentBookingPage;
