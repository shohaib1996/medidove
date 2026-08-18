import {
  Activity,
  Baby,
  Brain,
  Smile,
  Stethoscope,
  Syringe,
} from "lucide-react";

export const fallbackServices = [
  {
    icon: Stethoscope,
    title: "General Medicine",
    description:
      "Primary care, regular checkups, common illness support, and patient intake routing.",
    aiUse: "AI routes general symptoms to the correct care path.",
  },
  {
    icon: Smile,
    title: "Dental Care",
    description:
      "Dental consultation, cleaning, fillings, tooth pain intake, and follow-up reminders.",
    aiUse: "AI detects dental intent from patient messages and calls.",
  },
  {
    icon: Baby,
    title: "Pediatrics",
    description:
      "Child health appointments, vaccination reminders, parent questions, and care coordination.",
    aiUse: "WhatsApp reminders can notify parents about visits.",
  },
  {
    icon: Brain,
    title: "Neurology",
    description:
      "Specialist booking requests, referral capture, and structured pre-visit notes.",
    aiUse: "AI flags urgent neurological language for staff review.",
  },
  {
    icon: Syringe,
    title: "Surgery",
    description:
      "Surgery consultation requests, preparation questions, and post-visit follow-up workflows.",
    aiUse: "Receptionist agent captures surgery-related callback tasks.",
  },
  {
    icon: Activity,
    title: "Radiology",
    description:
      "Imaging appointment requests, availability routing, and result pickup notifications.",
    aiUse: "AI assistant answers service preparation FAQs.",
  },
];

export const fallbackDoctors = [
  {
    name: "Rosalina D. Williamson",
    specialty: "General Medicine",
    department: "Primary Care",
    image: "/assets/img/team/member1.png",
    availability: "Today, 3:30 PM",
    languages: "English, Spanish",
  },
  {
    name: "Diconda Piran Will",
    specialty: "Dental Care",
    department: "Dentistry",
    image: "/assets/img/team/member2.png",
    availability: "Tomorrow, 10:00 AM",
    languages: "English",
  },
  {
    name: "Hulk M. Kenbon",
    specialty: "Neurology",
    department: "Specialist Care",
    image: "/assets/img/team/member3.png",
    availability: "Friday, 1:00 PM",
    languages: "English, French",
  },
  {
    name: "Haliam Z. Dicolaz",
    specialty: "Surgery Consultant",
    department: "Surgery",
    image: "/assets/img/team/member4.png",
    availability: "Monday, 9:30 AM",
    languages: "English",
  },
  {
    name: "Nicolas D. Case",
    specialty: "Pediatrics",
    department: "Child Care",
    image: "/assets/img/team/member5.png",
    availability: "Wednesday, 11:00 AM",
    languages: "English, Bengali",
  },
  {
    name: "Phumdon H. Norman",
    specialty: "Radiology",
    department: "Diagnostics",
    image: "/assets/img/team/member6.png",
    availability: "Thursday, 2:00 PM",
    languages: "English",
  },
];
