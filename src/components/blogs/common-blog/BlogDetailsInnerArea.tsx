'use client'
import Image from 'next/image';
import React, { useRef, useState } from 'react';

import blog_img_thumb from "@/assets/img/blog/b2.jpg";
import blog_img from "@/assets/img/blog/b6.jpg";
import SocialLinks from '@/components/common/SocialLinks';
import filter_img from '@/assets/img/icon/filter.png';
import avatar_img from '@/assets/img/blog/details/author.png';
import comment_avatar_1 from '@/assets/img/blog/details/comments1.png';
import comment_avatar_2 from '@/assets/img/blog/details/comments2.png';
import CommentsForm from '@/components/forms/CommentsForm';
import left_side_img from '@/assets/img/blog/b9.jpg';
import video_thumb from '@/assets/img/blog/b3.jpg';
import VideoPopup from '@/modals/VideoPopup';


import Slider from "react-slick";

import slider_img_1 from "@/assets/img/blog/b7.jpg";
import slider_img_2 from "@/assets/img/blog/b5.jpg";
import slider_img_3 from "@/assets/img/blog/b6.jpg";
const slider_images = [slider_img_1, slider_img_2, slider_img_3]

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


const blog_details_content = {
  time: "September 15, 2023",
  post_writer: "Diboli B. Joly",
  comments: 24,
  title_1: "If you find yourself constantly bookmarking health sections on news.",
  title_2: "A cleansing hot shower or bath",
  title_3: "Setting the mood with incense",
  description_1: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut  aliquip ex ea commodo.",
  description_2: "Bccaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab  illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi  nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
  description_3: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.",
  description_4: "consectetur adipisicing elit, sed do eiusmod  lorem ipsum dolor sit amet, tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
  description_5: "eiusmod tempor incididunt ut labore et dolore  lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
  description_6: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequa aute irure dolor.",
  qoute_text: "This health blog from NPR takes a fairly broad look at the medical world,.",
  qoute_writer: "Rosalina Pong",
  comments_data: [
    {
      id: 1,
      img: comment_avatar_1,
      name: "Karon Balina",
      time: "19th May 2023",
      comment_text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",

    },
    {
      id: 2,
      img: comment_avatar_2,
      name: "Julias Roy",
      time: "19th May 2023",
      comment_text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",

    },
    {
      id: 3,
      img: comment_avatar_1,
      name: "Arista Williamson",
      time: "19th May 2023",
      comment_text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",

    },

  ]

}
const {
  time,
  post_writer,
  comments,
  title_1,
  title_2,
  title_3,
  description_1,
  description_2,
  description_3,
  description_4,
  description_5,
  description_6,
  qoute_text,
  qoute_writer,
  comments_data,
} = blog_details_content

const BlogDetailsInnerArea = ({ style_details, style_left, style_audio, style_video, style_gallery }: any) => {
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
      <div className="col-lg-8">
        <article className="postbox post format-image mb-40">
          {style_details &&
            <div className="postbox__thumb mb-35">
              <Image src={blog_img_thumb} alt="blog image" />
            </div>

          }
          {style_left &&
            <div className="postbox__thumb mb-35">
              <Image src={left_side_img} alt="blog image" />
            </div>
          }
          {style_audio &&
            <div className="postbox__audio embed-responsive embed-responsive-16by9 mb-35">
              <iframe style={{ width: '100%', height: "500px" }}
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/469608615&color=%23ff0000&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe>
            </div>
          }
          {style_video &&
            <div className="postbox__video mb-35">
              <Image src={video_thumb} alt="blog image" />
              <a className="popup-video video-btn"
                onClick={() => setIsVideoOpen(true)}
                style={{ cursor: "pointer" }}
              ><i className="fas fa-play"></i></a>
            </div>
          }
          {style_gallery &&
            <div className="postbox__gallery mb-35 position-relative">
              <button type="button" className="slick-prev slick-arrow" onClick={handlePrev}>
                <i className="fas fa-arrow-left"></i>
              </button>
              <button type="button" className="slick-next slick-arrow" onClick={handleNext}>
                <i className="fas fa-arrow-right"></i>
              </button>
              <Slider {...setting} ref={sliderRef}>
                {slider_images.map((item, i) =>
                  <Image src={item} key={i} style={{ width: '100%', height: 'auto' }} alt="portfolio image" />
                )}
              </Slider>
            </div>
          }



          <div className="postbox__text bg-none">
            <div className="post-meta mb-15">
              <span><i className="far fa-calendar-check"></i> {time} </span>
              <span><a href="#"><i className="far fa-user"></i>{post_writer}</a></span>
              <span><a href="#"><i className="far fa-comments"></i> {comments} Comments</a></span>
            </div>
            <h3 className="blog-title">{title_1}</h3>
            <div className="post-text mb-20">
              <p>{description_1}</p>
              <p>{description_2}</p>
              <blockquote>
                <p>{qoute_text}</p>
                <footer>- {qoute_writer}</footer>
              </blockquote>
              <p>{description_3}</p>

              <div className="blog-inner-img mb-30 mt-30">
                <Image src={blog_img} alt="blog image" />
              </div>

              <div className="inner-content">
                <h4>{title_2}</h4>
                <p>{description_4}</p>
              </div>
              <div className="inner-content">
                <h4>{title_3}</h4>
                <p>{description_5}</p>
              </div>
            </div>
            <div className="row mt-50">
              <div className="col-xl-8 col-lg-8 col-md-8 mb-15">
                <div className="blog-post-tag">
                  <span>Releted Tags</span>
                  <a href="#">organic</a>
                  <a href="#">Foods</a>
                  <a href="#">tasty</a>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 mb-15">
                <div className="blog-share-icon text-left text-md-right">
                  <span>Share: </span>
                  <SocialLinks />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="navigation-border pt-50 mt-40"></div>
              </div>
              <div className="col-xl-5 col-lg-5 col-md-5">
                <div className="bakix-navigation b-next-post text-left mb-30">
                  <span><a href="#">Prev Post</a></span>
                  <h4><a href="#">Tips on Minimalist</a></h4>
                </div>
              </div>
              <div className="col-xl-2 col-lg-2 col-md-2 ">
                <div className="bakix-filter text-left text-md-center mb-30">
                  <a href="#"><Image src={filter_img} alt="image-title" /></a>
                </div>
              </div>
              <div className="col-xl-5 col-lg-5 col-md-5">
                <div className="bakix-navigation b-next-post text-left text-md-end  mb-30">
                  <span><a href="#">Next Post</a></span>
                  <h4><a href="#">Tips on Minimalist</a></h4>
                </div>
              </div>
            </div>
          </div>
          <div className="author mt-80 mb-40">
            <div className="author-img text-center">
              <Image src={avatar_img} alt="image-title" />
            </div>
            <div className="author-text text-center">
              <h3>MD. Salim Rana</h3>
              <div className="author-icon">
                <SocialLinks />
              </div>
              <p>{description_6} </p>
            </div>
          </div>
          <div className="post-comments">
            <div className="blog-coment-title mb-30">
              <h2>03 Comments</h2>
            </div>
            <div className="latest-comments">
              <ul>
                {comments_data.map((comment, index) =>
                  <li key={index} className={index === 1 ? "children" : ""}>
                    <div className="comments-box">
                      <div className="comments-avatar">
                        <Image src={comment.img} alt="image-title" />
                      </div>
                      <div className="comments-text">
                        <div className="avatar-name">
                          <h5>{comment.name}</h5>
                          <span>{comment.time}</span>
                          <a className="reply" href="#"><i className="fas fa-reply"></i>Reply</a>
                        </div>
                        <p>{comment.comment_text}</p>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="post-comments-form">
            <div className="post-comments-title">
              <h2>Post Comments</h2>
            </div>
            <CommentsForm />
          </div>
        </article>
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

export default BlogDetailsInnerArea;