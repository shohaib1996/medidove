
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import footer_logo from "@/assets/img/logo/footer-logo.png";
import { CopyRight } from '@/components/common/SocialLinks';

// footer data type
interface FooterContentDatatype {
  number_text: string;
  number: string;
  sm_info: string;
  email: string;
  website: string;
  address: string;
  footer_links: {
      id: number;
      cls: string;
      title: string;
      links: {
          link: string;
          title: string;
      }[];
  }[];
}
// footer content 
const footer_content:FooterContentDatatype = {
  number_text: "Emergency number",
  number: "202-555-0104",
  sm_info: "incididunt lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.",
  email: "info@examplemedical.com",
  website: "examplemedical.com",
  address: "227 Marion Street, Columbia",
  footer_links: [
    {
      id: 1,
      cls: "col-md-4",
      title: "Departments",
      links: [
        {link: "#", title: "Surgery and Radiology"},
        {link: "#", title: "Family Medicine"},
        {link: "#", title: "Women's Health"},
        {link: "#", title: "Optician"},
        {link: "#", title: "Pediatrics"},
        {link: "#", title: "Dermatology"},
      ]
    },
    {
      id: 2,
      cls: "d-md-none d-lg-block",
      title: "Quick Links",
      links: [
        {link: "#", title: "Departments"},
        {link: "#", title: "Our Doctors"},
        {link: "#", title: "News"},
        {link: "#", title: "Shop"},
        {link: "#", title: "Contact Us"},
        {link: "#", title: "Book an Appointment"},
      ]
    },
  ]
}
const { number_text, number, sm_info, email, website, address, footer_links } = footer_content

const FooterOne = () => {
  return (
    <>
      <footer>
        <div className="footer-top primary-bg pt-115 pb-90">
          <div className="container">
            <div className="row">
              <div className="col-xl-5 col-lg-6 col-md-8">
                <div className="footer-contact-info mb-30">
                  <div className="emmergency-call fix">
                    <div className="emmergency-call-icon f-left">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div className="emmergency-call-text f-left">
                      <h6>{number_text}</h6>
                      <span>{number}</span>
                    </div>
                  </div>
                  <div className="footer-logo mb-35">
                    <Link href="#"><Image src={footer_logo} alt="theme-pure" /></Link>
                  </div>
                  <div className="footer-contact-content mb-25">
                    <p>{sm_info}</p>
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
              {footer_links.map((item, i) =>
                <div key={i} className={`col-xl-2 offset-xl-1 col-lg-3 ${item.cls}`}>
                  <div className="footer-widget mb-30">
                    <div className="footer-title">
                      <h3>{item.title}</h3>
                    </div>
                    <div className="footer-menu">
                      <ul>
                        {item.links.map((link, index) =>
                          <li key={index}><Link href="#">{link.title}</Link></li>
                        )} 
                      </ul>
                    </div>
                  </div>
                </div>
              )} 
            </div>
          </div>
        </div>
        <div className="footer-bottom pt-25 pb-20">
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <div className="footer-copyright text-center">
                  <p className="white-color"><CopyRight /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterOne;