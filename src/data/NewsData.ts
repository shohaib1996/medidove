

import thumb_1 from "@/assets/img/home4/news/blog__thumb1.png"; 
import admin_1 from "@/assets/img/home4/news/news-admin1.png";  
import { StaticImageData } from "next/image";

interface NewsDataType {
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
}[]

const news_data: NewsDataType[] = [
  {
    id: 1, 
    home: 4,
    img: thumb_1,
    admin: admin_1,
    name: "Barbara",
    time: "25 August 2023",
    tag_1: "Medical",
    tag_2: "Medical",
    title: "WordPress Local Develop For Beginners Setup",
    description: "Developer of a medical documentation software designed to computerize journal management. The company specializes in the development and sale of medical records systems for the primary health care service.",
  },
  {
    id: 2, 
    home: 4,
    img: thumb_1,
    admin: admin_1,
    name: "Jamil",
    time: "25 August 2023",
    tag_1: "Medical",
    tag_2: "Medical",
    title: "Sharing Code Between Projects Lessons Learned",
    description: "Developer of a medical documentation software designed to computerize journal management. The company specializes in the development and sale of medical records systems for the primary health care service.",
  },
  {
    id: 3, 
    home: 4,
    img: thumb_1,
    admin: admin_1,
    name: "Barbara",
    time: "25 August 2023",
    tag_1: "Medical",
    tag_2: "Medical",
    title: "Working Together How Designers & Develop",
    description: "Developer of a medical documentation software designed to computerize journal management. The company specializes in the development and sale of medical records systems for the primary health care service.",
  },
]
export default news_data
