"use client";

import { FormEvent, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  getMatchingAvailability,
  getSelectedDateWeekday,
  getSlotTimes,
} from "./availability";
import { initialForm } from "./constants";
import type {
  AppointmentBookingOptions,
  AppointmentForm,
  IntakeResult,
} from "./types";

const getResolvedInitialForm = (
  bookingOptions: AppointmentBookingOptions,
): AppointmentForm => ({
  ...initialForm,
  requestedDepartment:
    bookingOptions.departments[0]?.value || initialForm.requestedDepartment,
  requestedDoctor:
    bookingOptions.doctors[0]?.value || initialForm.requestedDoctor,
  doctorId: bookingOptions.doctors[0]?.id || "",
});

export const useAppointmentBooking = (
  bookingOptions: AppointmentBookingOptions,
) => {
  const resolvedInitialForm = useMemo(
    () => getResolvedInitialForm(bookingOptions),
    [bookingOptions],
  );
  const [form, setForm] = useState<AppointmentForm>(resolvedInitialForm);
  const [intakeResult, setIntakeResult] = useState<IntakeResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const updateField = <Key extends keyof AppointmentForm>(
    key: Key,
    value: AppointmentForm[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleDoctorChange = (doctorValue: string) => {
    const selected = bookingOptions.doctors.find(
      (doctor) => doctor.value === doctorValue,
    );

    setForm((current) => ({
      ...current,
      requestedDoctor: doctorValue,
      doctorId: selected?.id || "",
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.patientName || !form.patientPhone || !form.reason) {
      toast.error("Name, phone, and appointment reason are required.");
      return;
    }

    if (!form.consentAccepted) {
      toast.error("Please accept communication consent before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          aiSummary: intakeResult?.summary,
          urgency: intakeResult?.urgency,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to submit appointment.");
      }

      toast.success("Appointment request submitted successfully.");
      setForm(resolvedInitialForm);
      setIntakeResult(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to submit appointment.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDateWeekday = useMemo(
    () => getSelectedDateWeekday(form.requestedDate),
    [form.requestedDate],
  );

  const matchingAvailability = useMemo(
    () =>
      getMatchingAvailability({
        availability: bookingOptions.availability,
        doctorId: form.doctorId,
        weekday: selectedDateWeekday,
      }),
    [bookingOptions.availability, form.doctorId, selectedDateWeekday],
  );

  const slotTimes = useMemo(
    () => getSlotTimes(matchingAvailability),
    [matchingAvailability],
  );

  const handleSmartIntake = async () => {
    if (form.reason.trim().length < 10) {
      toast.error("Describe the appointment reason first.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/ai/intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: form.reason }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to analyze request.");
      }

      const intake = result as IntakeResult;
      setIntakeResult(intake);

      if (intake.urgency !== "urgent") {
        updateField("requestedDepartment", intake.suggestedDepartment);
        updateField("requestedDoctor", intake.suggestedDoctor);
      }

      toast.success("Smart intake suggestion is ready.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to analyze request.";
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    form,
    intakeResult,
    isAnalyzing,
    isSubmitting,
    slotTimes,
    updateField,
    handleDoctorChange,
    handleSmartIntake,
    handleSubmit,
  };
};
