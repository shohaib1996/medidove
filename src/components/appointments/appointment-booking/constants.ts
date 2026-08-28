import { Bot, Headphones, MessageCircle } from "lucide-react";
import type { AppointmentForm } from "./types";

export const initialForm: AppointmentForm = {
  patientName: "",
  patientEmail: "",
  patientPhone: "",
  requestedDepartment: "General Medicine",
  requestedDoctor: "First available doctor",
  doctorId: "",
  requestedDate: "",
  requestedTime: "",
  reason: "",
  consentAccepted: false,
};

export const supportCards = [
  {
    icon: Bot,
    title: "Smart intake support",
    text: "Patient requests can be organized into clear appointment notes while safety rules stay available as fallback.",
  },
  {
    icon: Headphones,
    title: "Receptionist handoff",
    text: "Requests can be created from web forms or reception calls and reviewed by clinic staff.",
  },
  {
    icon: MessageCircle,
    title: "Reminder consent",
    text: "The consent field helps the clinic send appointment confirmations and reminders responsibly.",
  },
];
