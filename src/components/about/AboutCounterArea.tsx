
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
    title: "AI-Assisted Requests",
    sm_des: "Appointment, callback, WhatsApp, and website assistant requests can be captured in one Supabase-backed workflow.",
  },
  {
    id: 2,
    count_number: 558,
    icon: counter_icon_2,
    title: "Patient Messages",
    sm_des: "Consent-aware outreach keeps reminders, follow-ups, feedback, and receptionist handoffs visible for clinic staff.",
  },
  {
    id: 3,
    count_number: 450,
    icon: counter_icon_3,
    title: "Admin Actions",
    sm_des: "Teams can review leads, update appointments, queue campaigns, and audit important workflow changes.",
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
