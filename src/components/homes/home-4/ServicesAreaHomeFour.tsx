'use client'
import servcies_data from '@/data/ServiceData';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef } from 'react';
import Slider from 'react-slick';
import service_overlay from "@/assets/img/home4/services/services__overlay__bg.png";
import back_icon from "@/assets/img/section/section-back-icon.png";
import title_line from "@/assets/img/shape/section-title-line.png";

import icon_home_5 from "@/assets/img/icon/h5manage__icon.png";

const setting = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 300,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        arrows: false,
      }
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
      }

    }

  ]
}

const ServicesAreaHomeFour = ({ style }: any) => {
  const sliderRef = useRef<Slider | null>(null);
  const handlePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };
  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  }
  return (
    <>
      <section className={`services-area ${style ? "gray-bg" : "services-border"} pos-rel pt-185 pb-160`}>
        {style ? <></> :
          <span className="h4services-bg">
            <Image src={service_overlay} alt="theme-pure" />
          </span>
        }
        <div className="container">
          <div className="row">
            <div className="col-xl-8 offset-xl-2 col-lg-10 offset-lg-1">
              <div className="section-title text-center pos-rel mb-75">
                <div className="section-icon">
                  <Image className="section-back-icon" src={back_icon} alt="" />
                </div>
                <div className="section-text pos-rel">
                  <h5>Departments</h5>
                  <h1>Managed Your Heathcare Services</h1>
                </div>
                <div className="section-line pos-rel">
                  <Image src={title_line} alt="" />
                </div>
              </div>
            </div>
          </div>

          <div className={`row ${style ? "h4service-active h5service-active" : "h4service-active"} slick-initialized slick-slider slick-dotted`}>
            <button type="button" className="slick-prev slick-arrow d-none d-md-block" onClick={handlePrev}>
              <i className="fal fa-angle-left"></i>
            </button>
            <button type="button" className="slick-next slick-arrow d-none d-md-block" onClick={handleNext}>
              <i className="fal fa-angle-right"></i>
            </button>
            <Slider {...setting} ref={sliderRef}>
              {servcies_data.slice(4, 8).map((item, i) =>
                <div key={i} className="h4service-item">
                  <div className="h4service-box white-bg mb-30">
                    <div className="service-thumb pos-rel mb-0">
                      <Image src={item.img} alt="theme-pure" />
                      <Link className="h4services-tag green-bg white-color text-uppercase f-700" href="#" >{item.sub_title}</Link>
                    </div>
                    <div className={`service-content ${style ? "h4services-content h6services-content" : "h4services-content"}`}>
                      <h3><a href="#">{item.title}</a></h3>
                      <p className="mb-20"> {item.sm_des} </p>
                      {style ?
                        <div className="h5services-bottom">
                          <span><i><Image src={icon_home_5} alt="" /></i>
                            <span className="f-500">07 Specialist Doctors</span></span>
                        </div>
                        :
                        <Link className="service-link" href="/service-details">
                          Read More <i className="fal fa-long-arrow-right"></i>
                        </Link>
                      }
                    </div>
                  </div>
                </div>
              )}
            </Slider>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesAreaHomeFour;