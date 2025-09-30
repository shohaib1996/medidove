
import React from 'react';
import Count from '../common/Count';
import Image, { StaticImageData } from 'next/image';
import counter_icon_1 from "@/assets/img/counter/counter-icon-1.png";
import counter_icon_2 from "@/assets/img/counter/counter-icon-2.png";
import counter_icon_3 from "@/assets/img/counter/counter-icon-3.png"; 

interface DataType {
  id: number;
  count_number: number;
  icon: StaticImageData;
  title: string;
  sm_des: string;
}[]

const counter_data: DataType[] = [
  {
    id: 1,
    count_number: 358,
    icon: counter_icon_1,
    title: "Worldwide Branches",
    sm_des: "Incididunt ut labore et dolore lorem ipsum dolor sit amet, consectetur adipisi cing elit, sed do eiusmod tempor magna aliqua.",
  },
  {
    id: 2,
    count_number: 558,
    icon: counter_icon_2,
    title: "Hospital Formed",
    sm_des: "Consectetur adipisi cing  Incididunt ut labore et dolore lorem ipsum dolor sit amet, elit, sed do eiusmod tempor magna aliqua.",
  },
  {
    id: 3,
    count_number: 450,
    icon: counter_icon_3,
    title: "Hospital Formed",
    sm_des: "Adipisi consectetur cing  Incididunt ut labore et dolore lorem ipsum dolor sit amet, elit, sed do eiusmod tempor magna aliqua.",
  },
]

const AboutCounterArea = () => {
  return (
    <>
      <section className="counter-wraper pt-120 pb-90 gray-bg">
        <div className="container">
          <div className="row">
            {counter_data.map((item, i) =>
              <div key={i} className="col-lg-4 col-md-6">
                <div className="single-couter mb-30">
                  <Image src={item.icon} alt="theme-pure" />
                  <div className="counter-text-box">
                    <h1><span className="counter"> <Count number={item.count_number} /></span></h1>
                    <h3>{item.title}</h3>
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

export default AboutCounterArea;