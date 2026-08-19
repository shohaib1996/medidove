import Image from "next/image";

import brand_icon from "@/assets/img/about/medical-brand-icon-border.png";
import about_icon_1 from "@/assets/img/about/about-img.jpg";
import about_icon_2 from "@/assets/img/about/about-shape.png";
import avatar_img from "@/assets/img/about/author-ava.png";

interface about_content_type {
  sub_title: string;
  title: string;
  sm_des_1: string;
  sm_des_2: string;
  name: string;
  job_title: string;
}
const about_content: about_content_type = {
  sub_title: "About Us",
  title: "A clinic website built around patient support.",
  sm_des_1: "MediDove helps patients book appointments, contact reception, understand services, and receive timely follow-up from the clinic team.",
  sm_des_2: "Staff can review appointment requests, patient questions, reception notes, reminders, consent status, and follow-up activity in one connected workflow.",
  name: "Rosalina D. Williamson",
  job_title: "Clinic Operations Lead",
};
const { sub_title, title, sm_des_1, sm_des_2, name, job_title } = about_content;

const AboutAreaHomeOne = () => {
  return (
    <>
      <section className="about-area pt-120 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-5 position-relative">
              <div className="medical-icon-brand-2">
                <Image src={brand_icon} alt="theme-pure" />
              </div>
              <div className="about-left-side pos-rel mb-30">
                <div className="about-front-img">
                  <Image src={about_icon_1} alt="theme-pure" />
                </div>
                <div className="about-shape">
                  <Image src={about_icon_2} alt="theme-pure" />
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-7">
              <div className="about-right-side pt-55 mb-30">
                <div className="about-title mb-20">
                  <h5>{sub_title}</h5>
                  <h1>{title}</h1>
                </div>
                <div className="about-text">
                  <p>{sm_des_1}</p>
                  <p>{sm_des_2}</p>
                  <br />
                </div>
                <div className="about-author d-flex align-items-center">
                  <div className="author-ava">
                    <Image src={avatar_img} alt="theme-pure" />
                  </div>
                  <div className="author-desination">
                    <h4>{name}</h4>
                    <h6>{job_title}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutAreaHomeOne;
