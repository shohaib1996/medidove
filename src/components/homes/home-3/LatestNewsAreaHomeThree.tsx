import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import blog_data from '@/data/BlogData';

import back_icon from "@/assets/img/section/section-back-icon.png";
import line_icon from "@/assets/img/shape/section-title-line.png";


const LatestNewsAreaHomeThree = () => {
  return (
    <>
      <section className="latest-news-area gray-bg pt-115 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-7">
              <div className="section-title pos-rel mb-75">
                <div className="section-icon">
                  <Image className="section-back-icon back-icon-left" src={back_icon} alt="theme-pure" />
                </div>
                <div className="section-text pos-rel">
                  <h5>News</h5>
                  <h1>Get Every Single Updates Here.</h1>
                </div>
                <div className="section-line pos-rel">
                  <Image src={line_icon} alt="theme-pure" />
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
            {blog_data.slice(6, 9).map((item, i) =>
              <div key={i} className="col-xl-4 col-lg-4 col-md-6">
                <div className="latest-news-box latest-news-box-2 latest-news-box-3 mb-30">
                  <div className="latest-news-thumb">
                    <Link href="/news-details">
                      <Image src={item.img} alt="theme-pure" />
                    </Link>
                  </div>
                  <div className="latest-news-content-box pl-0 pr-0">
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
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default LatestNewsAreaHomeThree;