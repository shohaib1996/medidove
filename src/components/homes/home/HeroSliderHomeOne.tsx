'use client'
import Link from 'next/link';
import Slider from "react-slick";
import React, { useRef, useState } from 'react';
import VideoPopup from '@/modals/VideoPopup';

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
interface SliderDataType {
	id: number;
	bg_img: string;
	sub_title: string;
	title: string;
	sm_info: string;
}[]
const hero_slider_data: SliderDataType[] = [
	{
		id: 1,
		bg_img: "slider_bg_1",
		sub_title: "We are here for your care.",
		title: "Best Care & Better Doctor.",
		sm_info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
	},
	{
		id: 2,
		bg_img: "slider_bg_2",
		sub_title: "We are here for your care.",
		title: "Best Care && Better Doctor.",
		sm_info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
	},
]

const HeroSliderHomeOne = () => {
	const sliderRef = useRef<Slider | null>(null);
	const [isVideoOpen, setIsVideoOpen] = useState(false);

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
				<div className="hero-slider">
					<div className="slider-active slick-initialized slick-slider">
						<button type="button" className="slick-prev slick-arrow" onClick={handlePrev}>
							<i className="fas fa-arrow-left"></i>
						</button>
						<button type="button" className="slick-next slick-arrow" onClick={handleNext}>
							<i className="fas fa-arrow-right"></i>
						</button>
						<Slider {...setting} ref={sliderRef} >
							{hero_slider_data.map((item, i) =>
								<div key={i} className={`single-slider slider-height d-flex align-items-center ${item.bg_img}`}>
									<div className="container"> 
										<div className="row">
											<div className="col-xl-6 col-lg-8 col-md-10">
												<div className="hero-text">
													<div className="hero-slider-caption ">
														<h5 data-animation="fadeInUp" data-delay=".2s">{item.sub_title}</h5>
														<h1 data-animation="fadeInUp" data-delay=".4s">{item.title}</h1>
														<p data-animation="fadeInUp" data-delay=".6s">{item.sm_info}</p>
													</div>
													<div className="hero-slider-btn">
														<Link data-animation="fadeInLeft"
															data-delay=".6s" href="/appoinment" className="btn btn-icon ml-0"><span>+</span>Make Appointment</Link>
														<a data-animation="fadeInRight"
															data-delay="1.0s"
															onClick={() => setIsVideoOpen(true)}
															style={{ cursor: "pointer" }}
															className="play-btn popup-video"><i className="fas fa-play"></i></a>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
						</Slider>
					</div>
				</div>
			</section>
			{/* video modal start */}
			<VideoPopup
				isVideoOpen={isVideoOpen}
				setIsVideoOpen={setIsVideoOpen}
				videoId={'TYYf8zYjP5k'}
			/>
			{/* video modal end */}

		</>
	);
};

export default HeroSliderHomeOne;