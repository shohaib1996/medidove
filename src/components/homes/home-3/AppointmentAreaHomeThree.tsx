import Link from 'next/link';
import React from 'react';


type DataType = {
  sub_title: string;
  title: string;
  btn_text: string;
}
const appointment_content: DataType = {
  sub_title: "Health Care Services",
  title: "Don't Hesitate, Contact Us For Better Help & Services.",
  btn_text: "Make Appointment",
}
const {btn_text, sub_title, title} = appointment_content

const AppointmentAreaHomeThree = () => {
  return (
    <>
      <section className="fact-area fact-map green-bg pos-rel pt-115 pb-60">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-9 col-lg-8 col-md-12">
              <div className="section-title pos-rel mb-45">
                <div className="section-text section-text-white pos-rel">
                  <h5 className="white-color">{sub_title}</h5>
                  <h1 className="white-color">{title}</h1>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4">
              <div className="section-button section-button-left mb-30">
                <Link data-animation="fadeInLeft" data-delay=".6s" href="/appoinment" className="btn btn-icon btn-icon-dark ml-0">
                  <span>+</span>{btn_text}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AppointmentAreaHomeThree;