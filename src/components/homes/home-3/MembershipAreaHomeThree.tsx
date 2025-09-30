'use client'
import Slider from 'react-slick';
import React, { useRef } from 'react';
import Image, { StaticImageData } from 'next/image';

import back_icon from "@/assets/img/section/section-back-icon.png";
import line_icon from "@/assets/img/shape/section-title-line.png";

import membership_img_1 from "@/assets/img/membership/offer-1.png";
import membership_img_2 from "@/assets/img/membership/offer-2.png";
import shape_line from "@/assets/img/membership/member-ship-line-shape.png";

import testi_img_1 from "@/assets/img/membership/members-icon-1.png";
import testi_img_2 from "@/assets/img/membership/members-icon-2.png";
import testi_img_3 from "@/assets/img/membership/members-icon-3.png";


interface DataType {
  sub_title: string;
  title: string;
  membership_data: {
      id: number;
      img: StaticImageData;
      title: string;
      sm_des: string;
  }[];
  testimonita_data: {
      id: number;
      img: StaticImageData;
      sm_des: string;
      name: string;
      job_title: string;
  }[];
}

const membership_content: DataType = {
  sub_title: "Exclusive Buyer",
  title: "Premium Membership",
  membership_data: [
    {
      id: 1,
      img: membership_img_1,
      title: "Hourly Home Care",
      sm_des: "adipisicing ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation lorem ullamco laboris nisi ut aliquip.",
    },
    {
      id: 2,
      img: membership_img_2,
      title: "Medicine Quick Delivery",
      sm_des: "incididunt ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation lorem ullamco laboris nisi ut aliquip.",
    },
  ],
  testimonita_data: [
    {
      id: 1,
      img: testi_img_1,
      sm_des: "Lorem ipsum dolor sit amet, coning ctetur adipisicing elit, sed do it on eiusmod tempor incididunt me ut labore et dolore.",
      name: "Mr. Halim Dawn",
      job_title: "Founder, TrashTheme",
    },
    {
      id: 2,
      img: testi_img_2,
      sm_des: "Lorem ipsum dolor sit amet, coning ctetur adipisicing elit, sed do it on eiusmod tempor incididunt me ut labore et dolore.",
      name: "Hiliam D. Pawlu",
      job_title: "Founder, TrashTheme",
    },
    {
      id: 3,
      img: testi_img_3,
      sm_des: "Lorem ipsum dolor sit amet, coning ctetur adipisicing elit, sed do it on eiusmod tempor incididunt me ut labore et dolore.",
      name: "Eric Z. Piedie",
      job_title: "Founder, TrashTheme",
    }, 
  ],
}
const { sub_title, title, membership_data, testimonita_data } = membership_content

const setting = {
  dots: false,
  arrows: false,
  infinite: false,
  speed: 300,
  slidesToShow: 2,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: false
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
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }

  ]
}


const MembershipAreaHomeThree = () => {
  const sliderRef = useRef<Slider | null>(null);
  return (
    <>
      <section className="membership-area membership-bg pt-120 pb-120 pos-rel" style={{ backgroundImage: `url(/assets/img/membership/membership-bg.jpg)` }}>
        <div className="container">
          <div className="membership-box pt-115 pb-90 white-bg">
            <div className="row">
              <div className="col-xl-10 offset-xl-1">
                <div className="section-title text-center pos-rel mb-70">
                  <div className="section-icon">
                    <Image className="section-back-icon" src={back_icon} alt="theme-pure" />
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
            </div>
            <div className="row">
              {membership_data.map((item, i) =>
                <div key={i} className="col-xl-6 col-lg-6">
                  <div className="single-membership-box mb-30">
                    <Image className="member-ship-icon mb-25" src={item.img} alt="theme-pure" />
                    <h3 className="mb-20">{item.title}</h3>
                    <Image className="membership-line-shape" src={shape_line} alt="theme-pure" />
                    <p>{item.sm_des}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="membership-review member-ship-map gray-bg pos-rel">
            <Slider {...setting} ref={sliderRef} className="test-active owl-carousel">
              {testimonita_data.map((item, i) =>
                <div key={i} className="item">
                  <div className="review-box">
                    <div className="members-rating">
                      <ul>
                        <li><i className="fas fa-star"></i></li>
                        <li><i className="fas fa-star"></i></li>
                        <li><i className="fas fa-star"></i></li>
                        <li><i className="fas fa-star"></i></li>
                        <li><i className="fas fa-star"></i></li>
                      </ul>
                    </div>
                    <div className="members-text">
                      <p>{item.sm_des}</p>
                    </div>
                    <div className="about-author d-flex align-items-center">
                      <div className="author-ava">
                        <Image src={item.img} alt="theme-pure" />
                      </div>
                      <div className="author-desination author-desination-2">
                        <h4>{item.name}</h4>
                        <h6>{item.job_title}</h6>
                      </div>
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

export default MembershipAreaHomeThree;