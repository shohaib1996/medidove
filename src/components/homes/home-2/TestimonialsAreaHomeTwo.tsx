'use client'
import quate_icon from "@/assets/img/testimonials/testi-quato-icon.png";
import testimonials_data from "@/data/TestimonialsData";
import Image from "next/image";
import Slider from "react-slick";
import React, {useRef} from "react"
import back_icon from "@/assets/img/section/section-back-icon.png";
import line_icon from "@/assets/img/shape/section-title-line.png";
 
const setting = {
  dots: false,
  arrows: false,
  infinite: false,
  speed: 300,
  slidesToShow: 2,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }

  ]
}
const TestimonialsAreaHomeTwo = () => {
  const sliderRef = useRef<Slider | null>(null);
  return (
    <>
      <div className="testimonials-area pt-115 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 offset-xl-3 col-lg-10 offset-lg-1 col-md-10 offset-md-1">
              <div className="section-title text-center pos-rel mb-70">
                <div className="section-icon">
                  <Image className="section-back-icon" src={back_icon} alt="theme-pure" />
                </div>
                <div className="section-text pos-rel">
                  <h5>Testimonials</h5>
                  <h1>Our Happy Clients Says About Us.</h1>
                </div>
                <div className="section-line pos-rel">
                  <Image src={line_icon} alt="theme-pure" />
                </div>
              </div>
            </div>
          </div>
          <Slider {...setting} ref={sliderRef}  className="custom-row testimonials-activation">
            {testimonials_data.slice(0, 6).map((item, i) =>
              <div key={i} className="col-xl-12">
                <div className="testi-box-2">
                  <div className="test-rating-inner d-flex justify-content-between mb-30 align-items-center pr-15">
                    <div className="testi-quato-icon testi-quato-icon-green m-0">
                      <Image src={quate_icon} alt="theme-pure" />
                    </div>
                    <div className="testi-rating-list">
                      <ul>
                        <li><i className="fas fa-star"></i></li>
                        <li><i className="fas fa-star"></i></li>
                        <li><i className="fas fa-star"></i></li>
                        <li><i className="fas fa-star"></i></li>
                        <li><i className="fas fa-star"></i></li>
                      </ul>
                    </div>
                  </div>
                  <div className="testi-content-2">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div className="testi-author d-flex align-items-center mt-30">
                    <div className="testi-author-icon-2">
                      <Image src={item.img} alt="theme-pure" />
                    </div>
                    <div className="testi-author-desination-2">
                      <h4>{item.name}</h4>
                      <span>Founder At <span className="f-500 green-color">{item.job_title}</span></span>
                    </div>
                  </div>
                </div>
              </div>
            )} 
          </Slider>
        </div>
      </div>
    </>
  );
};

export default TestimonialsAreaHomeTwo;