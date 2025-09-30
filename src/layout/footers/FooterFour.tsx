
import React from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';

import blog_thumb_1 from "@/assets/img/blog/feeds-thumb-1.jpg";
import blog_thumb_2 from "@/assets/img/blog/feeds-thumb-2.jpg";
import blog_thumb_3 from "@/assets/img/blog/feeds-thumb-3.jpg";
import footer_logo_three from "@/assets/img/logo/footer-logo-3.png";
import { CopyRight } from '@/components/common/SocialLinks';


interface DataType {
  sm_des: string;
  email: string;
  website: string;
  address: string;
  link_data: {
      title: string;
      links: {
          title: string;
          link: string;
      }[];
  }[];
  footer_blog_data: {
      id: number;
      img: StaticImageData;
      title: string;
      time: string;
  }[];
  news_title: string;
  office_open_title: string;
  office_open_day: string;
  office_open_time: string;
}

const footer_content: DataType = {
  sm_des: "adipisicing lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.",
  email: "info@examplemedical.com",
  website: "examplemedical.com",
  address: "227 Marion Street, Columbia",
  
  link_data: [
    {
      title: "Departments",
      links: [
        { title: "Surgery and Radiology", link: "#" },
        { title: "Family Medicine", link: "#" },
        { title: "Women's Health", link: "#" },
        { title: "Optician", link: "#" },
        { title: "Pediatrics", link: "#" },
        { title: "Dermatology", link: "#" },
      ]
    }
  ],
  footer_blog_data: [
    {
      id: 1,
      img: blog_thumb_1,
      title: "Consectetur ipsum dolor sit am et, lorem .",
      time: "14 August 2023"
    },
    {
      id: 2,
      img: blog_thumb_2,
      title: "Consectetur ipsum dolor sit am et, lorem .",
      time: "14 August 2023"
    },
    {
      id: 3,
      img: blog_thumb_3,
      title: "Consectetur ipsum dolor sit am et, lorem .",
      time: "14 August 2023"
    },
  ],
  news_title: "Recent News",
  office_open_title: "Opening Hours",
  office_open_day: "Sunday - Friday",
  office_open_time: "08:00 am - 10:00pm",
  
}
const { sm_des, email, website, address, link_data, footer_blog_data, news_title, office_open_title, office_open_day, office_open_time } = footer_content 


const FooterFour = () => {
  return (
    <>
      <footer>
        <div className="footer-top primary-bg pos-rel pt-120 pb-80">
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-xl-3 col-lg-6 col-md-6">
                <div className="footer-contact-info footer-contact-info-3 mb-40">
                  <div className="footer-logo mb-35">
                    <Link href="#">
                      <Image src={footer_logo_three} alt="" />
                    </Link>
                  </div>
                  <div className="footer-contact-content mb-25">
                    <p className="p-0">
                      {sm_des}
                    </p>
                  </div>
                  <div className="footer-emailing">
                    <ul>
                      <li>
                        <i className="far fa-envelope"></i>{email}
                      </li>
                      <li><i className="far fa-clone"></i>{website}</li>
                      <li>
                        <i className="far fa-flag"></i>{address}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {link_data.map((item, i) =>
                <div key={i} className="col-xl-2 col-lg-6 col-md-6">
                  <div className="footer-widget h4footer-widget mb-40">
                    <div className="footer-title">
                      <h3>{item.title}</h3>
                    </div>
                    <div className="footer-menu h4footer-menu d-block">
                      <ul>
                        {item.links?.map((link, index) =>
                          <li key={index}><Link href={link.link}>{link.title}</Link></li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

              )}
              <div className="col-xl-3 col-lg-6 col-md-6">
                <div className="footer-widget h4footer-widget mb-40">
                  <div className="footer-title">
                    <h3>{news_title}</h3>
                  </div>
                  <div className="blog-feeds pr-15">
                    {footer_blog_data.map((b_item, b_i) =>
                      <div key={b_i} className="signle-blog-feeds mb-20">
                        <div className="blog-feeds-thumb">
                          <Link href="/news-details" ><Image src={b_item.img} alt={b_item.title} /></Link>
                        </div>
                        <div className="blog-feeds-text">
                          <h5>
                            <Link href="/news-details">{b_item.title}</Link>
                          </h5>
                          <span className="feeds-date">{b_item.time}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 col-md-6">
                <div className="footer-widget h4footer-widget mb-40">
                  <div className="footer-title">
                    <h3>{office_open_title}</h3> 
                  </div>
                  <div className="h4events-list mb-30">
                    <ul>
                      <li>
                        <i className="fal fa-clock"></i><span>{office_open_day} <span>{office_open_time}</span></span>
                      </li>
                      <li>
                        <i className="fal fa-times-square"></i ><span className="close-days">Satarday Closed</span>
                      </li>
                    </ul>
                  </div>
                  <div className="h4footer-social">
                    <ul className="list-inline">
                      <li>
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                      </li>
                      <li>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                      </li>
                      <li>
                        <a href="#"><i className="fab fa-google"></i></a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom pt-25 pb-20">
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <div className="footer-copyright footer-copyright-3 text-center">
                  <p><CopyRight /></p> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterFour;