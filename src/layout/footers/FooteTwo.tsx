
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
  subscribe_text: "Get Clinic AI Updates",
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
      info: "hello@medidove.ai",
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
        { title: "Surgery and Radiology", link: "/service" },
        { title: "Departments", link: "/service" },
        { title: "Family Medicine", link: "/service" },
        { title: "Our Doctors", link: "/doctor" },
        { title: "Women's Health", link: "/service" },
        { title: "News", link: "/blog" },
        { title: "Optician", link: "/service" },
        { title: "Shop", link: "/shop" },
        { title: "Pediatrics", link: "/service" },
        { title: "Contact Us", link: "/contact" },
        { title: "Dermatology", link: "/service" },
        { title: "Book an Appointment", link: "/appointment" },
      ]
    }
  ],
  footer_blog_data: [
    {
      id: 1,
      img: blog_thumb_1,
      title: "AI receptionist handoffs for busy clinics",
      time: "12 August 2026"
    },
    {
      id: 2,
      img: blog_thumb_2,
      title: "Consent-aware WhatsApp reminder workflows",
      time: "14 August 2026"
    },
    {
      id: 3,
      img: blog_thumb_3,
      title: "Smart intake without diagnosis claims",
      time: "18 August 2026"
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
                    <Image src={footer_logo} alt="MediDove" />
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
                            <Link href="/blog">
                              <Image src={blog_item.img} alt={blog_item.title} />
                            </Link>
                          </div>
                          <div className="blog-feeds-text">
                            <h5><Link href="/blog">{blog_item.title}</Link></h5>
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
