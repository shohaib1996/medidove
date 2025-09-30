import { StaticImageData } from "next/image";

import blog_thumb_1 from "@/assets/img/blog/news-thumb-1.jpg";
import blog_thumb_2 from "@/assets/img/blog/news-thumb-2.jpg";
import blog_thumb_3 from "@/assets/img/blog/news-thumb-3.jpg";

import blog_thumb_4_1 from "@/assets/img/blog/news-thumb-4.jpg";
import blog_thumb_4_2 from "@/assets/img/blog/news-thumb-5.jpg";
import blog_thumb_4_3 from "@/assets/img/blog/news-thumb-6.jpg";

interface BlogDataType {
  id: number;
  img: StaticImageData;
  tag_1?: string;
  tag_2?: string;
  title: string;
  sm_des: string;
  home_3_serive_2?: boolean;
}[]


const blog_data: BlogDataType[] = [
  {
    id: 1,
    img: blog_thumb_1,
    tag_1: "Medical",
    tag_2: "Medicine",
    title: "Ectetur ipsum dolor sit met, cons lorem.",
    sm_des: "Adipisicing lorem ipsum dolor sit amet, consectet elit, sed do eiusmod tem incididunt ut labore et dolore.",    
  },
  {
    id: 2,
    img: blog_thumb_2,
    tag_1: "Medical",
    tag_2: "Medicine",
    title: "Ectetur ipsum dolor sit met, cons lorem.",
    sm_des: "Adipisicing lorem ipsum dolor sit amet, consectet elit, sed do eiusmod tem incididunt ut labore et dolore.",    
  },
  {
    id: 3,
    img: blog_thumb_3,
    tag_1: "Medical",
    tag_2: "Medicine",
    title: "Ectetur ipsum dolor sit met, cons lorem.",
    sm_des: "Adipisicing lorem ipsum dolor sit amet, consectet elit, sed do eiusmod tem incididunt ut labore et dolore.",    
  },
  // home 03
  {
    id: 1,
    img: blog_thumb_1,
    home_3_serive_2: true,
    title: "Body Surgery",
    sm_des: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",    
  },
  {
    id: 2,
    img: blog_thumb_2,
    home_3_serive_2: true,
    title: "Neurology Sargery",
    sm_des: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",    
  },
  {
    id: 3,
    img: blog_thumb_3,
    home_3_serive_2: true,
    title: "Blood Cancer",
    sm_des: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",    
  },
   // home 03 bottom
   {
    id: 1,
    img: blog_thumb_4_1,
    home_3_serive_2: true,
    tag_1: "Medical",
    tag_2: "Medicine",
    title: "Ectetur ipsum dolor sit met, cons lorem.",
    sm_des: "Adipisicing lorem ipsum dolor sit amet, consectet elit, sed do eiusmod tem incididunt ut labore et dolore.",    
  },
  {
    id: 2,
    img: blog_thumb_4_2,
    home_3_serive_2: true,
    tag_1: "Medical",
    tag_2: "Medicine",
    title: "Ectetur ipsum dolor sit met, cons lorem.",
    sm_des: "Adipisicing lorem ipsum dolor sit amet, consectet elit, sed do eiusmod tem incididunt ut labore et dolore.",    
  },
  {
    id: 3,
    img: blog_thumb_4_3,
    home_3_serive_2: true,
    tag_1: "Medical",
    tag_2: "Medicine",
    title: "Ectetur ipsum dolor sit met, cons lorem.",
    sm_des: "Adipisicing lorem ipsum dolor sit amet, consectet elit, sed do eiusmod tem incididunt ut labore et dolore.",    
  },
]
export default blog_data