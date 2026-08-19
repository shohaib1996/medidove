

import thumb_1 from "@/assets/img/home4/news/blog__thumb1.png"; 
import admin_1 from "@/assets/img/home4/news/news-admin1.png";  
import { StaticImageData } from "next/image";

type NewsDataItem = {
  id: number;
  home: number;
  img: StaticImageData;
  admin: StaticImageData;
  name: string;
  time: string;
  tag_1: string;
  tag_2: string;
  title: string;
  description: string;
};

const news_data: NewsDataItem[] = [
  {
    id: 1, 
    home: 4,
    img: thumb_1,
    admin: admin_1,
    name: "MediDove Team",
    time: "12 August 2026",
    tag_1: "AI",
    tag_2: "Voice",
    title: "AI receptionist handoffs for busy clinics",
    description: "Voice conversations can become structured call logs, summaries, and callback tasks so staff can move faster after every patient call.",
  },
  {
    id: 2, 
    home: 4,
    img: thumb_1,
    admin: admin_1,
    name: "MediDove Team",
    time: "14 August 2026",
    tag_1: "Supabase",
    tag_2: "Workflow",
    title: "Connecting appointments, leads, and tasks",
    description: "A shared operations backend gives clinics one place to review appointment requests, contact leads, automation activity, and staff follow-ups.",
  },
  {
    id: 3, 
    home: 4,
    img: thumb_1,
    admin: admin_1,
    name: "MediDove Team",
    time: "18 August 2026",
    tag_1: "Marketing",
    tag_2: "Consent",
    title: "Patient outreach that respects opt-in status",
    description: "Reminder and recall campaigns work best when every outbound message checks patient preferences before dispatch.",
  },
]
export default news_data
