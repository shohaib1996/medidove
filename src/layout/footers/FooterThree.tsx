
import React from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { CopyRight } from '@/components/common/SocialLinks';

import blog_thumb_1 from "@/assets/img/blog/feeds-thumb-1.jpg";
import blog_thumb_2 from "@/assets/img/blog/feeds-thumb-2.jpg";
import blog_thumb_3 from "@/assets/img/blog/feeds-thumb-3.jpg";

import footer_logo_three from "@/assets/img/logo/footer-logo-3.png";

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
  sm_des: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.",
  email: "info@examplemedical.com",
  website: "examplemedical.com",
  address: "227 Marion Street, Columbia",

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
const { sm_des, email, website, address, link_data, footer_blog_data } = footer_content


const FooterThree = () => {
  return (
    <>
      <footer>
        <div className="footer-top primary-bg footer-map pos-rel pt-120 pb-80">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-4 col-lg-6 col-md-6">
                <div className="footer-contact-info footer-contact-info-3 mb-40">
                  <div className="footer-logo mb-35">
                    <Link href="/"><Image src={footer_logo_three} alt="theme-pure" /></Link>
                  </div>
                  <div className="footer-contact-content mb-25">
                    <p>{sm_des}</p>
                  </div>
                  <div className="footer-emailing">
                    <ul>
                      <li><i className="far fa-envelope"></i>{email}</li>
                      <li><i className="far fa-clone"></i>{website}</li>
                      <li><i className="far fa-flag"></i>{address}</li>
                    </ul>
                  </div>
                </div>
              </div>
              {link_data.map((link, link_i) =>
                <div key={link_i} className="col-xl-4 col-lg-6 col-md-6">
                  <div className="footer-widget mb-40">
                    <div className="footer-title">
                      <h3>{link.title}</h3>
                    </div>
                    <div className="footer-menu footer-menu-2">
                      <ul>
                        {link.links.map((link_item, index) =>
                          <li key={index}><Link href={link_item.link}>{link_item.title}</Link></li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              <div className="col-xl-4 col-lg-6 col-md-6">
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

export default FooterThree;