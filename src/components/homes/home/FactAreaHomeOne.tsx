import Link from 'next/link';
import React from 'react';

const fact_content = {
  sub_title: "Always-on patient intake",
  title: "Capture Requests Across Every Channel.",
  fact_data: [
    {
      id: 1,
      count_number: "4",
      icon: "fas fa-user",
      title: "AI Intake Channels",
      sm_des: "Website chat, appointment forms, WhatsApp replies, and voice receptionist calls feed the clinic admin dashboard."
    },
    {
      id: 2,
      count_number: "24",
      icon: "far fa-thumbs-up",
      title: "Hour Follow-Up",
      sm_des: "Automations can queue reminders, callbacks, feedback requests, and staff tasks while checking patient consent."
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
