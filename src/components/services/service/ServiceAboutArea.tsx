import React from 'react';
import Image from 'next/image';
import back_icon from "@/assets/img/section/section-back-icon.png";
import servcies_data from '@/data/ServiceData';
import Link from 'next/link';


type DataType = {
  sub_title: string;
  title: string;
  sm_des: string;
}
const service_content: DataType = {
  sub_title: "AI clinic services",
  title: "Route patients to the right care path without diagnosis claims.",
  sm_des: "MediDove combines clinic service pages with Supabase booking, AI intake, voice receptionist workflows, and consent-based reminders. Patients get clearer next steps while staff keep control of final scheduling and follow-up.",

}
const { sub_title, title, sm_des } = service_content

type ServiceAboutAreaProps = {
  service_2?: boolean;
};

const ServiceAboutArea = ({ service_2 }: ServiceAboutAreaProps) => {
  return (
    <>
      <section className="about-area pt-120 pb-90">
        <div className="container">
          <div className="row ">
            <div className="col-xl-6 col-lg-6 col-md-12">
              <div className="section-title section-title-m-0 pos-rel mb-50 text-end">
                <div className="section-icon">
                  <Image className="section-back-icon back-icon-right" src={back_icon} alt="theme-pure" />
                </div>
                <div className="section-text section-text-small pos-rel">
                  <h5>{sub_title}</h5>
                  <h1>{title}</h1>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-12">
              <div className="facalty-text mb-50">
                <p>{sm_des}</p>
              </div>
            </div>
          </div>
          {!service_2 &&
            <div className="row">
              {servcies_data.map((item, i) =>
                item.service ? (
                    <div key={i} className="col-xl-4 col-lg-6 col-md-6">
                      <div className="service-box service-box-border text-center mb-30">
                        <div className="service-thumb">
                          <Image src={item.img} alt={item.title} />
                        </div>
                        <div className="service-content">
                          <h3><Link href="/service-details">{item.title}</Link></h3>
                          <p>{item.sm_des}</p>
                          <Link className="service-link" href="/service-details">Read More</Link>
                        </div>
                      </div>
                    </div>
                ) : null
              )}
            </div>
          }
        </div>
      </section >
    </>
  );
};

export default ServiceAboutArea;
