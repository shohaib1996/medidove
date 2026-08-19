

import gallery_thumb_1 from "@/assets/img/home5/gallery/gallery__thumb1.jpg";
import gallery_thumb_2 from "@/assets/img/home5/gallery/gallery__thumb2.jpg";
import gallery_thumb_3 from "@/assets/img/home5/gallery/gallery__thumb3.jpg";
import gallery_thumb_4 from "@/assets/img/home5/gallery/gallery__thumb4.jpg";
import gallery_thumb_5 from "@/assets/img/home5/gallery/gallery__thumb5.jpg";
import gallery_thumb_6 from "@/assets/img/home5/gallery/gallery__thumb6.jpg"; 
import { StaticImageData } from "next/image";


type PhotoGalleryItem = {
  id: number;
  img: StaticImageData;
  category: string;
  title: string;
  tag_1: string;
  tag_2: string;
};


const photo_gallery_data: PhotoGalleryItem[] = [
  {
    id: 1, 
    img: gallery_thumb_1,
    category: "Intake",
    title: "Smart symptom intake",
    tag_1: "AI",
    tag_2: "Triage",
  },
  {
    id: 2, 
    img: gallery_thumb_2,
    category: "Voice",
    title: "AI receptionist call flow",
    tag_1: "Voice",
    tag_2: "ElevenLabs",
  },
  {
    id: 3, 
    img: gallery_thumb_3,
    category: "Admin",
    title: "Appointment review board",
    tag_1: "Supabase",
    tag_2: "Bookings",
  },
  {
    id: 4, 
    img: gallery_thumb_4,
    category: "Campaigns",
    title: "Consent-based outreach",
    tag_1: "SMS",
    tag_2: "WhatsApp",
  },
  {
    id: 5, 
    img: gallery_thumb_5,
    category: "Search",
    title: "Semantic care search",
    tag_1: "OpenAI",
    tag_2: "Content",
  },
  {
    id: 6, 
    img: gallery_thumb_6,
    category: "Follow-up",
    title: "Automated patient follow-up",
    tag_1: "Tasks",
    tag_2: "Care",
  },
  {
    id: 7, 
    img: gallery_thumb_1,
    category: "Voice",
    title: "Call transcript summaries",
    tag_1: "Twilio",
    tag_2: "Logs",
  },
  {
    id: 8, 
    img: gallery_thumb_2,
    category: "Admin",
    title: "Lead and contact pipeline",
    tag_1: "CRM",
    tag_2: "Staff",
  },
  {
    id: 9, 
    img: gallery_thumb_3,
    category: "Campaigns",
    title: "Recall campaign builder",
    tag_1: "Copy",
    tag_2: "AI",
  },
  {
    id: 10, 
    img: gallery_thumb_4,
    category: "Intake",
    title: "Urgency-aware routing",
    tag_1: "Safety",
    tag_2: "Rules",
  },
  {
    id: 11, 
    img: gallery_thumb_5,
    category: "Search",
    title: "Service discovery assistant",
    tag_1: "Chat",
    tag_2: "Search",
  },
  {
    id: 12, 
    img: gallery_thumb_6,
    category: "Follow-up",
    title: "Staff handoff queue",
    tag_1: "Audit",
    tag_2: "Care",
  },
]
export default photo_gallery_data
