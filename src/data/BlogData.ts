import { StaticImageData } from "next/image";

import blog_thumb_1 from "@/assets/img/blog/news-thumb-1.jpg";
import blog_thumb_2 from "@/assets/img/blog/news-thumb-2.jpg";
import blog_thumb_3 from "@/assets/img/blog/news-thumb-3.jpg";

import blog_thumb_4_1 from "@/assets/img/blog/news-thumb-4.jpg";
import blog_thumb_4_2 from "@/assets/img/blog/news-thumb-5.jpg";
import blog_thumb_4_3 from "@/assets/img/blog/news-thumb-6.jpg";

type BlogDataItem = {
  id: number;
  img: StaticImageData;
  tag_1?: string;
  tag_2?: string;
  title: string;
  sm_des: string;
  home_3_serive_2?: boolean;
};


const blog_data: BlogDataItem[] = [
  {
    id: 1,
    img: blog_thumb_1,
    tag_1: "Care",
    tag_2: "Receptionist",
    title: "How virtual reception reduces missed clinic calls",
    sm_des: "See how voice intake, call summaries, and staff handoffs help clinics recover more appointment opportunities.",    
  },
  {
    id: 2,
    img: blog_thumb_2,
    tag_1: "Reminders",
    tag_2: "Outreach",
    title: "Building consent-aware patient reminder flows",
    sm_des: "A practical look at opt-ins, unsubscribe handling, and automated reminders for healthcare marketing teams.",    
  },
  {
    id: 3,
    img: blog_thumb_3,
    tag_1: "Clinic",
    tag_2: "Operations",
    title: "Why clinics need one patient support dashboard",
    sm_des: "Appointments, leads, calls, tasks, and campaigns become easier to manage when the data is connected.",    
  },
  // home 03
  {
    id: 4,
    img: blog_thumb_1,
    home_3_serive_2: true,
    title: "Urgency-aware intake",
    sm_des: "Route high-priority symptoms to human review while keeping routine requests organized for staff.",    
  },
  {
    id: 5,
    img: blog_thumb_2,
    home_3_serive_2: true,
    title: "Voice notes to care tasks",
    sm_des: "Turn reception conversations into structured follow-up work for the front desk team.",    
  },
  {
    id: 6,
    img: blog_thumb_3,
    home_3_serive_2: true,
    title: "Campaign copy with guardrails",
    sm_des: "Generate useful outreach messages without making unsafe claims or bypassing consent rules.",    
  },
   // home 03 bottom
   {
    id: 7,
    img: blog_thumb_4_1,
    home_3_serive_2: true,
    tag_1: "Care",
    tag_2: "Search",
    title: "Making clinic content easier to discover",
    sm_des: "Semantic search helps patients find doctors, services, and next steps even when they use natural language.",    
  },
  {
    id: 8,
    img: blog_thumb_4_2,
    home_3_serive_2: true,
    tag_1: "Tasks",
    tag_2: "Workflow",
    title: "Automating daily patient follow-up work",
    sm_des: "Use scheduled rules to create reminders, callback tasks, and outreach queues from patient activity.",    
  },
  {
    id: 9,
    img: blog_thumb_4_3,
    home_3_serive_2: true,
    tag_1: "Audit",
    tag_2: "Compliance",
    title: "Tracking automation decisions for clinic teams",
    sm_des: "Review logs make it easier to explain what was sent, who reviewed it, and what happened next.",    
  },
]
export default blog_data
