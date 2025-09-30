
import Link from 'next/link';
import React from 'react';
import ContactForm from '../forms/ContactForm';

const ContactFormArea = () => {
  return (
    <>
      <section className="contact-form-area gray-bg pt-100 pb-100">
        <div className="container">
          <div className="form-wrapper">
            <div className="row align-items-center">
              <div className="col-xl-8 col-lg-8">
                <div className="section-title mb-55">
                  <p><span></span> Anything On your Mind</p>
                  <h1>Estimate Your Idea</h1>
                </div>
              </div>
              <div className="col-xl-4 col-lg-3 d-none d-xl-block ">
                <div className="section-link mb-80 text-right">
                  <Link data-animation="fadeInLeft" data-delay=".6s" href="/appoinment" className="btn btn-icon ml-0">
                    <span>+</span>Make Appointment
                  </Link>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <ContactForm /> 
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactFormArea;