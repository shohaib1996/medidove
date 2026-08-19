
import React from 'react';
import Count from '@/components/common/Count';
import Image, { StaticImageData } from 'next/image';
import brand_img from "@/assets/img/about/medi-brand.png";

import counter_icon_1 from "@/assets/img/counter/counter-icon-7.png";
import counter_icon_2 from "@/assets/img/counter/counter-icon-83.png";
import counter_icon_3 from "@/assets/img/counter/counter-icon-9.png";


type CounterDataItem = {
  id: number;
  icon: StaticImageData;
  count_number: number;
  title: string;
  sm_des: string;
};
const counter_data: CounterDataItem[] = [
  {
    id: 1,
    icon: counter_icon_1,
    count_number: 540,
    title: "Patient Requests",
    sm_des: "Structured intake and appointment data show how a clinic can manage demand from multiple channels.",
  },
  {
    id: 2,
    icon: counter_icon_2,
    count_number: 899,
    title: "Workflow Events",
    sm_des: "Automations create traceable reminders, tasks, call logs, and campaign activity for the admin team.",
  },
  {
    id: 3,
    icon: counter_icon_3,
    count_number: 100,
    title: "Consent Checks",
    sm_des: "Patient communication flows are designed around opt-in status, opt-outs, and reviewable outreach records.",
  },
]

type about_content_typ = {
  title: string;
  sub_title: string;
  sm_des: string;
}
const about_content: about_content_typ = {
  title: "Built For AI Clinic Operations",
  sub_title: "MediDove helps buyers see a complete patient engagement system.",
  sm_des: "The demo brings together smart intake, appointment requests, voice receptionist logs, WhatsApp reminders, campaigns, and admin reporting so clinics can review the full workflow in one place.",
}
const { title, sub_title, sm_des } = about_content

type AboutAreHomeThreeProps = {
  style?: boolean;
};

const AboutAreHomeThree = ({ style }: AboutAreHomeThreeProps) => {
  return (
    <>
      <section className={`about-area ${style ? "pt-120" : "pt-15"} pb-80`}>
        <div className="container">
          {!style &&
            <div className="row align-items-center separator pb-110">
              <div className="col-xl-6 col-lg-6">
                <div className="medical-icon-brand pos-rel f-left">
                  <Image src={brand_img} alt="MediDove clinic operations" />
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
                  <Image src={item.icon} alt="" />
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
