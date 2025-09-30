import blog_data from '@/data/BlogData';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import back_icon from "@/assets/img/section/section-back-icon.png";
import line_icon from "@/assets/img/shape/section-title-line.png";

const service_content = {
  sub_title: "Departments",
  title: "Managed Your Heathcare Services",
}
const {title, sub_title} = service_content

const ServiceAreaHomeThree = () => {
  return (
    <>
      <section className="servcies-area gray-bg pt-115 pb-35">
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
                <Link data-animation="fadeInLeft" data-delay=".6s" href="/services" className="btn btn-icon ml-0">
                  <span>+</span>more services
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            {blog_data.slice(3, 6).map((item, i) =>
              <div key={i} className="col-xl-4 col-lg-4 col-md-6">
                <div className="service-box-3 mb-30 text-center">
                  <div className="service-thumb">
                    <Link href="/service-details">
                      <Image src={item.img} style={{width: '100%', height: "auto"}} alt="theme-pure" />
                    </Link>
                  </div>
                  <div className="service-content-box">
                    <div className="service-content">
                      <h3><Link href="/news-details">{item.title}</Link></h3>
                      <p>{item.sm_des}</p>
                    </div>
                    <button className="service-link">Read More</button>
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

export default ServiceAreaHomeThree;