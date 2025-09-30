
import React from 'react';
import Count from '@/components/common/Count';
import Image, { StaticImageData } from 'next/image';
import brand_img from "@/assets/img/about/medi-brand.png";

import counter_icon_1 from "@/assets/img/counter/counter-icon-7.png";
import counter_icon_2 from "@/assets/img/counter/counter-icon-83.png";
import counter_icon_3 from "@/assets/img/counter/counter-icon-9.png";


interface CounterDataType {
  id: number;
  icon: StaticImageData;
  count_number: number;
  title: string;
  sm_des: string;
}[]
const counter_data: CounterDataType[] = [
  {
    id: 1,
    icon: counter_icon_1,
    count_number: 540,
    title: "Expert Doctors",
    sm_des: "adipisicing lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut lab.",
  },
  {
    id: 2,
    icon: counter_icon_2,
    count_number: 899,
    title: "Problem Solve",
    sm_des: "adipisicing lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut lab.",
  },
  {
    id: 3,
    icon: counter_icon_3,
    count_number: 100,
    title: "Award Winner",
    sm_des: "adipisicing lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut lab.",
  },
]

type about_content_typ = {
  title: string;
  sub_title: string;
  sm_des: string;
}
const about_content: about_content_typ = {
  title: "25+ Years Of Experience",
  sub_title: "MediDove help increase your readers.",
  sm_des: "incididunt lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor ut labo re et dolore magna aliqua. Ut enim ad minim veniam, quis nos trud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium",
}
const { title, sub_title, sm_des } = about_content

const AboutAreHomeThree = ({ style }: any) => {
  return (
    <>
      <section className={`about-area ${style ? "pt-120" : "pt-15"} pb-80`}>
        <div className="container">
          {!style &&
            <div className="row align-items-center separator pb-110">
              <div className="col-xl-6 col-lg-6">
                <div className="medical-icon-brand pos-rel f-left">
                  <Image src={brand_img} alt="theme-pure" />
                </div>
                <div className="about-title mb-20 fix">
                  <h1 className="mb-40">{title}</h1>
                  <h5 className="pink-color m-0">{sub_title}</h5>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6">
                <div className="about-right-content">
                  <p>{sm_des}</p>
                </div>
              </div>
            </div>
          }
          <div className={`row ${style ? "" : "pt-120"}`}>
            {counter_data.map((item, i) =>
              <div key={i} className="col-xl-4 col-lg-4 col-md-6">
                <div className="single-couter counter-box counter-box-white text-center mb-30">
                  <Image src={item.icon} alt="theme-pure" />
                  <h1><span className="theme-color counter"><Count number={item.count_number} add_style={true} /></span></h1>
                  <h6 className="green-color pb-20">{item.title}</h6>
                  <div className="counter-text mt-10">
                    <p>{item.sm_des}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutAreHomeThree;