
import { StaticImageData } from "next/image";
import avatar_img_1 from "@/assets/img/icon/tesit-author-icon-1.png";
import avatar_img_2 from "@/assets/img/icon/tesit-author-icon-2.png"; 

import avatar_img_4_1 from "@/assets/img/home4/testimonials/author-icon1.png"; 
import avatar_img_4_2 from "@/assets/img/home4/testimonials/author-icon2.png"; 
import avatar_img_4_3 from "@/assets/img/home4/testimonials/author-icon3.png"; 

type TestimonialItem = {
  id: number;
  home?: number;
  title?: string;
  description: string;
  img: StaticImageData;
  name: string;
  job_title: string;
};


const testimonials_data: TestimonialItem[] = [
  {
    id: 1,
    title: "The intake flow makes patient requests easier to review.",
    description: "MediDove turns appointment reasons into structured notes, suggested departments, and clear next steps before the request reaches our team.",
    img: avatar_img_1,
    name: "Sarah Mitchell",
    job_title: "Clinic Operations Lead",
  },
  {
    id: 2,
    title: "The AI receptionist concept is easy to demo to stakeholders.",
    description: "Call logs, summaries, and follow-up tasks show exactly how voice automation can support front desk teams without replacing clinical judgment.",
    img: avatar_img_2,
    name: "David Rahman",
    job_title: "Digital Health Founder",
  },
  {
    id: 3,
    title: "The admin dashboard connects the clinic workflow.",
    description: "Appointments, leads, conversations, campaigns, and audit history are visible in one place, which makes the demo feel like a real platform.",
    img: avatar_img_1,
    name: "Maya Chen",
    job_title: "Healthcare Product Manager",
  },
  {
    id: 4,
    title: "Consent-aware marketing is a strong buyer feature.",
    description: "The campaign tools make it clear which patients can receive reminders and how outreach should be reviewed before dispatch.",
    img: avatar_img_1,
    name: "Alicia Morgan",
    job_title: "Patient Engagement Director",
  },
  {
    id: 5,
    title: "The assistant gives patients a safer starting point.",
    description: "It helps visitors find departments and booking options while reminding them that emergency symptoms need urgent care.",
    img: avatar_img_2,
    name: "Omar Siddiqui",
    job_title: "Telehealth Consultant",
  },
  {
    id: 6,
    title: "It shows the right technical stack for a modern clinic app.",
    description: "Next.js, Supabase, OpenAI, ElevenLabs, Twilio, and WhatsApp integrations are tied together in a way buyers can understand quickly.",
    img: avatar_img_1,
    name: "Nadia Brooks",
    job_title: "SaaS Delivery Lead",
  },

  // home 04 
  {
    id: 7, 
    home: 4,
    description: "The voice receptionist records useful summaries and callback tasks, so missed calls no longer disappear from the workflow.",
    img: avatar_img_4_1,
    name: "Helen Powell",
    job_title: "Practice Manager",
  },
  {
    id: 8, 
    home: 4,
    description: "The appointment board and smart intake summary give staff the context they need before confirming a booking.",
    img: avatar_img_4_2,
    name: "Eric Patel",
    job_title: "Clinic Administrator",
  },
  {
    id: 9, 
    home: 4,
    description: "Campaign drafts, opt-out checks, and audit logs make patient engagement feel controlled instead of risky.",
    img: avatar_img_4_3,
    name: "Rachel Adams",
    job_title: "Growth Lead",
  },
  {
    id: 10, 
    home: 4,
    description: "The demo covers real buyer needs: booking, communication, lead follow-up, and AI-assisted clinic operations.",
    img: avatar_img_4_1,
    name: "Chris Bennett",
    job_title: "Healthcare SaaS Advisor",
  },

]
export default testimonials_data
