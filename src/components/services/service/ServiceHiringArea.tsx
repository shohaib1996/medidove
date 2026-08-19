
import React from 'react';
import hiring_img_1 from "@/assets/img/hire/hire1.jpg";
import hiring_img_2 from "@/assets/img/hire/hire2.jpg"
import Image from 'next/image';
import Link from 'next/link';

const hiring_content = {
  title: "For Clinic Teams",
  description: "Use MediDove to capture appointment requests, summarize patient intent, queue receptionist callbacks, and keep WhatsApp, SMS, email, and voice outreach tied to consent records.",
}
const { title, description } = hiring_content

const ServiceHiringArea = () => {
  return (
    <>
      <section className="hiring-area pt-120 pb-120">
        <div className="container">

          <div className="row g-0 hire-bg-2">
            <div className="col-xl-6 col-lg-6">
              <div className="hire-img">
                <Image className="img" src={hiring_img_1} style={{width: "100%", height: "auto"}} alt="theme-pure" />
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="hire-text">
                <h1>{title}</h1>
                <p>{description}</p>
                <Link
                  data-animation="fadeInLeft"
                  data-delay=".6s" href="/contact"
                  className="btn btn-icon btn-icon-green ml-0"><span>+</span>Contact us</Link>
              </div>
            </div>
          </div>

          <div className="row g-0 hire-bg">
            <div className="col-xl-6 col-lg-6">
              <div className="hire-text">
                <h1>{title}</h1>
                <p>{description}</p>
                <Link data-animation="fadeInLeft" data-delay=".6s" href="/appointment"
                  className="btn btn-icon ml-0"><span>+</span>apply today</Link>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="hire-img">
                <Image className="img" src={hiring_img_2} style={{width: "100%", height: "auto"}} alt="theme-pure" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceHiringArea;
