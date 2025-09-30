
import React from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';

import footer_logo from "@/assets/img/logo/logo-2.png";
import SocialLinks, { CopyRight } from '@/components/common/SocialLinks';
import footer_icon_1 from "@/assets/img/icon/footer-co-icon-1.png";
import footer_icon_2 from "@/assets/img/icon/footer-co-icon-2.png";
import footer_icon_3 from "@/assets/img/icon/footer-co-icon-3.png";

import blog_thumb_1 from "@/assets/img/blog/feeds-thumb-1.jpg";
import blog_thumb_2 from "@/assets/img/blog/feeds-thumb-2.jpg";
import blog_thumb_3 from "@/assets/img/blog/feeds-thumb-3.jpg";

interface DataType {
  subscribe: string;
  subscribe_text: string;
  footer_contact: ({
    id: number;
    img: StaticImageData;
    title: string;
    info: string | React.JSX.Element;
    link: boolean;
  })[];
  link_data: {
    title: string;
    links: {
      title: string;
      link: string;
    }[]
  }[];
  footer_blog_data: {
    id: number;
    img: StaticImageData;
    title: string;
    time: string;

  }[];
}

const footer_content: DataType = {
  subscribe: "subscribe",
  subscribe_text: "Subscribe to Our Newsletter",
  footer_contact: [
    {
      id: 1,
      img: footer_icon_1,
      title: "Mon to Fri : 08h30 - 18h00",
      info: "+898 68679 575 09",
      link: false,
    },
    {
      id: 2,
      img: footer_icon_2,
      title: "do you have a question?",
      info: "info@gmail.com",
      link: false,
    },
    {
      id: 3,
      img: footer_icon_3,
      title: "socials network",
      info: <SocialLinks />,
      link: true,
    },

  ],
  link_data: [
    {
      title: "Departments",
      links: [
        { title: "Surgery and Radiology", link: "#" },
        { title: "Departments", link: "#" },
        { title: "Family Medicine", link: "#" },
        { title: "Our Doctors", link: "#" },
        { title: "Women's Health", link: "#" },
        { title: "News", link: "#" },
        { title: "Optician", link: "#" },
        { title: "Shop", link: "#" },
        { title: "Pediatrics", link: "#" },
        { title: "Contact Us", link: "#" },
        { title: "Dermatology", link: "#" },
        { title: "Book an Appointment", link: "#" },
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
  ]
}
const { subscribe, subscribe_text, footer_contact, link_data, footer_blog_data } = footer_content

const FooteTwo = () => {
  return (
    <>
      <footer>
        <div className="footer-top theme-bg pt-100">
          <div className="container">
            <div className="footer-top-form mb-60">
              <div className="row align-items-center">
                <div className="col-xl-4 col-lg-4 col-md-4">
                  <div className="footer-logo-2">
                    <Image src={footer_logo} alt="theme-pure" />
                  </div>
                </div>
                <div className="col-xl-2 col-lg-3 d-none d-lg-block d-xl-block">
                  <div className="footer-subscribe-title">
                    <span>{subscribe_text}</span>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-5 col-md-8">
                  <form className="footer-newsletter">
                    <input type="text" placeholder="Your Email Address...." />
                    <button className="primary_btn btn">{subscribe}</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="footer-mid pb-60">
              <div className="row">
                <div className="col-xl-4 col-lg-6 col-md-6">
                  <div className="footer-widget mb-40">
                    <div className="footer-contact-info-2">
                      {footer_contact.map((item, i) =>
                        <div key={i} className="f-contact-info-box fix mb-30">
                          <div className="footer-co-icon f-left">
                            <Image src={item.img} alt="theme-pure" />
                          </div>
                          <div className="footer-co-content">
                            <span>{item.title}</span>
                            {!item.link ?
                              <h4>{item.info}</h4>
                              :
                              <ul>
                                <li>
                                  {item.info} {""}
                                </li>
                              </ul>
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {link_data.map((link, link_i) =>
                  <div key={link_i} className="col-xl-4 col-lg-6 col-md-6">
                    <div className="footer-widget mb-40">
                      <div className="footer-title">
                        <h3>{link.title}</h3>
                      </div>
                      <div className="footer-menu footer-menu-2 fix">
                        <ul>
                          {link.links.map((link_item, index) =>
                            <li key={index}><Link href={link_item.link}>{link_item.title}</Link></li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                <div className="col-xl-4 col-md-6">
                  <div className="footer-widget mb-40">
                    <div className="footer-title">
                      <h3>News Feeds</h3>
                    </div>
                    <div className="blog-feeds pr-15">
                      {footer_blog_data.map((blog_item, blog_i) =>
                        <div key={blog_i} className="signle-blog-feeds mb-20">
                          <div className="blog-feeds-thumb">
                            <Link href="/news-details">
                              <Image src={blog_item.img} alt="theme-pure" />
                            </Link>
                          </div>
                          <div className="blog-feeds-text">
                            <h5><Link href="/news-details">{blog_item.title}</Link></h5>
                            <span className="feeds-date">{blog_item.time}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-bottom-0">
              <div className="row">
                <div className="col-xl-12">
                  <div className="footer-copyright-area text-center">
                    <p className="white-color"> <CopyRight /> </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooteTwo;