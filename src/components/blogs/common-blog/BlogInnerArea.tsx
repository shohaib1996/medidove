'use client'
import blog_article_data from '@/data/BlogArticleData';
import VideoPopup from '@/modals/VideoPopup';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import Slider from 'react-slick';


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

const BlogInnerArea = ({style}: any) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
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
      <div className={`${style ? "offset-lg-2" : ""} col-lg-8`}>
        {blog_article_data.map((item, i) =>
          <article key={i} className={`postbox post ${item.cls} mb-40`}>
            {item.caragory === "blog" &&
              <div className="postbox__thumb">
                <a href="#">
                  {item.img ? <Image src={item.img} style={{ width: "100%", height: "auto" }} alt="blog image" /> : <></>}
                </a>
              </div>
            }
            {item.caragory === "video" &&
              <div className="postbox__video">
                {item.img ? <Image src={item.img} style={{ width: "100%", height: "auto" }} alt="blog image" /> : <></>}
                <a className="popup-video video-btn"
                  onClick={() => setIsVideoOpen(true)}
                  style={{ cursor: "pointer" }}><i
                    className="fas fa-play"></i></a>
              </div>
            }
            {item.caragory === "slider" &&
              <div className='postbox__gallery position-relative'>
                <button type="button" className="slick-prev slick-arrow" onClick={handlePrev}>
                  <i className="fas fa-arrow-left"></i>
                </button>
                <button type="button" className="slick-next slick-arrow" onClick={handleNext}>
                  <i className="fas fa-arrow-right"></i>
                </button>

                <Slider {...setting} ref={sliderRef}>
                  {item?.slider_images?.map((img, index) =>
                    <Image key={index} src={img} style={{ width: "100%", height: "auto" }} alt="blog image" />
                  )}
                </Slider>
              </div>
            }
            {item.caragory === "audio" &&
              <div className="postbox__audio embed-responsive embed-responsive-16by9">
                <iframe src={item.audio} style={{ width: "100%", height: "450px" }}></iframe>
              </div>
            }


            <div className="postbox__text p-50">
              <div className="post-meta mb-15">
                <span><i className="far fa-calendar-check"></i> {item.time} </span>
                <span><a href="#"><i className="far fa-user"></i>{item.post_writer}</a></span>
                <span><a href="#"><i className="far fa-comments"></i> {item.comments} Comments</a></span>
              </div>
              <h3 className="blog-title">
                <a href="#">{item.title}</a>
              </h3>
              <div className="post-text mb-20">
                <p>{item.sm_des}</p>
              </div>
              <div className="read-more mt-30">
                <Link href="#" className="primary_btn btn theme-btn">read more</Link>
              </div>
            </div>
          </article>
        )}
        <article className="postbox post format-quote mb-40">
          <div className="post-text">
            <blockquote>
              <p>This health blog from NPR takes a fairly broad look at the medical world,.</p>
              <footer>- Rosalina Pong</footer>
            </blockquote>
          </div>
        </article>

        <div className="basic-pagination basic-pagination-2 mb-40">
          <ul>
            <li><a href="#"><i className="fas fa-angle-double-left"></i></a></li>
            <li><a href="#">01</a></li>
            <li><a href="#">02</a></li>
            <li><a href="#">03</a></li>
            <li><a href="#"><i className="fas fa-ellipsis-h"></i></a></li>
            <li><a href="#"><i className="fas fa-angle-double-right"></i></a></li>
          </ul>
        </div>

      </div>

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

export default BlogInnerArea;