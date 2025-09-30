

import { StaticImageData } from "next/image";
import team_avatar_1 from "@/assets/img/team/member1.png";
import team_avatar_2 from "@/assets/img/team/member2.png";
import team_avatar_3 from "@/assets/img/team/member3.png";
import team_avatar_4 from "@/assets/img/team/member4.png";
import team_avatar_5 from "@/assets/img/team/member5.png";
import team_avatar_6 from "@/assets/img/team/member6.png"; 

import team_avatar_2_1 from "@/assets/img/team/team-member-1.jpg"; 
import team_avatar_2_2 from "@/assets/img/team/team-member-2.jpg"; 
import team_avatar_2_3 from "@/assets/img/team/team-member-3.jpg"; 
import team_avatar_2_4 from "@/assets/img/team/team-member-4.jpg"; 
import team_avatar_2_5 from "@/assets/img/team/team-member-5.jpg"; 
import team_avatar_2_6 from "@/assets/img/team/team-member-6.jpg"; 


interface TeamDataType {
  id: number;
  img: StaticImageData;
  name: string;
  job_title: string;
}[]

const TeamTwoData = [
  {
    id: 1, 
    img: team_avatar_2_1,
    name: "Rosalina D. Williamson",
    job_title: "Founder",
  },
  {
    id: 2, 
    img: team_avatar_2_2,
    name: "Diconda PIran Will",
    job_title: "dentist",
  },
  {
    id: 3, 
    img: team_avatar_2_3,
    name: "Hulk M. Kenbon",
    job_title: "neurologist",
  },
  {
    id: 4, 
    img: team_avatar_2_4,
    name: "Haliam Z. Dicolaz",
    job_title: "Consultant",
  },
  {
    id: 5, 
    img: team_avatar_2_5,
    name: "Nicolas D. Case",
    job_title: "dentist",
  },
  {
    id: 6, 
    img: team_avatar_2_6,
    name: "Phumdon H. Norman",
    job_title: "neurologist",
  },
  {
    id: 7, 
    img: team_avatar_2_3,
    name: "Hulk M. Kenbon",
    job_title: "neurologist",
  },
  {
    id: 8, 
    img: team_avatar_2_4,
    name: "Haliam Z. Dicolaz",
    job_title: "Consultant",
  },
]
export default TeamTwoData