'use client'
import React, { useRef } from 'react';

import gallery_thumb_1 from "@/assets/img/home4/gallery/gallery__thumb.jpg";
import gallery_thumb_2 from "@/assets/img/home4/gallery/gallery__thumb2.jpg";
import gallery_thumb_3 from "@/assets/img/home4/gallery/gallery__thumb2.jpg";
import Image, { StaticImageData } from 'next/image';
import Slider from 'react-slick';

interface DataType {
  id: number;
  img: StaticImageData;
  title: string;
}[]

const photogallery_data: DataType[] = [
  {
    id: 1,
    img: gallery_thumb_1,
    title: "Our Hospitality",
  },
  {
    id: 2,
    img: gallery_thumb_2,
    title: "Trusted Partner",
  },
  {
    id: 3,
    img: gallery_thumb_3,
    title: "Hospitality Partner",
  },
]

const setting = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 300,  
  slidesToShow: 2,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
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
        slidesToScroll: 1,
        arrows: false,
      }
    }
  ]
}

const PhotoGalleryHomeFour = () => {
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
      <section className="photogallery pt-130 pb-180">
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="about-title mb-65">
                <h5 className="pink-color">Photo Gallery</h5>
                <h1>{"Let's"} See Latest Photo Album</h1>
              </div>
            </div>
          </div>
          <div className="row h4gallery-active slick-initialized slick-slider slick-dotted">
          <button type="button" className="slick-prev slick-arrow d-none d-md-block" onClick={handlePrev}>
            <i className="far fa-long-arrow-left"></i>
          </button>
          <button type="button" className="slick-next slick-arrow d-none d-md-block" onClick={handleNext}>
            <i className="far fa-long-arrow-right"></i>
          </button>

          {/* </div> */}
          <Slider {...setting} ref={sliderRef} >
            {photogallery_data.map((item, i) =>
              <div key={i} className="col-lg-6">
                <div className="gallery-box position-relative">
                  <Image style={{width: "100%", height: "auto", padding: "0px 10px"}} src={item.img} alt="" />
                  <div className="gallery-content">
                    <h2 className="f-600 theme-color">{item.title}</h2>
                  </div>
                </div>
              </div>
            )}
          </Slider>
        </div>
        </div>
      </section>
    </>
  );
};

export default PhotoGalleryHomeFour;