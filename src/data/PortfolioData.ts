
import { StaticImageData } from "next/image";

import portfolio_img_1 from "@/assets/img/portfolio/port1.jpg";
import portfolio_img_2 from "@/assets/img/portfolio/port2.jpg";
import portfolio_img_3 from "@/assets/img/portfolio/port3.jpg";
import portfolio_img_4 from "@/assets/img/portfolio/port4.jpg";
import portfolio_img_5 from "@/assets/img/portfolio/port5.jpg";
import portfolio_img_6 from "@/assets/img/portfolio/port6.jpg"; 

interface DataType {
  id: number;
  img: StaticImageData;
  title: string;
  tag: string;
  category: string;
}

const portfolio_data = [
  {
    id: 1,
    img: portfolio_img_1,
    title: "Awesome Doctor",
    tag: "Medical",
    category: "Dental",
  },
  {
    id: 2,
    img: portfolio_img_2,
    title: "Awesome Doctor",
    tag: "Medical",
    category: "Care",
  },
  {
    id: 3,
    img: portfolio_img_3,
    title: "Awesome Doctor",
    tag: "Medical",
    category: "Medical",
  },
  {
    id: 4,
    img: portfolio_img_4,
    title: "Awesome Doctor",
    tag: "Medical",
    category: "Surgery",
  },
  {
    id: 5,
    img: portfolio_img_5,
    title: "Awesome Doctor",
    tag: "Medical",
    category: "Dental",
  },
  {
    id: 6,
    img: portfolio_img_6,
    title: "Awesome Doctor",
    tag: "Medical",
    category: "Care",
  },
  // update data
  {
    id: 7,
    img: portfolio_img_3,
    title: "Awesome Doctor",
    tag: "Medical",
    category: "Surgery",
  },
  {
    id: 8,
    img: portfolio_img_4,
    title: "Awesome Doctor",
    tag: "Medical",
    category: "Medical",
  },
  {
    id: 9,
    img: portfolio_img_1,
    title: "Awesome Doctor",
    tag: "Medical",
    category: "Care",
  },
  {
    id: 10,
    img: portfolio_img_2,
    title: "Awesome Doctor",
    tag: "Medical",
    category: "Dental",
  },
  {
    id: 11,
    img: portfolio_img_3,
    title: "Awesome Doctor",
    tag: "Medical",
    category: "Surgery",
  },
  {
    id: 12,
    img: portfolio_img_4,
    title: "Awesome Doctor",
    tag: "Medical",
    category: "Dental",
  },
  {
    id: 13,
    img: portfolio_img_5,
    title: "Awesome Doctor",
    tag: "Medical",
    category: "Care",
  },
  {
    id: 14,
    img: portfolio_img_6,
    title: "Awesome Doctor",
    tag: "Medical",
    category: "Medical",
  },

]
export default portfolio_data