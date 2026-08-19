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

type BlogInnerAreaProps = {
  style?: boolean;
};

const BlogInnerArea = ({style}: BlogInnerAreaProps) => {
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
                <Link href="/blog">
                  {item.img ? <Image src={item.img} style={{ width: "100%", height: "auto" }} alt="blog image" /> : <></>}
                </Link>
              </div>
            }
            {item.caragory === "video" &&
              <div className="postbox__video">
                {item.img ? <Image src={item.img} style={{ width: "100%", height: "auto" }} alt="blog image" /> : <></>}
                <button
                  type="button"
                  aria-label="Play blog video"
                  className="popup-video video-btn"
                  onClick={() => setIsVideoOpen(true)}
                  style={{ background: "transparent", border: 0, cursor: "pointer" }}
                >
                  <i className="fas fa-play"></i>
                </button>
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
                <iframe title={item.title} src={item.audio} style={{ width: "100%", height: "450px" }}></iframe>
              </div>
            }


            <div className="postbox__text p-50">
              <div className="post-meta mb-15">
                <span><i className="far fa-calendar-check"></i> {item.time} </span>
                <span><Link href="/blog"><i className="far fa-user"></i>{item.post_writer}</Link></span>
                <span><Link href="/blog"><i className="far fa-comments"></i> {item.comments} Comments</Link></span>
              </div>
              <h3 className="blog-title">
                <Link href="/blog">{item.title}</Link>
              </h3>
              <div className="post-text mb-20">
                <p>{item.sm_des}</p>
              </div>
              <div className="read-more mt-30">
                <Link href="/blog" className="primary_btn btn theme-btn">read more</Link>
              </div>
            </div>
          </article>
        )}
        <article className="postbox post format-quote mb-40">
          <div className="post-text">
            <blockquote>
              <p>Clinic automation should save staff time, respect patient consent, and avoid replacing licensed clinical judgment.</p>
              <footer>- MediDove Safety Note</footer>
            </blockquote>
          </div>
        </article>

        <div className="basic-pagination basic-pagination-2 mb-40">
          <ul>
            <li><Link href="/blog"><i className="fas fa-angle-double-left"></i></Link></li>
            <li><Link href="/blog">01</Link></li>
            <li><Link href="/blog">02</Link></li>
            <li><Link href="/blog">03</Link></li>
            <li><Link href="/blog"><i className="fas fa-ellipsis-h"></i></Link></li>
            <li><Link href="/blog"><i className="fas fa-angle-double-right"></i></Link></li>
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
