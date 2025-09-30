'use client'

import counter_icon_1 from "@/assets/img/home4/fact/icon1.png";
import counter_icon_2 from "@/assets/img/home4/fact/icon2.png";
import counter_icon_3 from "@/assets/img/home4/fact/icon3.png";
import counter_icon_4 from "@/assets/img/home4/fact/icon4.png";
import Count from "@/components/common/Count";
import VideoPopup from "@/modals/VideoPopup";
import Image from "next/image";
import { useState } from "react";
import play_icon from "@/assets/img/home4/fact/play-icon.png"
import brand_logo from "@/assets/img/home4/fact/brand__logo__icon.png";
import right_thumb from "@/assets/img/home4/fact/facti_right_thumb.jpg";
const counter_data = [
  {
    id: 1,
    count_number: 3624,
    icon: counter_icon_1,
    title: "Medical Branch",
    color: "pink-color",
    bg_color: "iconpink",
  },
  {
    id: 2,
    count_number: 1230,
    icon: counter_icon_2,
    title: "MBBS Doctors",
    color: "green-color",
    bg_color: "icongreen",
  },
  {
    id: 3,
    count_number: 7620,
    icon: counter_icon_3,
    title: "Local Partners",
    color: "green-color",
    bg_color: "icongreen",
  },
  {
    id: 4,
    count_number: 2430,
    icon: counter_icon_4,
    title: "Experience Nurse",
    color: "pink-color",
    bg_color: "iconpink",
  },
]

const CounterAreaHomeFour = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  return (
    <>
      <div className="fact gray-bg">
        <div className="container-fluid p-0">
          <div className="row g-0 d-flex align-items-center">
            <div className="col-xl-5">
              <div className="h6fact-wrapper pt-30">
                <div className="row">
                  {counter_data.map((item, i) =>
                    <div key={i} className="col-lg-6 col-md-6">
                      <div className="h4facts-single border-facts text-center mb-30">
                        <i className={`h4facts-icon h4facts-${item.bg_color}`}>
                          <Image src={item.icon} alt="" />
                        </i>
                        <span className={`counter f-600 ${item.color}`}>
                          <Count number={item.count_number} add_style={true} />
                        </span>
                        <h5 className="f-500 theme-color">{item.title}</h5>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-xl-7">
              <div className="h4facts-thumbbox pos-rel text-right">
                <div className="h4facts-thumb">
                  <Image src={right_thumb} alt="" />
                  <a 
                    onClick={() => setIsVideoOpen(true)}
                    style={{ cursor: "pointer" }}
                    className="h4facts-playicon popup-video">
                    <i> <Image src={play_icon} alt="" /> 
                    </i>
                  </a>
                  <i className="h4facts-brandicon">
                    <Image src={brand_logo} alt="" />
                  </i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

export default CounterAreaHomeFour;