import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import team_data from '@/data/TeamData';

import back_icon from "@/assets/img/section/section-back-icon.png"
import title_line from "@/assets/img/shape/section-title-line.png"


type team_content_type = {
  sub_title: string;
  title: string;
  btn_text: string;
}
const team_content: team_content_type = {
  sub_title: "Our Team",
  title: "A Professional & Care Provider",
  btn_text: "Make Appointment",
}
const {sub_title, title, btn_text} = team_content

const TeamAreaHomeOne = () => {
  return (
    <>
      <section className="team-area pt-115 pb-55">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-7 col-md-10">
              <div className="section-title pos-rel mb-75">
                <div className="section-icon">
                  <Image src={back_icon} className="section-back-icon back-icon-left" alt="theme-pure" />
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
            <div className="col-xl-6 col-lg-5">
              <div className="section-button text-end d-none d-lg-block pt-80">
                <Link data-animation="fadeInLeft" data-delay=".6s" href="/appoinment" className="btn btn-icon ml-0">
                  <span>+</span>{btn_text}
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            {team_data.slice(0, 6).map((item, i) =>
              <div key={i} className="col-xl-4 col-lg-4 col-md-6">
                <div className="team-box text-center mb-60">
                  <div className="team-thumb mb-45 pos-rel">
                    <Image src={item.img} alt="theme-pure" />
                    <Link className="team-link" href="/doctor-details">+</Link>
                  </div>
                  <div className="team-content">
                    <h3>{item.name}</h3>
                    <h6>{item.job_title}</h6>
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

export default TeamAreaHomeOne;