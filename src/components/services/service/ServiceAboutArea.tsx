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
  sub_title: "health care facility",
  title: "Would you rather stay at home than go into a health care facility?",
  sm_des: "Perspiciatis unde omnis iste natus lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nost rud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat  nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut error sit voluptatem accusantium.",

}
const { sub_title, title, sm_des } = service_content

const ServiceAboutArea = ({ service_2 }: any) => {
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
                <>
                  {item.service &&
                    <div key={i} className="col-xl-4 col-lg-6 col-md-6">
                      <div className="service-box service-box-border text-center mb-30">
                        <div className="service-thumb">
                          <Image src={item.img} alt="theme-pure" />
                        </div>
                        <div className="service-content">
                          <h3><a href="#">{item.title}</a></h3>
                          <p>{item.sm_des}</p>
                          <Link className="service-link" href="/service-details">Read More</Link>
                        </div>
                      </div>
                    </div>
                  }
                </>
              )}
            </div>
          }
        </div>
      </section >
    </>
  );
};

export default ServiceAboutArea;