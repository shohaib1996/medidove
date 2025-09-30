'use client' 
import Image, { StaticImageData } from 'next/image'; 
import pricing_icon_1 from "@/assets/img/pricing/pricing-thumb-1.png";
import pricing_icon_2 from "@/assets/img/pricing/pricing-thumb-2.png";
import pricing_icon_3 from "@/assets/img/pricing/pricing-thumb-3.png";

import back_icon from "@/assets/img/section/section-back-icon.png";
import title_line from "@/assets/img/shape/section-title-line.png";

interface PriceingDataType {
  id: number;
  monthly_img: StaticImageData;
  yearly_img: StaticImageData;
  title: string;
  sm_des: string;
  monthly_price: number;
  yearly_price: number;
}[]

const priceing_data: PriceingDataType[] = [
  {
    id: 1,
    monthly_img: pricing_icon_1,
    yearly_img: pricing_icon_1,
    title: "Professional",
    sm_des: "Ut enim ad minim veniam, quis istomw nostrud exercitation ullamco laboris nisi ut aliquip ex eacommodo.",
    monthly_price: 489.00,
    yearly_price: 589.00,
  },
  {
    id: 2,
    monthly_img: pricing_icon_2,
    yearly_img: pricing_icon_2,
    title: "Advanced",
    sm_des: "Ut enim ad minim veniam, quis istomw nostrud exercitation ullamco laboris nisi ut aliquip ex eacommodo.",
    monthly_price: 599.00,
    yearly_price: 699.00,
  },
  {
    id: 3,
    monthly_img: pricing_icon_3,
    yearly_img: pricing_icon_3,
    title: "Advantage",
    sm_des: "Ut enim ad minim veniam, quis istomw nostrud exercitation ullamco laboris nisi ut aliquip ex eacommodo.",
    monthly_price: 999.00,
    yearly_price: 1500.00,
  },
]

const PricingAreaHomeOne = () => {
  return (
    <>
      <section className="pricing-area gray-bg pt-115 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-xl-5 col-lg-6 col-md-12">
              <div className="section-title pos-rel mb-75">
                <div className="section-icon">
                  <Image src={back_icon} className="section-back-icon back-icon-left" alt="theme-pure" />
                </div>
                <div className="section-text pos-rel">
                  <h5>Our Plans</h5>
                  <h1>Pricing &amp; Plans</h1>
                </div>
                <div className="section-line pos-rel">
                  <Image src={title_line} alt="theme-pure" />
                </div>
              </div>
            </div>
            <div className="col-xl-7 col-lg-6 col-md-12">
              <div className="pricing-menu f-right">
                <div className="nav nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                  <button  className="nav-link active" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">
                    monthly
                  </button>
                  <button className="nav-link" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">
                    yearly
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="tab-content" id="v-pills-tabContent">
                <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                  <div className="row">
                    {priceing_data.map((m_item, i) =>
                      <div key={i} className="col-xl-4 col-lg-4 col-md-6">
                        <div className="pricing-box mb-30">
                          <div className="pricing-thumb mb-45">
                            <Image src={m_item.monthly_img} alt="theme-pure" />
                          </div>
                          <div className="pricing-content">
                            <h1>{m_item.title}</h1>
                            <p>{m_item.sm_des}</p>
                            <a data-animation="fadeInLeft" data-delay=".6s" href="#" className="btn btn-icon ml-0">
                              <span>+</span>Price: $ {m_item.monthly_price}.00
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                  <div className="row">
                    {priceing_data.map((y_item, i) =>
                      <div key={i} className="col-xl-4 col-lg-4 col-md-6">
                        <div className="pricing-box mb-30">
                          <div className="pricing-thumb mb-45">
                            <Image src={y_item.yearly_img} alt="theme-pure" />
                          </div>
                          <div className="pricing-content">
                            <h1>{y_item.title}</h1>
                            <p>{y_item.sm_des}</p>
                            <a data-animation="fadeInLeft" data-delay=".6s" href="#" className="btn btn-icon ml-0"><span>+</span>Price:
                              $ {y_item.yearly_price}.00</a>
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
      </section>
    </>
  );
};

export default PricingAreaHomeOne;