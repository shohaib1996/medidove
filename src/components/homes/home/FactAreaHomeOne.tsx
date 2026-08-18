import Link from 'next/link';
import React from 'react';

const fact_content = {
  sub_title: "We are available 24/7",
  title: "We Always Ready For A Challenge.",
  fact_data: [
    {
      id: 1,
      count_number: "1M",
      icon: "fas fa-user",
      title: "Satisfied Patients",
      sm_des: "Consectetur Lorem ipsum dolor sit amet, adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      id: 1,
      count_number: "100",
      icon: "far fa-thumbs-up",
      title: "World Awards",
      sm_des: "adipisicing Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua "
    },

  ],
}
const { sub_title, title, fact_data } = fact_content

const FactAreaHomeOne = () => {
  return (
    <>
      <section className="fact-area fact-map primary-bg pos-rel pt-115 pb-60">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-10">
              <div className="section-title pos-rel mb-45">
                <div className="section-text section-text-white pos-rel">
                  <h5>{sub_title}</h5>
                  <h1 className="white-color">{title}</h1>
                </div>
              </div>
              <div className="section-button section-button-left mb-30">
                <Link data-animation="fadeInLeft" data-delay=".6s" href="/appointment" className="btn btn-icon ml-0">
                  <span>+</span>Make Appointment
                </Link>
              </div>
            </div>
            <div className="col-lg-6 col-lg-6 col-md-8">
              <div className="cta-satisfied">
                {fact_data.map((item, i) =>
                  <div key={i} className="single-satisfied mb-50">
                    <h1>{item.count_number}+</h1>
                    <h5> <i className={`${item.icon}`}></i>{item.title}</h5>
                    <p>{item.sm_des}</p>
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

export default FactAreaHomeOne;