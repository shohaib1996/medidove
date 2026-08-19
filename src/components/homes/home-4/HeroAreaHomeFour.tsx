'use client'
import Link from "next/link";
import { useRef } from "react";
import Slider from "react-slick";

const setting = {
  autoplay: false,
  autoplaySpeed: 10000,
  dots: false,
  fade: true,
  arrows: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
      }
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false
      }
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false
      }
    }
  ]
}
const hero_slider_data = [
  {
    id: 1,
    title: "AI Clinic Reception",
    sm_des: "Capture patient calls, summarize appointment needs, and route follow-up tasks to staff from one connected workspace.",
    feature_list: [
      "ElevenLabs voice assistant",
      "Twilio call logging",
      "Supabase admin inbox",
    ],
  },
  {
    id: 2,
    title: "Patient Engagement Automation",
    sm_des: "Send consent-aware reminders, review AI-generated campaign copy, and track outreach activity before staff follows up.",
    feature_list: [
      "WhatsApp reminder flows",
      "AI campaign drafts",
      "Audit-ready activity history",
    ],
  },
]

type HeroAreaHomeFourProps = {
  style?: boolean;
};

const HeroAreaHomeFour = ({ style }: HeroAreaHomeFourProps) => {
  const sliderRef = useRef<Slider | null>(null);
  const handlePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  }

  return (
    <>
      <section className="hero-area">
        <div className="hero-slider slick-slider slider-active slick-initialized">
          <button type="button" className="slick-prev slick-arrow" onClick={handlePrev}>
            <i className="far fa-long-arrow-left"></i>
          </button>
          <button type="button" className="slick-next slick-arrow" onClick={handleNext}>
            <i className="far fa-long-arrow-right"></i>
          </button>
          <Slider {...setting} ref={sliderRef}>
            {hero_slider_data.map((item, i) =>
              <div key={i} className={`single-slider ${style ? "h4slider-bg h5slider_bg " : "h4slider-bg"} pos-rel d-flex align-items-center pl-55`}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xl-8 col-lg-12 col-md-10">
                      <div className="hero-text">
                        <div className="hero-slider-caption h4hero-content mb-35">
                          <h1 className="white-color" data-animation="fadeInUp" data-delay=".4s">{item.title}</h1>
                          <p className="white-color" data-animation="fadeInUp" data-delay=".6s">{item.sm_des}</p>
                          <div className="h4-span" data-animation="fadeInUp" data-delay=".8s">
                            {item.feature_list?.map((feature, index) =>
                              <span key={index} className="white-color">
                                <i className="fal fa-arrow-circle-right"></i><span>{feature}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="hero-slider-btn h4hero-btn">
                          <Link data-animation="fadeInLeft" data-delay=".9s"
                            href="/receptionist" className="btn btn-icon ml-0"><span>+</span>learn more
                          </Link>
                          <Link data-animation="fadeInLeft" data-delay="1s"
                            href="/service" className="btn btn-icon btn-icon-green ml-0"><span>+</span>Our services
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Slider>
        </div>
      </section>
    </>
  );
};

export default HeroAreaHomeFour;
