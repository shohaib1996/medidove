

import about_icon_1 from "@/assets/img/icon/s-fea-icon-1.png";
import about_icon_2 from "@/assets/img/icon/s-fea-icon-2.png";
import about_icon_3 from "@/assets/img/icon/s-fea-icon-3.png";
import about_icon_4 from "@/assets/img/icon/s-fea-icon-4.png";
import Image, { StaticImageData } from "next/image";

interface AboutContentDatatype {
  about_data: {
      id: number;
      cls: string;
      img: StaticImageData;
      title: string;
      sm_info: string;
  }[];
  sub_title: string;
  title: string;
  sm_des: string;
  features: string[];
}
const about_content: AboutContentDatatype = {
  about_data: [
    {
      id: 1,
      cls: "mb-40",
      img: about_icon_1,
      title: "Advanced Care",
      sm_info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.",
    },
    {
      id: 2,
      cls: "mt-40",
      img: about_icon_2,
      title: "Respite Care",
      sm_info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.",
    },
    {
      id: 3,
      cls: "mb-30",
      img: about_icon_3,
      title: "Daily Care",
      sm_info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.",
    },
    {
      id: 4,
      cls: "mt-40 mb-30",
      img: about_icon_4,
      title: "Neuorology Care",
      sm_info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.",
    },
  ],
  sub_title: "About Us",
  title: "Short Story About MediDove Clinic.",
  sm_des: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
  features: [
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do.",
    "Eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea co.",
  ]
}
const { about_data, sub_title, title, sm_des, features } = about_content

const AboutAreaHomeTwo = () => {
  return (
    <>
      <section className="about-area about-area-mid pt-120 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-12 col-md-12">
              <div className="row">
                {about_data.map((item, i) =>
                  <div key={i} className="col-xl-6 col-lg-6 col-md-6">
                    <div className={`feature-box ${item.cls}`}>
                      <div className="feature-small-icon mb-35">
                        <Image src={item.img} alt="theme-pure" />
                      </div>
                      <div className="feature-small-content">
                        <h3>{item.title}</h3>
                        <p>{item.sm_info}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-xl-6 col-lg-12 col-md-11">
              <div className="about-right-side pt-25 mb-30">
                <div className="about-title mb-20">
                  <h5 className="pink-color">{sub_title}</h5>
                  <h1>{title}</h1>
                </div>
                <div className="about-text">
                  <p>{sm_des}</p><br />
                </div>
                <div className="about-text-list mb-40">
                  <ul>
                    {features.map((feature, index) =>
                      <li key={index}><i className="fa fa-check"></i><span>{feature}</span>
                      </li>
                    )}
                  </ul>
                </div>
                <div className="button-area">
                  <a data-animation="fadeInLeft" data-delay=".6s" href="#" className="btn btn-icon ml-0"><span>+</span>learn more</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutAreaHomeTwo;