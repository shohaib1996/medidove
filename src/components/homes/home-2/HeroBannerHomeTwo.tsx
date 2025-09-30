'use client'
import Link from 'next/link';
import Image from "next/image";
import React, { useState } from 'react';
import VideoPopup from '@/modals/VideoPopup';
import NiceSelect from '@/ui/NiceSelect'; 
import option_icon2 from "@/assets/img/icon/caregive-option-icon-2.png"

const HeroBannerHomeTwo = () => {
  const selectHandler = (e: any) => { };
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  return (
    <>
      <section className="hero-area">
        <div className="hero-slider">
          <div className="slider-active">
            <div className="single-slider slider-height slider-height-2 d-flex align-items-center" 
            style={{ backgroundImage: `url(/assets/img/slider/slider-bg-2.jpg)`, backgroundRepeat: "no-repeat", backgroundSize: 'cover ' }}>
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-xl-6 col-lg-6 col-md-10">
                    <div className="hero-text hero-text-2 pt-35">
                      <div className="hero-slider-caption hero-slider-caption-2">
                        <h5 className="white-color" data-animation="fadeInUp" data-delay=".2s">We are here for your care.</h5>
                        <h1 className="white-color" data-animation="fadeInUp" data-delay=".4s">Best Care & Better Doctor.</h1>
                      </div>
                      <div className="hero-slider-btn">
                        <Link data-animation="fadeInLeft" data-delay=".6s" href="/about" className="btn btn-icon btn-icon-blue ml-0"><span>+</span>about us</Link>
                        <a data-animation="fadeInRight" data-delay="1.0s" 
                          onClick={() => setIsVideoOpen(true)}
                          style={{ cursor: "pointer" }}
                          className="play-btn popup-video"><i className="fas fa-play"></i></a>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-5 offset-xl-1 col-lg-6 col-md-12">
                    <div className="slider-right-2">
                      <div className="caregive-box">
                        <div className="search-form">
                          <span className="sub-heading">We are here for you</span>
                          <h3>Find A Care Giver</h3>
                        </div>
                        <div className="row">
                          <div className="col-xl-12">
                            <div className="appoinment-form-box appoinment-form-box-option d-flex mb-40">
                              <div className="appoint-ment-icon">
                                <Image src={option_icon2} alt="theme-pure" />
                              </div>
                              <form className="appointment-form-2" action="#">
                                <label htmlFor="input">select your services</label>
                                <NiceSelect 
                                className="postform"
                                  options={[
                                    { value: "Choose A Location", text: "Choose A Location" },
                                    { value: "Chicago, United States", text: "Chicago, United States" },
                                    { value: "California, United States", text: "California, United States" },
                                  ]}
                                  defaultCurrent={0}
                                  onChange={selectHandler}
                                  name=''
                                  placeholder=''
                                />
                              </form> 
                            </div>
                          </div>
                          <div className="col-xl-12">
                            <div className="appoinment-form-box appoinment-form-box-option d-flex mb-40">
                              <div className="appoint-ment-icon">
                              <Image src={option_icon2} alt="theme-pure" /> 
                              </div>
                              <form className="appointment-form-2" action="#">
                                <label htmlFor="input">select your services</label>
                                <NiceSelect 
                                className="postform"
                                  options={[
                                    {value: "Choose A Service", text: "Choose A Service" },
                                    {value: "Chicago, United States", text: "Chicago, United States" },
                                    {value: "California, United States", text: "California, United States" },
                                  ]}
                                  defaultCurrent={0}
                                  onChange={selectHandler}
                                  placeholder=''
                                  name=''
                                />
                              </form>
                            </div>
                          </div>
                          <div className="col-xl-12 mb-35">
                            <div className="inner caregive-btn text-center">
                              <Link href="/appoinment" className="btn gray-btn-border">Make Appointment</Link>
                            </div>
                          </div>
                        </div>
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

export default HeroBannerHomeTwo;