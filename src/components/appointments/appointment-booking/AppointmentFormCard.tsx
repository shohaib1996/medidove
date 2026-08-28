import Link from "next/link";
import type { FormEvent } from "react";
import { CalendarCheck, Phone } from "lucide-react";
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
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import AvailabilitySlotsCard from "./AvailabilitySlotsCard";
import SmartIntakeCard from "./SmartIntakeCard";
import type {
  AppointmentBookingOptions,
  AppointmentFieldUpdater,
  AppointmentForm,
  IntakeResult,
  SlotTime,
} from "./types";

type AppointmentFormCardProps = {
  bookingOptions: AppointmentBookingOptions;
  form: AppointmentForm;
  intakeResult: IntakeResult | null;
  isAnalyzing: boolean;
  isSubmitting: boolean;
  slotTimes: SlotTime[];
  updateField: AppointmentFieldUpdater;
  onDoctorChange: (doctorValue: string) => void;
  onAnalyze: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const AppointmentFormCard = ({
  bookingOptions,
  form,
  intakeResult,
  isAnalyzing,
  isSubmitting,
  slotTimes,
  updateField,
  onDoctorChange,
  onAnalyze,
  onSubmit,
}: AppointmentFormCardProps) => (
  <Card>
    <CardHeader>
      <CardDescription>Appointment Request</CardDescription>
      <CardTitle className="text-2xl">Patient details</CardTitle>
    </CardHeader>
    <CardContent>
      <form className="grid gap-5" onSubmit={onSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="patientName">Full name</Label>
            <Input
              id="patientName"
              value={form.patientName}
              onChange={(event) =>
                updateField("patientName", event.target.value)
              }
              placeholder="Enter patient name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientEmail">Email</Label>
            <Input
              id="patientEmail"
              type="email"
              value={form.patientEmail}
              onChange={(event) =>
                updateField("patientEmail", event.target.value)
              }
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientPhone">Phone</Label>
            <Input
              id="patientPhone"
              type="tel"
              value={form.patientPhone}
              onChange={(event) =>
                updateField("patientPhone", event.target.value)
              }
              placeholder="+1 555 000 0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requestedDepartment">Department</Label>
            <Select
              id="requestedDepartment"
              value={form.requestedDepartment}
              onChange={(event) =>
                updateField("requestedDepartment", event.target.value)
              }
            >
              {bookingOptions.departments.map((department) => (
                <option key={department.value} value={department.value}>
                  {department.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requestedDoctor">Doctor preference</Label>
            <Select
              id="requestedDoctor"
              value={form.requestedDoctor}
              onChange={(event) => onDoctorChange(event.target.value)}
            >
              {bookingOptions.doctors.map((doctor) => (
                <option key={doctor.value} value={doctor.value}>
                  {doctor.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="requestedDate">Date</Label>
              <Input
                id="requestedDate"
                type="date"
                value={form.requestedDate}
                onChange={(event) =>
                  updateField("requestedDate", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requestedTime">Time</Label>
              <Input
                id="requestedTime"
                type="time"
                value={form.requestedTime}
                onChange={(event) =>
                  updateField("requestedTime", event.target.value)
                }
              />
            </div>
          </div>
        </div>

        <AvailabilitySlotsCard
          form={form}
          slotTimes={slotTimes}
          updateField={updateField}
        />

        <div className="space-y-2">
          <Label htmlFor="reason">Reason for visit</Label>
          <Textarea
            id="reason"
            value={form.reason}
            onChange={(event) => updateField("reason", event.target.value)}
            placeholder="Tell us what kind of care you need. Do not include emergency details here; call emergency services for urgent symptoms."
            rows={6}
          />
        </div>

        <SmartIntakeCard
          intakeResult={intakeResult}
          isAnalyzing={isAnalyzing}
          onAnalyze={onAnalyze}
        />

        <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={form.consentAccepted}
            onChange={(event) =>
              updateField("consentAccepted", event.target.checked)
            }
            className="mt-1 size-4 rounded border-slate-300"
          />
          <span>
            I agree to be contacted about this appointment by phone, email, SMS,
            or WhatsApp.
          </span>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            <CalendarCheck />
            {isSubmitting ? "Submitting..." : "Submit request"}
          </Button>
          <Button asChild type="button" variant="outline" size="lg">
            <Link href="/contact">
              <Phone />
              Contact first
            </Link>
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
);

export default AppointmentFormCard;
