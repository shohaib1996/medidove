'use client'
import React from 'react';
import NiceSelect from '@/ui/NiceSelect';

const calculate_content = {
  sub_title: "make a call",
  title: "Quote Calculator",
  sm_des: "If you require services on a public holiday, overnight services or live-in services, please call (+00)888.666.88 so we can discuss prices with you.",

}
const {sub_title, title, sm_des}  = calculate_content


const ServiceCalculateArea = () => {
  const selectHandler = (e: any) => { };
  return (
    <>
      <section className="calculate-area position-relative pt-115 pb-120" 
      style={{ backgroundImage: `url(/assets/img/calculate/calculate-bg.png)` }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-7 col-lg-6 col-md-10">
              <div className="section-title calculate-section pos-rel mb-45">
                <div className="section-text section-text-white pos-rel">
                  <h5>{sub_title}</h5>
                  <h1 className="white-color">{title}</h1>
                  <p>{sm_des}</p>
                </div>
              </div>
              <div className="section-button section-button-left mb-30">
                <a data-animation="fadeInLeft" data-delay=".6s" href="#" className="btn btn-icon btn-icon-green ml-0">
                  <span>+</span>Make Appointment
                </a>
              </div>
            </div>
            <div className="col-xl-5 col-lg-6">
              <div className="calculate-box white-bg position-relative">
                <div className="calculate-content">
                  <div className="row">
                    <div className="col-xl-12">
                      <NiceSelect
                        className="postform"
                        options={[
                          { value: "When would you like our support?", text: "01. When would you like our support?" },
                          { value: "When would you like our support?", text: "02. When would you like our support?" },
                        ]}
                        defaultCurrent={0}
                        onChange={selectHandler}
                        name=''
                        placeholder=''
                      />
                    </div>
                    <div className="col-xl-12">
                      <NiceSelect
                        className="postform"
                        options={[
                          { value: "When would you like us arrive?", text: "01. When would you like us arrive?" },
                          { value: "When would you like our support?", text: "02. When would you like our support?" },
                        ]}
                        defaultCurrent={0}
                        onChange={selectHandler}
                        name=''
                        placeholder=''
                      />
                    </div>
                    <div className="col-xl-12">
                      <NiceSelect
                        className="postform"
                        options={[
                          { value: "How long should we stay?", text: "01. How long should we stay?" },
                          { value: "When would you like our support?", text: "02. When would you like our support?" },
                        ]}
                        defaultCurrent={0}
                        onChange={selectHandler}
                        name=''
                        placeholder=''
                      />
                    </div>
                    <div className="col-xl-12">
                      <NiceSelect
                        className="postform"
                        options={[
                          { value: "Where are you located?", text: "01. Where are you located?" },
                          { value: "When would you like our support?", text: "02. When would you like our support?" },
                          { value: "When would you like our support?", text: "03. When would you like our support?" },
                        ]}
                        defaultCurrent={0}
                        onChange={selectHandler}
                        name=''
                        placeholder=''
                      />
                    </div>
                    <div className="col-xl-12">
                      <form className="calculate-form" action="#">
                        <input type="text" placeholder="Your Phone number" />
                        <i className="fas fa-phone"></i>
                      </form>
                    </div>
                  </div>
                </div>
                <button className="primary_btn mt-40">submit query</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceCalculateArea;