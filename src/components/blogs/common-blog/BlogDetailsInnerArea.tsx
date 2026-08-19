'use client'
import Image from 'next/image';
import Link from 'next/link';
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
  time: "August 18, 2026",
  post_writer: "MediDove Team",
  comments: 3,
  title_1: "Smart appointment intake without unsafe diagnosis claims",
  title_2: "Route patients without pretending to diagnose",
  title_3: "Keep every automation reviewable",
  description_1: "A strong online clinic should help care teams collect better information without making medical decisions. MediDove structures appointment reasons, suggests departments, identifies urgent language, and prepares staff handoff notes.",
  description_2: "The safest positioning is operational support: scheduling, intake, reminders, lead handling, and patient communication. The assistant can explain services and recommend booking paths, but clinical advice remains with qualified professionals.",
  description_3: "For urgent symptoms, the system uses clear safety language and routes the patient toward emergency care instead of continuing a normal marketing or booking flow.",
  description_4: "Patients describe their reason for visit in natural language. The intake endpoint returns a suggested department, urgency level, and a concise appointment note that staff can review before confirming the visit.",
  description_5: "Call summaries, patient replies, campaign drafts, and chat messages are stored with enough context for a clinic team to understand what happened and what should happen next.",
  description_6: "MediDove is designed around sample patient workflows. Real healthcare deployments require consent handling, privacy review, and local compliance checks.",
  qoute_text: "Clinic automation is strongest when it saves staff time and leaves clinical judgment with licensed professionals.",
  qoute_writer: "MediDove Safety Note",
  comments_data: [
    {
      id: 1,
      img: comment_avatar_1,
      name: "Alicia Morgan",
      time: "12th August 2026",
      comment_text: "The consent and review language makes the workflow easier to explain to clinic teams.",

    },
    {
      id: 2,
      img: comment_avatar_2,
      name: "David Rahman",
      time: "14th August 2026",
      comment_text: "Voice call summaries and callback queues are the kind of concrete features clinic teams understand quickly.",

    },
    {
      id: 3,
      img: comment_avatar_1,
      name: "Sarah Mitchell",
      time: "18th August 2026",
      comment_text: "Separating patient routing from diagnosis is the right boundary for a responsible healthcare system.",

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

type BlogDetailsInnerAreaProps = {
  style_details?: boolean;
  style_left?: boolean;
  style_audio?: boolean;
  style_video?: boolean;
  style_gallery?: boolean;
};

const BlogDetailsInnerArea = ({
  style_details,
  style_left,
  style_audio,
  style_video,
  style_gallery,
}: BlogDetailsInnerAreaProps) => {
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
                title="Blog audio player"
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/469608615&color=%23ff0000&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe>
            </div>
          }
          {style_video &&
            <div className="postbox__video mb-35">
              <Image src={video_thumb} alt="blog image" />
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
              <span><Link href="/blog"><i className="far fa-user"></i>{post_writer}</Link></span>
              <span><Link href="/blog"><i className="far fa-comments"></i> {comments} Comments</Link></span>
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
                  <span>Related Tags</span>
                  <Link href="/blog">Virtual Reception</Link>
                  <Link href="/blog">Patient Intake</Link>
                  <Link href="/blog">Clinic Automation</Link>
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
                  <span><Link href="/blog">Prev Post</Link></span>
                  <h4><Link href="/blog">Consent-aware reminders</Link></h4>
                </div>
              </div>
              <div className="col-xl-2 col-lg-2 col-md-2 ">
                <div className="bakix-filter text-left text-md-center mb-30">
                  <Link href="/blog"><Image src={filter_img} alt="Blog index" /></Link>
                </div>
              </div>
              <div className="col-xl-5 col-lg-5 col-md-5">
                <div className="bakix-navigation b-next-post text-left text-md-end  mb-30">
                  <span><Link href="/blog">Next Post</Link></span>
                  <h4><Link href="/blog">Reception missed-call workflows</Link></h4>
                </div>
              </div>
            </div>
          </div>
          <div className="author mt-80 mb-40">
            <div className="author-img text-center">
              <Image src={avatar_img} alt="image-title" />
            </div>
            <div className="author-text text-center">
              <h3>MediDove Product Team</h3>
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
                          <Link className="reply" href="/contact"><i className="fas fa-reply"></i>Reply</Link>
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
