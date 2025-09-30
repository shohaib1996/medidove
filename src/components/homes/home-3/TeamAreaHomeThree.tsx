import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import team_data from '@/data/TeamData';
import back_icon from "@/assets/img/section/section-back-icon.png";
import line_icon from "@/assets/img/shape/section-title-line.png";
import { TeamSocialLinks } from '@/components/common/SocialLinks';


type DataType = {
  sub_title: string;
  title: string;
}
const team_content: DataType = {
  sub_title: "Our Team",
  title: "A Professional & Care Provider",
}
const {sub_title, title}  = team_content

const TeamAreaHomeThree = () => {
  return (
    <>
      <section className="team-area pt-115 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
              <div className="section-title text-center pos-rel mb-70">
                <div className="section-icon">
                  <Image className="section-back-icon" src={back_icon} alt="theme-pure" />
                </div>
                <div className="section-text pos-rel">
                  <h5>{sub_title}</h5>
                  <h1>{title}</h1>
                </div>
                <div className="section-line pos-rel">
                  <Image src={line_icon} alt="theme-pure" />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {team_data.slice(6, 12).map((item, i) =>
              <div key={i} className="col-xl-4 col-lg-4 col-md-6">
                <div className="team-wrapper team-box-2 text-center mb-30">
                  <div className="team-thumb">
                    <Image src={item.img} style={{width: '100%', height: 'auto'}} alt="theme-pure" />
                  </div>
                  <div className="team-member-info mt-35 mb-25">
                    <h3><Link href="/doctor-details">{item.name}</Link></h3>
                    <h6 className="f-500 text-up-case letter-spacing pink-color">{item.job_title}</h6>
                  </div>
                  <div className="team-social-profile mb-15">
                    <ul>
                      <TeamSocialLinks />
                    </ul>
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

export default TeamAreaHomeThree;