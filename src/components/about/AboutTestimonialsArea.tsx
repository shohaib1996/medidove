
import Image from 'next/image';
import React from 'react';
import back_icon from "@/assets/img/section/section-back-icon.png";
import title_line from "@/assets/img/shape/section-title-line.png";
import testi_box from "@/assets/img/testimonials/testi-box-bg.png";
import quato from "@/assets/img/testimonials/testi-quato-icon.png";
import author from "@/assets/img/testimonials/testi-author-icon.png";


type DataType = {
  sub_title: string;
  title: string;
  sm_info: string;
  name: string;
  job_title: string;
}
const about_testi: DataType = {
  sub_title: "Testimonials",
  title: "Our Clients Says About Us",
  sm_info: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem. accusantium doloremque laudantium, totam rem aperiam.",
  name: "Rosalina D. Williamson",
  job_title: "founder, uithemes",
}
const {sub_title, title, sm_info, name, job_title} = about_testi

const AboutTestimonialsArea = () => {
  return (
    <>
      <div className="testimonials-area pt-115 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2 col-md-10 offset-md-1">
              <div className="section-title text-center pos-rel mb-40">
                <div className="section-icon">
                  <Image className="section-back-icon" src={back_icon} alt="theme-pure" />
                </div>
                <div className="section-text pos-rel">
                  <h5>{sub_title}</h5>
                  <h1>{title}</h1>
                </div>
                <div className="section-line pos-rel">
                  <Image src={title_line} alt="theme-pure" />
                </div>
              </div>
            </div>
          </div>
          <div className="single-testi">
            <div className="row">
              <div className="col-xl-10 offset-xl-1 col-lg-12 col-md-12">
                <div className="testi-box text-center pos-rel">
                  <div className="testi-content pos-rel">
                    <div className="testi-bg-icon">
                      <Image src={testi_box} alt="theme-pure" />
                    </div>
                    <div className="testi-quato-icon">
                      <Image src={quato} alt="theme-pure" />
                    </div>
                    <div className="text-text-boxx">
                      <p>{sm_info}</p>
                    </div>
                    <span></span>
                  </div>
                  <div className="testi-author">
                    <h2 className="testi-author-title">{name}</h2>
                    <span className="testi-author-desination">{job_title}</span>
                  </div>
                  <div className="test-author-icon">
                    <Image src={author} alt="theme-pure" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutTestimonialsArea;