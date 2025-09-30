
import blog_data from '@/data/BlogData';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import back_icon from "@/assets/img/section/section-back-icon.png";
import line_icon from "@/assets/img/shape/section-title-line.png";

type DataType = {
  sub_title: string;
  title: string;
}
const servcies_content: DataType = {
  sub_title: "Departments",
  title: "Managed Your Heathcare Services",
}
const {sub_title, title}  = servcies_content

const ServiceTwoServicesArea = () => {
  return (
    <>
      <section className="servcies-area gray-bg pt-115 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-xl-7 col-lg-8 col-md-12">
              <div className="section-title pos-rel mb-75">
                <div className="section-icon">
                  <Image className="section-back-icon back-icon-left" src={back_icon} alt="theme-pure" />
                </div>
                <div className="section-text pos-rel">
                  <h5>{sub_title}</h5>
                  <h1>{title}</h1>
                </div>
                <div className="section-line pos-rel">
                  <Image src={line_icon} alt="theme-pure" />
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-lg-4">
              <div className="section-button text-right d-none d-lg-block pt-80">
                <a data-animation="fadeInLeft" data-delay=".6s" href="services.html"
                  className="btn btn-icon ml-0"><span>+</span>more services</a>
              </div>
            </div>
          </div>
          <div className="row">
            {blog_data.map((item, i) =>
              <>
                {item.home_3_serive_2 &&
                  <div key={i} className="col-xl-4 col-lg-4 col-md-6">
                    <div className="service-box-3 mb-30 text-center">
                      <div className="service-thumb">
                        <Link href="/service-details">
                          <Image src={item.img} style={{width: "100%", height: "auto"}} alt="theme-pure" />
                        </Link>
                      </div>
                      <div className="service-content-box">
                        <div className="service-content">
                          <h3><Link href="/news-details">{item.title}</Link></h3>
                          <p>{item.sm_des}</p>
                        </div>
                        <Link href="#" className="service-link">Read More</Link>
                      </div>
                    </div>
                  </div>
                }
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceTwoServicesArea;