import { StaticImageData } from "next/image";

import service_img_1 from "@/assets/img/services/service-icon-1.png";
import service_img_2 from "@/assets/img/services/service-icon-2.png";
import service_img_3 from "@/assets/img/services/service-icon-3.png";
import service_img_4 from "@/assets/img/services/service-icon-4.png"; 

import service_img_4_1 from "@/assets/img/home4/services/h4__services__thumb1.png"; 
import service_img_4_2 from "@/assets/img/home4/services/h4__services__thumb2.png"; 
import service_img_4_3 from "@/assets/img/home4/services/h4__services__thumb3.png"; 

import service_img_5_1 from "@/assets/img/services/service1.png";
import service_img_5_2 from "@/assets/img/services/service2.png";
import service_img_5_3 from "@/assets/img/services/service3.png";
import service_img_5_4 from "@/assets/img/services/service4.png";
import service_img_5_5 from "@/assets/img/services/service5.png";
import service_img_5_6 from "@/assets/img/services/service6.png";

interface ServciesDataType {
  id: number;
  img: StaticImageData;
  sub_title?: string;
  title: string;
  sm_des: string;
  service?: boolean;
}[]

const servcies_data: ServciesDataType[] = [
  {
    id: 1,
    img: service_img_1,
    sub_title: "Primary care",
    title: "General Medicine",
    sm_des: "Routine checkups, common illness visits, follow-up coordination, and AI-assisted intake routing for the right care team.",
  },
  {
    id: 2,
    img: service_img_2,
    sub_title: "Diagnostics",
    title: "Radiology Requests",
    sm_des: "Imaging appointment requests, preparation guidance, result pickup reminders, and staff-reviewed diagnostic scheduling.",
  },
  {
    id: 3,
    img: service_img_3,
    sub_title: "Family care",
    title: "Pediatrics",
    sm_des: "Child health appointments, vaccination reminders, parent questions, and structured handoff notes for clinic staff.",
  },
  {
    id: 4,
    img: service_img_4,
    sub_title: "Dental",
    title: "Dental Care",
    sm_des: "Dental consultation requests, cleaning reminders, tooth pain routing, and consent-based follow-up through WhatsApp or phone.",
  },
  // home 04 
  {
    id: 1,
    img: service_img_4_1,
    sub_title: "surgery",
    title: "Surgery Consults",
    sm_des: "Capture surgical consultation requests and prepare callback tasks for a human care coordinator.",
  },
  {
    id: 2,
    img: service_img_4_2,
    sub_title: "dental",
    title: "Dental Fillings",
    sm_des: "Route dental concerns to the right provider and remind patients about approved follow-up steps.",
  },
  {
    id: 3,
    img: service_img_4_3,
    sub_title: "neurology",
    title: "Neurology Routing",
    sm_des: "Flag urgent language, collect structured notes, and route specialist requests for staff review.",
  },
  {
    id: 4,
    img: service_img_4_3,
    sub_title: "neurology",
    title: "Specialist Follow-up",
    sm_des: "Coordinate post-visit outreach, callback requests, and patient reminders from one workflow.",
  },
  // service data 
  {
    id: 1,
    img: service_img_5_1,
    service: true,
    title: "General Medicine",
    sm_des: "Primary care booking with AI-assisted intake summaries and staff-reviewed appointment routing.",
  },
  {
    id: 2,
    img: service_img_5_2,
    service: true,
    title: "Dental Care",
    sm_des: "Dental appointment requests, cleaning recall reminders, and WhatsApp confirmation workflows.",
  },
  {
    id: 3,
    img: service_img_5_3,
    service: true,
    title: "Pediatrics",
    sm_des: "Parent-friendly booking, vaccination reminders, and child care routing with admin notes.",
  },
  {
    id: 4,
    img: service_img_5_4,
    service: true,
    title: "Neurology",
    sm_des: "Specialist request capture with urgent-language flags and receptionist handoff support.",
  },
  {
    id: 5,
    img: service_img_5_5,
    service: true,
    title: "Surgery",
    sm_des: "Consultation requests, preparation questions, and follow-up tasks for the clinic team.",
  },
  {
    id: 6,
    img: service_img_5_6,
    service: true,
    title: "Radiology",
    sm_des: "Imaging appointments, diagnostic scheduling, and result pickup reminders for opted-in patients.",
  },


]
export default servcies_data
