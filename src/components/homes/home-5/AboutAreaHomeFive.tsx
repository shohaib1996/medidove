
import React from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';

import bg_icon_1 from "@/assets/img/icon/services_bg_icon1.png";
import bg_icon_2 from "@/assets/img/icon/services_bg_icon2.png";
import bg_icon_3 from "@/assets/img/icon/services_bg_icon3.png";

import icon_1 from "@/assets/img/icon/h5services__icon1.png";
import icon_2 from "@/assets/img/icon/h5services__icon2.png";
import icon_3 from "@/assets/img/icon/h5services__icon3.png";


interface DataType {
  sub_title: string;
  title: string;
  about_data: ({
    id: number;
    color_bg: string;
    bg_img: StaticImageData;
    img: StaticImageData;
    title: string;
    sm_des?: string;
    btn_text?: string;
    day_1?: string;
    day_2?: string;
    time_1?: string;
    time_2?: string;
    day_3?: string;
    closed?: string;
  })[];
}


const about_content: DataType = {
  sub_title: "MediDove help increase your readers.",
  title: "25+ Years Of Since We Provide Medical Serving",
  about_data: [
    {
      id: 1,
      color_bg: "theme-bg",
      bg_img: bg_icon_1,
      img: icon_1,
      title: "Energercy Case",
      sm_des: "Must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and will give complete",
      btn_text: "conatct us",
    },
    {
      id: 1,
      color_bg: "theme-bg2",
      bg_img: bg_icon_2,
      img: icon_2,
      title: "Medical Care",
      sm_des: "Must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and will give complete",
      btn_text: "read more",
    },
    {
      id: 1,
      color_bg: "pink-bg",
      bg_img: bg_icon_3,
      img: icon_3,
      title: "Opening Hours",
      day_1: "Mon - Friday",
      day_2: "Mon - Friday",
      time_1: "08:00 am - 09:00 pm",
      time_2: "05:00 pm - 08:00 pm",
      day_3: "Sunday",
      closed: "Closed",

    },
  ]

}
const { sub_title, title, about_data } = about_content

const AboutAreaHomeFive = () => {
  return (
    <>
      <section className="about-area pt-130 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <div className="about-title text-center mb-60">
                <h5 className="pink-color">{sub_title}</h5>
                <h1>{title}</h1>
              </div>
            </div>
          </div>
          <div className="row g-0">
            {about_data.map((item, i) =>
              <div key={i} className="col-lg-4 mb-30">
                <div className={`h5services-wrapper ${item.color_bg}`}>
                  <i className="h5sicon-bg"><Image src={item.bg_img} alt="icon" /></i>
                  <div className="h5services-content">
                    <i className="h5services-icon"><Image src={item.img} alt="theme-pure" /></i>
                    <h3 className="white-color h5services-title">{item.title}</h3>
                    {i === 2 ?
                      <>
                        <ul className="h5services-events">
                          <li className="white-color f-500"> {item.day_1} <span>{item.time_1}</span></li>
                          <li className="white-color f-500"> {item.day_2} <span>{item.time_2}</span></li>
                        </ul>
                        <ul className="h5services-events h5sclose-days">
                          <li className="white-color f-500"> {item.day_3} <span>{item.closed}</span></li>
                        </ul>
                      </>
                      :
                      <>
                        <p>{item.sm_des}</p>
                        <Link href="#" className="green-color text-uppercase f-500"><span className="plus">
                          +</span><span className="link">{item.btn_text}</span>
                        </Link>
                      </>
                    }
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

export default AboutAreaHomeFive;