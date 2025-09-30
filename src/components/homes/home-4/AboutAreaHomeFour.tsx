
import React from 'react';
import Image from 'next/image';

import about_thumb_1 from "@/assets/img/home4/about/about__thumb.jpg";
import phone_icon from "@/assets/img/home4/icon/about__phone__icon.png";
import overlap from "@/assets/img/home4/about/overlap.png";
import avatar_img from "@/assets/img/home4/about/ava.png";

const about_content  = {
  phone: "012 (963) 15632",
  sub_title: "About Medidove",
  title: "25+ Years We Provide Services",
  sm_des_1: "Temponcididunt ipsum dolor sit amet, consectetur adipisicing elit, sed eiusmod lorem ut labore dolore magna aliqua. Ut enim ad minimveniam, quis nos exercitation ullamco laboris nisi ut aliquip",
  sm_des_2: "Consectetur adipisicing elit Temponcididunt ipsum dolor sit amet, sed eiusmod lorem ut labore dolore magna aliqua. Ut enim ad minimveniam, quis nos exercitation ullamco laboris nisi ut aliquip",
  avatar_info: "Consectetur adipisicing elit, sed do eiusmod temponc ididunt ut labore dolore magna aliqua.",
  avatar_name: "Annie J. Fisher",
}
const {phone, sub_title, title, sm_des_1, sm_des_2, avatar_info, avatar_name} = about_content
 
const AboutAreaHomeFour = () => {
  return (
    <>
      <section className="about-area pt-130 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-5">
              <div className="h4about-thumb pos-rel">
                <Image src={about_thumb_1} alt="theme-pure" />
                <a href="#" className="call-btn f-700 white-color green-bg">
                  <i className="call-icon" >
                    <Image src={phone_icon} alt="theme-pure" />
                </i><span>Call : {phone}</span>
                </a>
                <Image src={overlap} alt="" className="about-overlap__thumb" />
              </div>
            </div>
            <div className="col-xl-6 col-lg-7">
              <div className="about-right-side h4about-right mb-30">
                <div className="about-title mb-20">
                  <h5 className="pink-color">{sub_title}</h5>
                  <h1>{title}</h1>
                </div>
                <div className="about-text">
                  <p className="theme-color">
                    {sm_des_1}
                  </p>
                  <p className="mb-20">
                    {sm_des_2}
                  </p>
                </div>
                <div className="about-author d-flex align-items-center">
                  <div className="author-ava h4author-ava">
                    <Image src={avatar_img} alt="theme-pure"  />
                  </div>
                  <div className="author-desination h4author-destination">
                    <p>{avatar_info}</p>
                    <h4 className="mb-0">{avatar_name}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutAreaHomeFour;