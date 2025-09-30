
import { StaticImageData } from "next/image";
import avatar_img_1 from "@/assets/img/icon/tesit-author-icon-1.png";
import avatar_img_2 from "@/assets/img/icon/tesit-author-icon-2.png"; 

import avatar_img_4_1 from "@/assets/img/home4/testimonials/author-icon1.png"; 
import avatar_img_4_2 from "@/assets/img/home4/testimonials/author-icon2.png"; 
import avatar_img_4_3 from "@/assets/img/home4/testimonials/author-icon3.png"; 

interface DataType {
  id: number;
  home?: number;
  title?: string;
  description: string;
  img: StaticImageData;
  name: string;
  job_title: string;
}[]


const testimonials_data:DataType [] = [
  {
    id: 1,
    title: "consectetur ipsum dolor ullamco sit amet, adipil sicing elit, sed do eiusmod tempor.",
    description: "exercitation consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ullamco laboris nisi ut aliquip Lorem ipsum dolor sit amet.",
    img: avatar_img_1,
    name: "Rosalina D. Williamson",
    job_title: "MinimalDesign",
  },
  {
    id: 2,
    title: "consectetur ipsum dolor ullamco sit amet, adipil sicing elit, sed do eiusmod tempor.",
    description: "exercitation consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ullamco laboris nisi ut aliquip Lorem ipsum dolor sit amet.",
    img: avatar_img_2,
    name: "Williamson D. Rosalina",
    job_title: "MinimalDesign",
  },
  {
    id: 3,
    title: "consectetur ipsum dolor ullamco sit amet, adipil sicing elit, sed do eiusmod tempor.",
    description: "exercitation consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ullamco laboris nisi ut aliquip Lorem ipsum dolor sit amet.",
    img: avatar_img_1,
    name: "D. Williamson Rosalina",
    job_title: "MinimalDesign",
  },
  // update
  {
    id: 4,
    title: "consectetur ipsum dolor ullamco sit amet, adipil sicing elit, sed do eiusmod tempor.",
    description: "exercitation consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ullamco laboris nisi ut aliquip Lorem ipsum dolor sit amet.",
    img: avatar_img_1,
    name: "Rosalina D. Williamson",
    job_title: "MinimalDesign",
  },
  {
    id: 5,
    title: "consectetur ipsum dolor ullamco sit amet, adipil sicing elit, sed do eiusmod tempor.",
    description: "exercitation consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ullamco laboris nisi ut aliquip Lorem ipsum dolor sit amet.",
    img: avatar_img_2,
    name: "Williamson D. Rosalina",
    job_title: "MinimalDesign",
  },
  {
    id: 6,
    title: "consectetur ipsum dolor ullamco sit amet, adipil sicing elit, sed do eiusmod tempor.",
    description: "exercitation consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ullamco laboris nisi ut aliquip Lorem ipsum dolor sit amet.",
    img: avatar_img_1,
    name: "D. Williamson Rosalina",
    job_title: "MinimalDesign",
  },

  // home 04 
  {
    id: 1, 
    home: 4,
    description: "Exercitation consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. nisi ut aliquip Lorem ipsum dolor sit amet.",
    img: avatar_img_4_1,
    name: "Hiliam D. Pawlu",
    job_title: "Founder, TrashTheme",
  },
  {
    id: 2, 
    home: 4,
    description: "Adipisicing exercitation consectetur elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. nisi ut aliquip Lorem ipsum dolor sit amet.",
    img: avatar_img_4_2,
    name: "Eric Z. Piedie",
    job_title: "Founder, TrashTheme",
  },
  {
    id: 3, 
    home: 4,
    description: "Incididunt exercitation consectetur adipisicing elit, sed do eiusmod tempor ut labore et dolore magna aliqua. nisi ut aliquip Lorem ipsum dolor sit amet.",
    img: avatar_img_4_3,
    name: "Eric Z. Piedie",
    job_title: "Founder, TrashTheme",
  },
  {
    id: 4, 
    home: 4,
    description: "Consectetur exercitation adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. nisi ut aliquip Lorem ipsum dolor sit amet.",
    img: avatar_img_4_1,
    name: "Eric Z. Piedie",
    job_title: "Founder, TrashTheme",
  },

]
export default testimonials_data