'use client'
import Link from 'next/link';
import VideoPopup from '@/modals/VideoPopup';
import React, { useState } from 'react';

type DataType = {
  sub_title: string;
  title: string;
  sm_info: string;
  btn_text: string;
}
const hero_content: DataType = {
  sub_title: "We are here for your care.",
  title: "Best Care & Better Doctor.",
  sm_info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  btn_text: "Make Appointment",
}
const { sub_title, title, sm_info, btn_text } = hero_content

const HeroBannerHomeThree = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  return (
    <>
      <section className="hero-area">
        <div className="hero-slider">
          <div className="slider-fix">
            <div className="single-slider slider-height slider-height-3 d-flex align-items-center" style={{ backgroundImage: `url(/assets/img/slider/slider-bg-3.jpg)` }}>
              <div className="container">
                <div className="row">
                  <div className="col-xl-7 col-lg-9">
                    <div className="hero-text hero-text-box">
                      <div className="hero-slider-caption ">
                        <h5 data-animation="fadeInUp" data-delay=".2s">{sub_title}</h5>
                        <h1 data-animation="fadeInUp" data-delay=".4s">{title}</h1>
                        <p data-animation="fadeInUp" data-delay=".6s">{sm_info}</p>
                      </div>
                      <div className="hero-slider-btn">
                        <Link data-animation="fadeInLeft" data-delay=".6s" href="/appoinment"
                          className="btn btn-icon ml-0"><span>+</span>{btn_text}</Link>
                        <a data-animation="fadeInRight" data-delay="1.0s"
                          onClick={() => setIsVideoOpen(true)}
                          style={{ cursor: "pointer" }}
                          className="play-btn popup-video"><i className="fas fa-play"></i></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* video modal start */}
      <VideoPopup
        isVideoOpen={isVideoOpen}
        setIsVideoOpen={setIsVideoOpen}
        videoId={'TYYf8zYjP5k'}
      />
      {/* video modal end */}
    </>
  );
};

export default HeroBannerHomeThree;