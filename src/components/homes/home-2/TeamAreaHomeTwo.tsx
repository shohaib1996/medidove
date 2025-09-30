'use client'
import Image from 'next/image';
import Slider from 'react-slick';
import React, { useRef } from 'react';
import TeamTwoData from '@/data/TeamTwodata';
import back_icon from "@/assets/img/section/section-back-icon.png";
import line_icon from "@/assets/img/shape/section-title-line.png";
const setting = {
  dots: true,
  infinite: false,
  speed: 300,
  arrows: false,
  slidesToShow: 6,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    }

  ]
}

const TeamAreaHomeTwo = () => {
  const sliderRef = useRef<Slider | null>(null);
  return (
    <>
      <section className="team-area pt-115 pb-75">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="section-title text-center pos-rel mb-70">
                <div className="section-icon">
                  <Image className="section-back-icon" src={back_icon} alt="theme-pure" />
                </div>
                <div className="section-text pos-rel">
                  <h5>Angels</h5>
                  <h1>Our Doctors</h1>
                </div>
                <div className="section-line pos-rel">
                  <Image src={line_icon} alt="theme-pure" />
                </div>
              </div>
            </div>
          </div>
          <Slider {...setting} ref={sliderRef} className="row team-activation" >
            {TeamTwoData.map((item, i) =>
              <div key={i} className="col-xl-12">
                <div className="team-box pos-rel mb-50">
                  <div className="team-thumb">
                    <Image src={item.img} alt="theme-pure" />
                  </div>
                  <div className="team-author-info">
                    <span>{item.job_title}</span>
                    <h6>{item.name}</h6>
                  </div>
                </div>
              </div>
            )}
          </Slider>
        </div>
      </section>
    </>
  );
};

export default TeamAreaHomeTwo;