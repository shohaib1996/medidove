
import news_data from '@/data/NewsData';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import back_icon from "@/assets/img/section/section-back-icon.png";
import title_line from "@/assets/img/shape/section-title-line.png";


const LatestNewsAreaHomeFour = () => {
  return (
    <>
      <section className="latest-news-area pt-115 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 offset-xl-3 col-lg-10 offset-lg-1">
              <div className="section-title text-center pos-rel mb-75">
                <div className="section-icon">
                  <Image
                    className="section-back-icon"
                    src={back_icon}
                    alt=""
                  />
                </div>
                <div className="section-text pos-rel">
                  <h5>News</h5>
                  <h1>Get Every Single Updates Here.</h1>
                </div>
                <div className="section-line pos-rel">
                  <Image src={title_line} alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {news_data.map((item, i) =>
              <div key={i} className="col-xl-4 col-lg-6 col-md-6">
                <div className="h4latestnews-box pos-rel fix mb-30">
                  <div className="h4latestnews-bg">
                    <Image src={item.img} alt="theme-pure"  style={{width: "100%", height: "auto"}} />
                  </div>
                  <div className="h4latestnews-wrapper pos-rel">
                    <div className="h4news-tag mb-10">
                      <span><a href="#" className="f-500 green-color">{item.tag_1},</a></span>
                      <span><a href="#" className="f-500 green-color">{item.tag_2}</a></span>
                    </div>
                    <div className="h4news-content">
                      <h4 className="theme-color f-600">
                        <Link href="/blog-details">{item.title}</Link>
                      </h4>
                      <p>{item.description}</p>
                    </div>
                    <div className="h4news-admin d-flex align-items-center mb-40">
                      <div className="h4adminnews-thumb">
                        <span>
                          <Image src={item.admin} alt="" /><span className="theme-color f-600">{item.name}</span></span>
                      </div>
                      <div className="h4adminnews-date">
                        <span><i className="far fa-calendar-alt"></i>{item.time}</span>
                      </div>
                    </div>
                    <div className="h4news-button">
                      <Link
                        data-animation="fadeInLeft"
                        data-delay=".6s"
                        href="/contact"
                        className="btn btn-icon btn-icon-gray ml-0"><span>+</span>read more</Link>
                    </div>
                  </div>
                </div>
              </div>
            )} 
          </div>
        </div>
      </section>
    </>
  );
};

export default LatestNewsAreaHomeFour;