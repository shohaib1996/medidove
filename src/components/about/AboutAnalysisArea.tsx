
import React from 'react';
import Image, { StaticImageData } from 'next/image';
import tab_icon_1 from "@/assets/img/analysis/search-icon.png";
import tab_icon_2 from "@/assets/img/analysis/search-icon-2.png";
import tab_icon_3 from "@/assets/img/analysis/search-icon-3.png";
import bg_icon from "@/assets/img/analysis/analysis-bg-icon.png";
import chart from "@/assets/img/analysis/chart.png";
import Link from 'next/link';


interface DataType {
  tab_data: {
      id: string;
      img: StaticImageData;
      title: string;
  }[];
  tab_inner_data: {
      id: string;
      sub_title: string;
      title: string;
      sm_des: string;
  }[];
}

const about_analysis_content: DataType = {
  tab_data: [
    {
      id: "home",
      img: tab_icon_1,
      title: "Industry analysis",
    },
    {
      id: "profile",
      img: tab_icon_2,
      title: "Our comitment",
    },
    {
      id: "contact",
      img: tab_icon_3,
      title: "how we start care?",
    }
  ],
  tab_inner_data: [
    {
      id: "home",
      sub_title: "01. Improve your experience.",
      title: "01. Professionals We Care About You.",
      sm_des: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip  ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
    {
      id: "profile",
      sub_title: "02. Improve your experience.",
      title: "02. Professionals We Care About You.",
      sm_des: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip  ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
    {
      id: "contact",
      sub_title: "03. Improve your experience.",
      title: "03. Professionals We Care About You.",
      sm_des: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip  ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
  ]
}
const { tab_data, tab_inner_data } = about_analysis_content

const AboutAnalysisArea = () => {
  return (
    <>
      <section className="analysis-area pos-rel theme-bg pb-90">
        <div className="analysis-bg-icon">
          <Image src={bg_icon} alt="theme-pure" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <ul className="nav nav-pills mb-3 mb-65" id="pills-tab" role="tablist">
                {tab_data.map((item, i) =>
                  <li key={i} className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${i === 0 ? "active" : ""}`}
                      id={`pills-${item.id}-tab`}
                      data-bs-toggle="pill"
                      data-bs-target={`#pills-${item.id}`}
                      type="button" role="tab"
                      aria-controls={`pills-${item.id}`} aria-selected={`${i === 0 ? "true" : "false"}`}>
                      <Image src={item.img} alt="theme-pure" />
                      <h6>{item.title}</h6>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="tab-content" id="pills-tabContent">
                {tab_inner_data.map((item2, index) =>
                  <div key={index} className={`tab-pane fade ${index === 0 ? "show active" : ""}`}
                    id={`pills-${item2.id}`}
                    role="tabpanel"
                    aria-labelledby={`pills-${item2.id}-tab`}>
                    <div className="row">
                      <div className="col-xl-6 col-lg-8">
                        <div className="section-title pos-rel mb-40">
                          <div className="section-text section-text-white section-text-green pos-rel">
                            <h5>{item2.sub_title}</h5>
                            <h1 className="white-color">{item2.title}</h1>
                            <p>{item2.sm_des}</p>
                          </div>
                        </div>
                        <div className="section-button section-button-left mb-30">
                          <Link data-animation="fadeInLeft" data-delay=".6s" href="#"
                            className="btn btn-icon ml-0"><span>+</span>
                            Make Appointment</Link>
                        </div>
                      </div>
                      <div className="col-xl-6 col-lg-4">
                        <div className="analysis-chart mb-30">
                          <Image src={chart} alt="theme-pure" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutAnalysisArea;