'use client'
import NiceSelect from '@/ui/NiceSelect';
import React from 'react';

const ServiceContactForm = () => {
  const selectHandler = (e: any) => { };
  return (
    <>
      <form className="service-contact-form" onSubmit={e => e.preventDefault()}>
        <div className="row">
          <div className="col-xl-12">
            <div className="contact-input contact-icon contact-user mb-20">
              <input type="text" placeholder="Enter your name" />
            </div>
          </div>
          <div className="col-xl-12">
            <div className="contact-input contact-icon contact-mail mb-20">
              <input type="text" placeholder="Enter your email" />
            </div>
          </div>
          <div className="col-xl-12">
            <div className="contact-input contact-icon contact-hourglass">
              <NiceSelect
                className="service-option"
                options={[
                  { value: "1", text: "01. Select type of care" },
                  { value: "2", text: "02. Select type of care" },
                  { value: "3", text: "03. Select type of care" },
                ]}
                defaultCurrent={0}
                onChange={selectHandler}
                name=''
                placeholder=''
              />
            </div>
          </div>
        </div>
        <div className="ser-form-btn text-center mt-40">
          <a data-animation="fadeInLeft" data-delay=".6s" href="#" className="btn btn-icon ml-0"
            style={{ animationDelay: "0.6s" }}
            tab-index="0"><span>+</span>Request for call</a>
        </div>
      </form>
    </>
  );
};

export default ServiceContactForm;