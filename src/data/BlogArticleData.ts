

import blog_img_1 from '@/assets/img/blog/b1.jpg';
import blog_img_2 from '@/assets/img/blog/b6.jpg'; 

import slider_img_1 from '@/assets/img/blog/b5.jpg';
import slider_img_2 from '@/assets/img/blog/b6.jpg';
import slider_img_3 from '@/assets/img/blog/b7.jpg';
import { StaticImageData } from 'next/image';


interface DataType {
  id: number;
  cls: string;
  caragory: string;
  time: string;
  post_writer: string;
  comments: string;
  title: string;
  sm_des: string;
  
  img?: StaticImageData;
  slider_images?:  StaticImageData[];
  audio?: string;
 
}[]

const blog_article_data: DataType[] = [
  {
    id: 1, 
    cls: "format-image",
    caragory: "blog",
    img: blog_img_1,
    time: "September 15, 2023",
    post_writer: "Diboli B. Joly",
    comments: "23",
    title: "But there is a downside. Simply running a search for medical blogs.",
    sm_des: "here's a good chance Everyday Health is the most appropriately named blog on this list because it focuses on the health topics that consistently affect a wide range of people. They also get kudos for addressing the emotional challenges folks face when managing conditions.",
  },
  {
    id: 2, 
    cls: "format-video",
    caragory: "video", 
    img: blog_img_2,
    time: "September 17, 2023",
    post_writer: "Joly B. Diboli",
    comments: "25",
    title: "To help ease the process, we identified 75 of our favorite medical blogs.",
    sm_des: "here's a good chance Everyday Health is the most appropriately named blog on this list because it focuses on the health topics that consistently affect a wide range of people. They also get kudos for addressing the emotional challenges folks face when managing conditions.",
  },
  {
    id: 3, 
    cls: "format-gallery",
    caragory: "slider", 
    slider_images: [slider_img_1, slider_img_2, slider_img_3],
    time: "September 21, 2023",
    post_writer: "Joly B. Diboli",
    comments: "25",
    title: "The well known health website has quite a collection of blogs.",
    sm_des: "here's a good chance Everyday Health is the most appropriately named blog on this list because it focuses on the health topics that consistently affect a wide range of people. They also get kudos for addressing the emotional challenges folks face when managing conditions.",
  },
  {
    id: 4, 
    cls: "format-audio",
    caragory: "audio",  
    audio: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/469608615&color=%23ff0000&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
    time: "September 28, 2023",
    post_writer: "Joly B. Diboli",
    comments: "25",
    title: "The well known health website has quite a collection of blogs.",
    sm_des: "here's a good chance Everyday Health is the most appropriately named blog on this list because it focuses on the health topics that consistently affect a wide range of people. They also get kudos for addressing the emotional challenges folks face when managing conditions.",
  },
]
export default blog_article_data 