'use client'
import React from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';

import service_thumb_1 from "@/assets/img/services/service-details-thumb1.jpg";
import back_icon_sky from "@/assets/img/section/section-back-icon-sky.png";
import title_line from "@/assets/img/shape/section-title-line.png";
import icon_1 from "@/assets/img/services/ser-fea-icon-1.png";
import icon_2 from "@/assets/img/services/ser-fea-icon-2.png";
import chart from "@/assets/img/services/service-chart.jpg";
import doctors from "@/assets/img/services/service-doctors.png";
import quate_icon from "@/assets/img/testimonials/testi-quato-icon.png";

import pdf from "@/assets/img/icon/pdf.png";
import doc from "@/assets/img/icon/doc.png";
import zip from "@/assets/img/icon/zip.png";

import service_icon_1 from "@/assets/img/services/more-ser-1.png";
import service_icon_2 from "@/assets/img/services/more-ser-2.png";
import service_icon_3 from "@/assets/img/services/more-ser-3.png";
import service_icon_4 from "@/assets/img/services/more-ser-4.png";
import service_icon_5 from "@/assets/img/services/more-ser-5.png";
import service_icon_6 from "@/assets/img/services/more-ser-6.png";
import ServiceContactForm from '@/components/forms/ServiceContactForm';
import Servicebanner from '@/assets/img/services/services-banner.png';
import author from '@/assets/img/testimonials/testi-author-icon.png';


interface DataType {
  sub_title: string;
  title: string;
  des_1: string;
  des_2: string;
  features: {
    id: number;
    img: StaticImageData;
    title: string;
    lists: string[];
  }[];
  download: string;
  title_2: string;
  download_data: {
    id: number;
    img: StaticImageData;
    title: string;
    file_size: string;
  }[];
  des_3: string;
  name: string;
  job_title: string;
  service_title: string;
  service_data: {
    id: number;
    img: StaticImageData;
    title: string;
  }[];
  advice: string;
}


const service_details_content: DataType = {
  sub_title: "Dental Care",
  title: "We are here to help when you need us.",
  des_1: "Neque porro quisquam est, qui dolorem ipsum quia dolor lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non",
  des_2: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint  occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.",
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
  download: "download",
  title_2: "Free Download Resources",
  download_data: [
    {
      id: 1,
      img: pdf,
      title: "The Balanced Care Method Flyer.pdf",
      file_size: "57KB",
    },
    {
      id: 2,
      img: doc,
      title: "Infomation sheet 2 2016-17.doc",
      file_size: "87KB",
    },
    {
      id: 3,
      img: zip,
      title: "What_is_home_care_manual.zip",
      file_size: "112KB",
    },
  ],
  des_3: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
  name: "Rosalina D. Williamson",
  job_title: "founder, uithemes",
  service_title: "service_title",
  service_data: [
    {
      id: 1,
      img: service_icon_1,
      title: "Body Surgery",
    },
    {
      id: 2,
      img: service_icon_2,
      title: "Dental Care",
    },
    {
      id: 3,
      img: service_icon_3,
      title: "Eye Care",
    },
    {
      id: 4,
      img: service_icon_4,
      title: "Blood cancer",
    },
    {
      id: 5,
      img: service_icon_5,
      title: "Neurology Sargery",
    },
    {
      id: 6,
      img: service_icon_6,
      title: "Allergic Issue",
    },
  ],
  advice: "Get Some Advice?",
}
const { sub_title, title, des_1, des_2, features, download, title_2, download_data, des_3, name, job_title, service_title, service_data, advice } = service_details_content


const ServiceDetailsArea = () => {

  return (
    <>
      <div className="service-details-area pt-120 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-xl-7 col-lg-8">
              <article className="service-details-box">
                <div className="service-details-thumb mb-80">
                  <Image className="img" src={service_thumb_1} alt="theme-pure" />
                </div>
                <div className="section-title pos-rel mb-45">
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
                <div className="service-details-text mb-30">
                  <p>{des_1}</p>
                  <p>{des_2}</p>
                </div>
                <div className="service-details-feature fix mb-35">
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
                <div className="service-chart mb-55">
                  <Image src={chart} alt="theme-pure" />
                </div>
                <div className="service-doctors mb-55">
                  <Image src={doctors} alt="theme-pure" />
                </div>
                <div className="section-title pos-rel mb-50">
                  <div className="section-text pos-rel">
                    <h5 className="green-color text-up-case">{download}</h5>
                    <h1>{title_2}</h1>
                  </div>
                  <div className="section-line pos-rel">
                    <Image src={title_line} alt="theme-pure" />
                  </div>
                </div>
                <div className="download-area">
                  {download_data.map((d_item, d_index) =>
                    <Link key={d_index} className="download-box mb-20" href="#">
                      <div className="single-download-inner">
                        <Image src={d_item.img} alt="theme-pure" />
                        <span>{d_item.title}</span>
                        <span className="download-size">{d_item.file_size}</span>
                      </div>
                    </Link>
                  )}
                </div>
                <div className="testi-box text-center pos-rel mb-0">
                  <div className="testi-content testi-service-content pos-rel">
                    <div className="testi-quato-icon">
                      <Image src={quate_icon} alt="theme-pure" />
                    </div>
                    <p>{des_3}</p>
                    <span></span>
                  </div>
                  <div className="testi-author">
                    <h2 className="testi-author-title">{name}</h2>
                    <span className="testi-author-desination">{job_title}</span>
                  </div>
                  <div className="test-author-icon mb-10">
                    <Image src={author} alt="theme-pure" />
                  </div>
                </div>
              </article>
            </div>
            <div className="col-xl-5 col-lg-4">
              <div className="service-widget mb-50">
                <div className="widget-title-box mb-30">
                  <h3 className="widget-title">{service_title}</h3>
                </div>
                <div className="more-service-list">
                  <ul>
                    {service_data.map((s_item, s_index) =>
                      <li key={s_index}>
                        <a href="#">
                          <div className="more-service-icon">
                            <Image src={s_item.img} alt="theme-pure" />
                          </div>
                          <div className="more-service-title">{s_item.title}</div>
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="service-widget mb-50">
                <div className="widget-title-box mb-30">
                  <h3 className="widget-title">{advice}</h3>
                </div>
                <ServiceContactForm />
              </div>
              <div className="service-widget mb-50 border-0 p-0">
                <div className="banner-widget">
                  <a href="#">
                    <Image src={Servicebanner} alt="theme-pure" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetailsArea;