import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import servcies_data from '@/data/ServiceData';
import back_icon from "@/assets/img/section/section-back-icon.png";
import line_icon from "@/assets/img/shape/section-title-line.png";



const ServicesAreaHomeTwo = () => {
  return (
    <>
      <section className="servcies-area gray-bg pt-100 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 offset-xl-4 col-lg-10 offset-lg-1">
              <div className="section-title text-center pos-rel mb-75">
                <div className="section-icon">
                  <Image className="section-back-icon" src={back_icon} alt="theme-pure" />
                </div>
                <div className="section-text pos-rel">
                  <h5>Services</h5>
                  <h1>What We Do For You?</h1>
                </div>
                <div className="section-line pos-rel">
                  <Image src={line_icon} alt="theme-pure" />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {servcies_data.slice(0, 4).map((item, i) =>
              <div key={i} className="col-xl-6 col-lg-6 col-md-12">
                <div className="service-box service-box-2 mb-30 pos-rel">
                  <div className="service-thumb">
                    <Image src={item.img} alt="theme-pure" />
                  </div>
                  <div className="service-content service-content-2">
                    <h6 className="green-color text-up-case letter-spacing mb-20">{item.sub_title}</h6>
                    <h3><Link href="#">{item.title}</Link></h3>
                    <p>{item.sm_des}</p>
                    <Link className="service-link" href="/service-details">
                      <i className="fas fa-arrow-right"></i>Read More
                    </Link>
                  </div>
                  <div className="service-number">
                    <h1 className="service-big-number">0{item.id}</h1>
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

export default ServicesAreaHomeTwo;