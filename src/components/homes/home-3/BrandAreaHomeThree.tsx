'use client'
import Image from 'next/image';
import Slider from 'react-slick';
import React, { useRef } from 'react';
import brand_img_1 from '@/assets/img/brand/brand1.png';
import brand_img_2 from '@/assets/img/brand/brand2.png';
import brand_img_3 from '@/assets/img/brand/brand3.png';
import brand_img_4 from '@/assets/img/brand/brand4.png';
import brand_img_5 from '@/assets/img/brand/brand5.png';
import brand_img_6 from '@/assets/img/brand/brand6.png';
const brands_img = [brand_img_1, brand_img_2, brand_img_3, brand_img_4, brand_img_5, brand_img_6, brand_img_2, brand_img_1, brand_img_2, brand_img_3, brand_img_4, brand_img_5, brand_img_6, brand_img_2]

const setting = {
  dots: false,
  arrows: false,
  infinite: false,
  speed: 300,
  slidesToShow: 5,
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

const BrandAreaHomeThree = () => {
  const sliderRef = useRef<Slider | null>(null);
  return (
    <>
      <section className="brand-area pos-rel pt-115 pb-110" style={{ backgroundImage: `url(/assets/img/slider/slider-bg-1.jpg)` }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-6 offset-xl-3">
              <div className="about-title text-center mb-70 position-relative z-1">
                <h5 className="green-color">Sponsors</h5>
                <h1 className="white-color">Our Some Popular Sponsors.</h1>
              </div>
            </div>
          </div>
          <div className="row">
            <Slider {...setting} ref={sliderRef} className="brand-active owl-carousel">
              {brands_img.map((item, i) =>
                <div key={i} className="single-brand d-flex justify-content-center">
                  <Image src={item} alt="theme-pure" />
                </div>
              )} 
            </Slider>
          </div>
        </div>
      </section>
    </>
  );
};

export default BrandAreaHomeThree;