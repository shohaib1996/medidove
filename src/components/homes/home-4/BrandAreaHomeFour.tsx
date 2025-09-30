'use client'
import React, { useRef } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import brand_img_1 from "@/assets/img/home4/sponsors/sp1.png";
import brand_img_2 from "@/assets/img/home4/sponsors/sp2.png";
import brand_img_3 from "@/assets/img/home4/sponsors/sp3.png";
import brand_img_4 from "@/assets/img/home4/sponsors/sp4.png";
import brand_img_5 from "@/assets/img/home4/sponsors/sp5.png";
import brand_img_6 from "@/assets/img/home4/sponsors/sp6.png";
const brand_data = [brand_img_1, brand_img_2, brand_img_3, brand_img_4, brand_img_5, brand_img_6, brand_img_2]


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

const BrandAreaHomeFour = () => {
  const sliderRef = useRef<Slider | null>(null);
  return (
    <>
      <section className="h4brand-area pos-rel pb-130">
        <div className="container">
          <div className="row">
            <Slider {...setting}  ref={sliderRef} className="brand-active owl-carousel">
              {brand_data.map((item, i) =>
                <div key={i} className="single-brand">
                  <Image src={item} alt="" />
                </div>
              )} 
            </Slider>
          </div>
        </div>
      </section>
    </>
  );
};

export default BrandAreaHomeFour;