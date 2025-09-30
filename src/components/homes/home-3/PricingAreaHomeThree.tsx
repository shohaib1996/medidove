
import React from 'react';
import Image from 'next/image';
import pricing_data from '@/data/PricingData';

import back_icon from "@/assets/img/section/section-back-icon-blue.png";
import line_icon from "@/assets/img/shape/section-title-line.png";



const PricingAreaHomeThree = () => {
  return (
    <>
      <section id="pricing" className="pricing-area theme-bg pos-rel pt-140 pb-60">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-7 col-md-12">
              <div className="section-title section-title-m-0 pos-rel mb-75">
                <div className="section-icon">
                  <Image className="section-back-icon back-icon-left" src={back_icon} alt="theme-pure" />
                </div>
                <div className="section-text pos-rel">
                  <h5>Our Plans</h5>
                  <h1 className="white-color">Pricing & Plans</h1>
                </div>
                <div className="section-line pos-rel">
                  <Image src={line_icon} alt="theme-pure" />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-5 col-md-12">
              <nav className="pricing-nav mb-70">
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  <button className="nav-item nav-link active" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">
                    monthly
                  </button>
                  <button className="nav-item nav-link" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">
                    yearly
                  </button>
                </div>
              </nav>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="pricing-tab wow fadeInUp mb-30" data-wow-delay="0.3s">
                <div className="tab-content" id="nav-tabContent">
                  <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                    <div className="row">
                      {pricing_data.map((item, i) =>
                        <div key={i} className="col-xl-4 col-lg-4 col-md-6">
                          <div className="price-box-flat mb-30">
                            <div className="pricing-title">
                              <h6 className={`${i === 1 ? "white-color pink-bg" : "green-color"} text-up-case letter-spacing`}>{item.title}</h6>
                            </div>
                            <div className="price-content">
                              <div className="price-heading">
                                <h1><span className="pink-color">$</span>{item.monthly_price}</h1>
                              </div>
                              <div className="pricing-list">
                                <ul>
                                  {item.features?.map((feature, f_i) =>
                                    <li key={f_i} className={`${feature.cls}`}><i className="fas fa-check"></i> 
                                    {feature.cls ? <del> {feature.feature}</del> :  <>{feature.feature}</> }
                                   </li>
                                  )} 
                                </ul>
                              </div>
                            </div>
                            <div className="price-btn-2">
                              <button className={`btn ${i === 1 ? "green-bg white-color" : ""}`}>get appointment</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                    <div className="row">
                    {pricing_data.map((item, i) =>
                        <div key={i} className="col-xl-4 col-lg-4 col-md-6">
                          <div className="price-box-flat mb-30">
                            <div className="pricing-title">
                              <h6 className={`${i === 1 ? "white-color pink-bg" : "green-color"} text-up-case letter-spacing`}>{item.title}</h6>
                            </div>
                            <div className="price-content">
                              <div className="price-heading">
                                <h1><span className="pink-color">$</span>{item.yearly_price}</h1>
                              </div>
                              <div className="pricing-list">
                                <ul>
                                  {item.features?.map((feature, f_i) =>
                                    <li key={f_i} className={`${feature.cls}`}><i className="fas fa-check"></i> 
                                    {feature.cls ? <del> {feature.feature}</del> :  <>{feature.feature}</> }
                                   </li>
                                  )} 
                                </ul>
                              </div>
                            </div>
                            <div className="price-btn-2">
                              <button className={`btn ${i === 1 ? "green-bg white-color" : ""}`}>get appointment</button>
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
        </div>
      </section>
    </>
  );
};

export default PricingAreaHomeThree;