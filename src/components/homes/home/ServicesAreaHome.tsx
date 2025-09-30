
import Image, { StaticImageData } from "next/image";
import back_icon from "@/assets/img/section/section-back-icon.png";
import title_line from "@/assets/img/shape/section-title-line.png";

import service_icon_1 from "@/assets/img/services/service1.png";
import service_icon_2 from "@/assets/img/services/service2.png";
import service_icon_3 from "@/assets/img/services/service3.png";
import service_icon_4 from "@/assets/img/services/service4.png";
import service_icon_5 from "@/assets/img/services/service5.png";
import service_icon_6 from "@/assets/img/services/service6.png";
import Link from "next/link";

interface service_content_type {
  sub_title: string;
  title: string;
  service_data: {
      id: number;
      img: StaticImageData;
      title: string;
      sm_des: string;
  }[];
}
const service_content: service_content_type = {
  sub_title: "Departments",
  title: "Managed Your Heathcare Services",
  service_data: [
    {
      id: 1,
      img: service_icon_1,
      title: "Body Surgery",
      sm_des: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
    },
    {
      id: 2,
      img: service_icon_2,
      title: "Dental Care",
      sm_des: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
    },
    {
      id: 3,
      img: service_icon_3,
      title: "Eye Care",
      sm_des: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
    },
    {
      id: 4,
      img: service_icon_4,
      title: "Blood Cancer",
      sm_des: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
    },
    {
      id: 5,
      img: service_icon_5,
      title: "Neurology Sargery",
      sm_des: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
    },
    {
      id: 6,
      img: service_icon_6,
      title: "Allergic Issue",
      sm_des: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
    },
  ],
}
const { sub_title, title, service_data } = service_content

const ServicesAreaHome = () => {
  return (
    <>
      <section className="servcies-area gray-bg pt-115 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 offset-xl-2 col-lg-10 offset-lg-1">
              <div className="section-title text-center pos-rel mb-75">
                <div className="section-icon">
                  <Image className="section-back-icon" src={back_icon} alt="theme-pure" />
                </div>
                <div className="section-text pos-rel">
                  <h5>{sub_title}</h5>
                  <h1>{title}</h1>
                </div>
                <div className="section-line pos-rel">
                  <Image src={title_line} alt="theme-pure" />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {service_data.map((item, i) =>
              <div key={i} className="col-xl-4 col-lg-6 col-md-6">
                <div className="service-box text-center mb-30">
                  <div className="service-thumb">
                    <Image src={item.img} alt="theme-pure" />
                  </div>
                  <div className="service-content">
                    <h3><Link href="#">{item.title}</Link></h3>
                    <p>{item.sm_des}</p>
                    <Link className="service-link" href="/service-details">Read More</Link>
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

export default ServicesAreaHome;