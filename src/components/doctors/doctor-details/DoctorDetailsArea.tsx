'use client'
import NiceSelect from '@/ui/NiceSelect';
import Image from 'next/image';
import React from 'react';


import back_icon_sky from "@/assets/img/section/section-back-icon-sky.png";
import title_line from "@/assets/img/shape/section-title-line.png";
import member_img from "@/assets/img/team/member-big.jpg";

import icon_1 from "@/assets/img/services/ser-fea-icon-1.png";
import icon_2 from "@/assets/img/services/ser-fea-icon-2.png";
import Link from 'next/link';
import { TeamSocialLinks } from '@/components/common/SocialLinks';
import degree_1 from "@/assets/img/services/more-ser-1.png";
import degree_2 from "@/assets/img/services/more-ser-5.png";
import ServiceContactForm from '@/components/forms/ServiceContactForm';

const doctor_details_content = {
  sub_title: "introducing my self",
  title: "There Is Nothing To Show Something.",
  des_1: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde  omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
  skills_text: "Here Is Skills",
  des_2: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste  natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.",
  features: [
    {
      id: 1,
      img: icon_1,
      title: "Personal care",
      lists: [
        "Cillum dolore eu fugiat nulla.",
        "Lorem ipsum dolor sit amet.",
        "Consectetur adipisicing elit,",
        "Sed do eiusmod tempor inci.",
      ],
    },
    {
      id: 2,
      img: icon_2,
      title: "Lifestyle support",
      lists: [
        "Didunt ut labore et dolore magna.",
        "Aliqua. Ut enim ad minim veniam.",
        "Quis nostrud exercitation ullamco.",
        "Laboris nisi ut aliquip ex ea.",
      ],
    },
  ],
  care_text: "Care Coverage",
  des_3: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde  omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.",
  name: "Halim D. Keliano",
  job_title: "Dentist & Neurologist",
  qualifications: "Qualifications",
  qualifications_data: [
    {
      id: 1,
      img: degree_1,
      education: "Master of Science",
      versity_name: "Oxford Univercity (2015 - 2018)",
    },
    {
      id: 2,
      img: degree_2,
      education: "Neurology Test",
      versity_name: "Stanford Versity (2019 - 2023)",
    },
  ],
  advice: "Get Some Advice?",

}
const { sub_title, title, des_1, skills_text, des_2, features, care_text, des_3, name, job_title, qualifications, qualifications_data, advice } = doctor_details_content


const DoctorDetailsArea = () => {
  const selectHandler = (e: any) => { };
  return (
    <>
      <div className="doctor-details-area pt-115 pb-70">
        <div className="container">
          <div className="row">
            <div className="col-xl-7 col-lg-8">
              <article className="doctor-details-box">
                <div className="section-title pos-rel mb-25">
                  <div className="section-icon">
                    <Image className="section-back-icon back-icon-left" src={back_icon_sky} alt="theme-pure" />
                  </div>
                  <div className="section-text pos-rel">
                    <h5 className="green-color text-up-case">{sub_title}</h5>
                    <h1>{title}</h1>
                  </div>
                  <div className="section-line pos-rel">
                    <Image src={title_line} alt="theme-pure" />
                  </div>
                </div>
                <div className="service-details-text mb-40">
                  <p>{des_1}</p>
                </div>
                <div className="section-title pos-rel mb-25">
                  <div className="section-text pos-rel">
                    <h2>{skills_text}</h2>
                  </div>
                  <div className="section-line pos-rel">
                    <Image src={title_line} alt="theme-pure" />
                  </div>
                </div>
                <div className="service-details-text mb-35">
                  <p>{des_2}</p>
                </div>
                <div className="service-details-feature fix mb-30">
                  {features.map((item, i) =>
                    <div key={i} className={`ser-fea-box f-left ${i === 0 ? "mr-0" : ""}`}>
                      <div className="ser-fea-icon f-left">
                        <Image src={item.img} alt="theme-pure" />
                      </div>
                      <div className="ser-fea-list fix">
                        <h3>{item.title}</h3>
                        <ul>
                          {item.lists?.map((list, index) =>
                            <li key={index}><i className="fas fa-check"></i>{list}</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
                <div className="section-title pos-rel mb-25">
                  <div className="section-text pos-rel">
                    <h2>{care_text}</h2>
                  </div>
                  <div className="section-line pos-rel">
                    <Image src={title_line} alt="theme-pure" />
                  </div>
                </div>
                <div className="service-details-text mb-30">
                  <p>{des_3}</p>
                </div>
                <div id="contact-map" className="service-map mb-55">
                  <div style={{ width: '100%' }}>
                    <iframe
                      title="Contact"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2242073.95673692!2d-101.47327132885862!3d39.09608451608003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54eab584e432360b%3A0x1c3bb99243deb742!2sUnited%20States!5e0!3m2!1sen!2sbd!4v1692245114248!5m2!1sen!2sbd"
                      style={{ width: '100%' }}
                      height={400}
                      allowFullScreen={true}
                      loading="lazy"
                    ></iframe>

                  </div>
                </div>
              </article>
            </div>
            <div className="col-xl-5 col-lg-4">
              <div className="service-widget mb-50">
                <div className="team-wrapper team-box-2 team-box-3 text-center mb-30">
                  <div className="team-thumb">
                    <Image src={member_img} alt="theme-pure" />
                  </div>
                  <div className="team-member-info mt-35 mb-35">
                    <h3><Link href="/doctor-details">{name}</Link></h3>
                    <h6 className="f-500 text-up-case letter-spacing pink-color">{job_title}</h6>
                  </div>
                  <div className="team-social-profile">
                    <ul>
                      <TeamSocialLinks />
                    </ul>
                  </div>
                </div>
              </div>
              <div className="service-widget mb-50">
                <div className="widget-title-box mb-30">
                  <h3 className="widget-title">{qualifications}</h3>
                </div>
                <div className="more-service-list">
                  <ul>
                    {qualifications_data.map((quali_item, quali_index) =>
                      <li key={quali_index}>
                        <Link href="#">
                          <div className="more-service-icon">
                            <Image src={quali_item.img} alt="theme-pure" /></div>
                          <div className="more-service-title doctor-details-title">
                            {quali_item.education} <span>{quali_item.versity_name}</span>
                          </div>
                        </Link>
                      </li>
                    )}   
                  </ul>
                </div>
              </div>
              <div className="service-widget mb-80">
                <div className="widget-title-box mb-30">
                  <h3 className="widget-title">{advice}</h3>
                </div>
                <ServiceContactForm /> 
              </div>
              <div className="service-widget mb-50">
                <div className="widget-title-box mb-30">
                  <h3 className="widget-title">Languages</h3>
                </div>
                <div className="doctor-detials-lan">
                  <ul>
                    <li><a href="#">en</a></li>
                    <li><a href="#">es</a></li>
                    <li><a href="#">bd</a></li>
                    <li><a href="#">la</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorDetailsArea;