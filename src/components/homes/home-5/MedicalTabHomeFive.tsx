import React from 'react';
import Image, { StaticImageData } from 'next/image';

import tab_img_1 from "@/assets/img/home5/tab/tab.jpg";
import tab_menu_icon_1 from "@/assets/img/home5/tab/tab__menu__icon1.png";
import tab_menu_icon_2 from "@/assets/img/home5/tab/tab__menu__icon2.png";
import tab_menu_icon_3 from "@/assets/img/home5/tab/tab__menu__icon3.png";

interface DataType {
  tab_id: string;
  img: StaticImageData;
  title: string;
  sm_des: string;
  features: string[];
}[]

const medical_tab_data: DataType[] = [
  {
    tab_id: "home",
    img: tab_img_1,
    title: "01. We Care Our Patient Very Carefully & Your Patient Happy With Us",
    sm_des: "Must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure,",
    features: [
      "The Best Medical Care In The Worlds",
      "Embarking On New Adventures Inspiring Desktop",
      "Local Development For Beginners Setup",
    ]
  },
  {
    tab_id: "profile",
    img: tab_img_1,
    title: "02. We Care Our Patient Very Carefully & Your Patient Happy With Us",
    sm_des: "Must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure,",
    features: [
      "The Best Medical Care In The Worlds",
      "Embarking On New Adventures Inspiring Desktop",
      "Local Development For Beginners Setup",
    ]
  },
  {
    tab_id: "contact",
    img: tab_img_1,
    title: "03. We Care Our Patient Very Carefully & Your Patient Happy With Us",
    sm_des: "Must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure,",
    features: [
      "The Best Medical Care In The Worlds",
      "Embarking On New Adventures Inspiring Desktop",
      "Local Development For Beginners Setup",
    ]
  },
]
const MedicalTabHomeFive = () => {
  return (
    <>
      <div className="medical-tab medical-tab-border">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="h5medical-tab-menu">
                <nav>
                  <div className="nav nav-tabs position-relative" id="nav-tab" role="tablist">

                    <button className="nav-item nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">
                      <i>
                      <Image src={tab_menu_icon_1} alt="theme-pure" />
                      </i> Dental Anxiety</button>
                    <button className="nav-item nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">
                      <i>
                      <Image src={tab_menu_icon_2} alt="theme-pure" />
                      </i> Orthopedic</button>
                    <button className="nav-item nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">
                      <i>
                      <Image src={tab_menu_icon_3} alt="theme-pure" />
                      </i> Dermatological</button>

                  </div>
                </nav>
              </div>
            </div>
            <div className="col-sm-12">
              <div className="h5medical-tab-body">
                <div className="tab-content" id="nav-tabContent">
                  {medical_tab_data.map((item, i) =>
                    <div key={i}
                      className={`tab-pane fade ${i === 0 ? "show active" : ""}`}
                      id={`nav-${item.tab_id}`}
                      role="tabpanel"
                      aria-labelledby={`nav-${item.tab_id}-tab`}>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="h5medical__thumb mb-30">
                            <Image src={item.img} alt="theme-pure" />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="h5medical-content mb-30">
                            <h4 className="f-600 theme-color">{item.title}</h4>
                            <p>{item.sm_des}</p>
                            <ul>
                              {item.features?.map((feature, index) =>
                                <li key={index}><i className="far fa-arrow-alt-circle-right"></i>{feature}</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )} 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicalTabHomeFive;