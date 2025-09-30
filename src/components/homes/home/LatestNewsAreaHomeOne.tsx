'use client'
import React from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';

import backIcon from "@/assets/img/section/section-back-icon.png";
import titleLine from "@/assets/img/shape/section-title-line.png";

import blog_thumb_1 from "@/assets/img/blog/blog-thumb-1.jpg";
import blog_thumb_2 from "@/assets/img/blog/blog-thumb-2.jpg";

// Data type
interface LatestContentDataType {
  sub_title: string;
  title: string;
  latest_news_data: {
      id: number;
      img: StaticImageData;
      tag_1: string;
      tag_2: string;
      title: string;
      sm_des: string;
  }[];
  singl_news: {
      id: number;
      title: string;
      time: string;
      comments: number;
  }[];
}
// latest content 
const latest_content: LatestContentDataType = {
  sub_title: "News",
  title: "Get Every Single Updates Here.",
  latest_news_data: [
    {
      id: 1,
      img: blog_thumb_1,
      tag_1: "Medical",
      tag_2: "Medicine",
      title: "incididunt lorem ipsum dolor sit amet, cons adidis dicolo wiran.",
      sm_des: "consectetur adipisicing elit, lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    },
    {
      id: 2,
      img: blog_thumb_2,
      tag_1: "Medical",
      tag_2: "Medicine",
      title: "ectetur lorem ipsum dolor sit amet, cons adidis dicolo wiran.",
      sm_des: "incididunt consectetur adipisicing elit, lorem ipsum dolor sit amet, sed do eiusmod tempor ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    },
  ],

  singl_news: [
    {
      id: 1,
      title: "consectetur lorem ipsum dolor sit amet, adidis.",
      time: "25 August 2023",
      comments: 22,
    },
    {
      id: 2,
      title: "adidis consectetur lorem ipsum dolor sit amet.",
      time: "26 August 2023",
      comments: 33,
    },
    {
      id: 3,
      title: "consectetur lorem ipsum dolor sit amet, adidis.",
      time: "27 August 2023",
      comments: 44,
    },
    {
      id: 3,
      title: "consectetur lorem ipsum dolor sit amet, adidis.",
      time: "27 August 2023",
      comments: 4422,
    },
  ]
}
const { sub_title, title, latest_news_data, singl_news } = latest_content

type DataType = {
  style?: any;
}
const LatestNewsAreaHomeOne = ({style}: DataType) => {
  return (
    <>
      <section className="latest-news-area pt-115 pb-20">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-7">
              <div className="section-title pos-rel mb-75">
                <div className="section-icon">
                  <Image className="section-back-icon back-icon-left" src={backIcon} alt="theme-pure" />
                </div>
                <div className="section-text pos-rel">
                  <h5>{sub_title}</h5>
                  <h1>{title}</h1>
                </div>
                <div className="section-line pos-rel">
                  <Image src={titleLine} alt="theme-pure" />
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-5 d-none d-lg-block">
              <div className="section-button text-end pt-80">
                <Link data-animation="fadeInLeft" data-delay=".6s" href="/blog" className="btn btn-icon ml-0">
                  <span>+</span>our blog
                </Link>
              </div>
            </div>
          </div>
 

 

          <div className="row">
            {latest_news_data.map((item, i) =>
              <div key={i} className="col-xl-4 col-lg-6 col-md-6">
                <div className="latest-news-box mb-30">
                  <div className="latest-news-thumb mb-35">
                    <Image src={item.img} style={{ width: "100%" }} alt="theme-pure" />
                  </div>
                  <div className="latest-news-content">
                    <div className="news-meta mb-10">
                      <span><a href="#" className="news-tag">{item.tag_1},</a></span>
                      <span><a href="#" className="news-tag">{item.tag_2}</a></span>
                    </div>
                    <h3><Link href="/news-details">{item.title}</Link></h3>
                    <p>{item.sm_des}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="col-xl-4 col-lg-12 col-md-12">
              <div className="recent-news-list mb-120">
                {singl_news.map((news, index) =>
                  <div key={index} className={`latest-news-content singl-news  ${index === 0 || index === 1 || index === 2 ? "news-border-bottom" : ""}`}>
                    <h3><Link href="/news-details">{news.title}</Link></h3>
                    <span className="meta-date"><i className="far fa-calendar"></i>{news.time}</span>
                    <span className="meta-date"><Link href="#"><i className="far fa-comments"></i>{news.comments} Comments</Link></span>
                  </div>
                )}
              </div>
              {!style && 
              <div className="mk-call-btn f-right mb-30">
                <Link data-animation="fadeInLeft" data-delay=".6s" href="/contact" className="btn btn-icon btn-icon-green ml-0">
                  <span><i className="fas fa-phone"></i></span>make call
                </Link>
              </div>              
              }
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default LatestNewsAreaHomeOne;