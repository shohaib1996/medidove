import React from 'react';
import Image from 'next/image';

import back_icon from "@/assets/img/section/section-back-icon.png";
import title_line from "@/assets/img/shape/section-title-line.png";

import icon_1 from "@/assets/img/home4/how/icon1.png";
import icon_2 from "@/assets/img/home4/how/icon2.png";
import icon_3 from "@/assets/img/home4/how/icon3.png";

import shape from "@/assets/img/home4/how/move-icon.png";


const hiw_content = {
  sub_title: "How It Works",
  title: "You Will Be Able To Access Our Services Following 3 Steps",
  hiw_data: [
    {
      id: 1,
      icon: icon_1,
      title: "Have A Coffee",
      sm_des: "incididunt lorem ipsum dolor sit amet, consecte turadipisicing elit, sed do eiusmod tempor ut lab.",
      shape: shape,
    },
    {
      id: 2,
      icon: icon_2,
      title: "Choose Doctor",
      sm_des: "turadipisicing incididunt lorem ipsum dolor sit amet, consecte elit, sed do eiusmod tempor ut lab.",
      shape: shape,
    },
    {
      id: 3,
      icon: icon_3,
      title: "Admission Now",
      sm_des: "consecte incididunt lorem ipsum dolor sit amet, turadipisicing elit, sed do eiusmod tempor ut lab.",
    },
  ]
}
const { sub_title, title, hiw_data } = hiw_content

const HowItWorksHomeFour = () => {
  return (
    <>
      <section className="howitworks pt-180 pb-80">
        <div className="container">
          <div className="row">
            <div className="col-xl-10 offset-xl-1 col-lg-10 offset-lg-1">
              <div className="section-title text-center pos-rel mb-75">
                <div className="section-icon">
                  <Image className="section-back-icon" src={back_icon} alt="" />
                </div>
                <div className="section-text pos-rel">
                  <h5>{sub_title}</h5>
                  <h1>
                    {title}
                  </h1>
                </div>
                <div className="section-line pos-rel">
                  <Image src={title_line} alt="theme-pure" />
                </div>
              </div>
            </div>
          </div>
          <div className="row position-relative d-flex justify-content-between">
            {hiw_data.map((item, i) =>
              <div key={i} className={`col-lg-3 col-md-4 ${item.id === 3 ? "" : "pos-rel"}`}>
                <div className="howit-box text-center mb-40">
                  <i><Image src={item.icon} alt="theme-pure" /></i>
                  <h3>{item.title}</h3>
                  <p>{item.sm_des}</p>
                  {item.shape &&
                    <Image src={item?.shape} className="move-icon" alt="theme-pure" />
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorksHomeFour;