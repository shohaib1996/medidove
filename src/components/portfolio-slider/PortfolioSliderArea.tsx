"use client"
import React, {useRef} from 'react';
import Image from "next/image";
import Slider from "react-slick";

import slider_img_1 from "@/assets/img/portfolio/lg-1.jpg";
import slider_img_2 from "@/assets/img/portfolio/lg-2.jpg";
import slider_img_3 from "@/assets/img/portfolio/lg-3.jpg";
import slider_img_4 from "@/assets/img/portfolio/lg-4.jpg";
const slider_images = [slider_img_1, slider_img_2, slider_img_3, slider_img_4]

const setting = {
	dots: false,
	arrows: false,
	infinite: true,
	speed: 300, 
	slidesToShow: 1,
	slidesToScroll: 1,
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
				slidesToScroll: 1
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
const PortfolioSliderArea = () => {
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
      <section className="portfolio-area pt-120 pb-90">
            <div className="container">
                <div className="postbox__gallery mb-35 position-relative"> 
								<button type="button" className="slick-prev slick-arrow" onClick={handlePrev}>
									<i className="fas fa-arrow-left"></i>
								</button>
								<button type="button" className="slick-next slick-arrow" onClick={handleNext}>
									<i className="fas fa-arrow-right"></i>
								</button>
								<Slider {...setting} ref={sliderRef}> 
										{slider_images.map((item, i)  => 
												<Image src={item} key={i} style={{width: '100%', height: 'auto'}} alt="portfolio image" />                
										)} 								
								</Slider>
                </div>
            </div>
        </section>
    </>
  );
};

export default PortfolioSliderArea;