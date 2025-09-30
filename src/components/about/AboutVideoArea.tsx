'use client'
import Image, { StaticImageData } from 'next/image';
import React, { useState } from 'react';
import icon_1 from "@/assets/img/about/destination-icon-1.png";
import icon_2 from "@/assets/img/about/destination-icon-2.png";
import VideoPopup from '@/modals/VideoPopup';
import about_img from '@/assets/img/about/about-img.jpg';
import about_shape from "@/assets/img/about/about-shape.png";

interface DataType {
  sub_title: string;
  title: string;
  sm_des: string;
  our_feature: {
    id: number;
    img: StaticImageData;
    title: string;
    sm_des: string;
  }[];
}

const about_video_content: DataType = {
  sub_title: "About Us",
  title: "Short Story About MediDove Clinic.",
  sm_des: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
  our_feature: [
    {
      id: 1,
      img: icon_1,
      title: "Our Mission",
      sm_des: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.",
    },
    {
      id: 2,
      img: icon_2,
      title: "Our Vission",
      sm_des: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.",
    },
  ]
}
const { sub_title, title, sm_des, our_feature } = about_video_content

const AboutVideoArea = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  return (
    <>
      <section className="about-area pt-120 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-5">
              <div className="about-left-side pos-rel mb-30">
                <div className="about-front-img pos-rel">
                  <Image src={about_img} alt="theme-pure" />
                  <a className="popup-video about-video-btn white-video-btn"
                    onClick={() => setIsVideoOpen(true)}
                    style={{ cursor: "pointer" }}
                  ><i className="fas fa-play"></i></a>
                </div>
                <div className="about-shape">
                  <Image src={about_shape} alt="theme-pure" />
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-7">
              <div className="about-right-side pt-55 mb-30">
                <div className="about-title mb-20">
                  <h5>{sub_title}</h5>
                  <h2>{title}</h2>
                </div>
                <div className="about-text mb-50">
                  <p>{sm_des}</p>
                </div>
                <div className="our-destination">
                  {our_feature.map((item, i) =>
                    <div key={i} className={`single-item ${i === 0 ? "mb-30" : ""}`}>
                      <div className="mv-icon f-left">
                        <Image src={item.img} alt="theme-pure" />
                      </div>
                      <div className="mv-title fix">
                        <h3>{item.title}</h3>
                        <p>{item.sm_des}</p>
                      </div>
                    </div>
                  )}
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
        videoId={'_6QhP3Fa0rU'}
      />
      {/* video modal end */}
    </>
  );
};

export default AboutVideoArea;