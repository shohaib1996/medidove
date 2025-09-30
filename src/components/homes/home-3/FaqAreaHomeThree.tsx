
import React from 'react';

import faq_img_1 from "@/assets/img/faq/faq-left-back.jpg";
import faq_img_2 from "@/assets/img/faq/faq-left-front.jpg";
import faq_img_3 from "@/assets/img/faq/faq-left-back-shape.png";
import Image from 'next/image';


type DataType = {
  id: number;
  tab_id: string;
  qustion: string;
  ans: string;
}[]

const faq_data: DataType = [
  {
    id: 1,
    tab_id: "One",
    qustion: "Why we doing batter with medidove wp theme?",
    ans: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    id: 2,
    tab_id: "Two",
    qustion: "Read the most popular medical news and articles?",
    ans: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    id: 3,
    tab_id: "Three",
    qustion: "Let's find an office near you?",
    ans: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    id: 4,
    tab_id: "Four",
    qustion: "Powerfully flexible WordPress theme for medical & health?",
    ans: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    id: 5,
    tab_id: "Five",
    qustion: "Related organizations, institutes, clinics and businesses?",
    ans: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
]

const FaqAreaHomeThree = () => {
  return (
    <>
      <div className="section-faq-area pt-120 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-4 d-lg-none d-xl-block">
              <div className="faq-left-box pos-rel mb-200">
                <div className="faq-left-img">
                  <Image className="img" src={faq_img_1} alt="theme-pure" />
                </div>
                <div className="faq-pos-front">
                  <Image className="img" src={faq_img_2} alt="theme-pure" />
                </div>
                <div className="faq-back-shape">
                  <Image className="img" src={faq_img_3} alt="theme-pure" />
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-12">
              <div className="about-title mb-45">
                <h5 className="pink-color">FAQ</h5>
                <h1>Get Every Single Answers There.</h1>
              </div>
              <div className="faq-right-box">
                <div className="accordion mt-40" id="accordionExample">
                  {faq_data.map((item, i) =>
                    <div key={i} className="accordion-item">
                      <div className="accordion-header" id={`heading${item.tab_id}`}>
                        <h5 className="mb-0">
                          <button
                            className={`accordion-button ${i === 1 ? "" : "collapsed"} btn-link`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${item.tab_id}`}
                            aria-expanded={`${i === 1 ? "true" : "false"}`}
                            aria-controls={`collapse${item.tab_id}`}
                          >
                            {item.qustion}
                          </button>
                        </h5>
                      </div>
                      <div id={`collapse${item.tab_id}`}
                        className={`accordion-collapse collapse ${i === 1 ? "show" : ""}`}
                        aria-labelledby={`heading${item.tab_id}`}
                        data-bs-parent="#accordionExample">
                        <div className="accordion-body card-body">
                          {item.ans}
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

export default FaqAreaHomeThree;