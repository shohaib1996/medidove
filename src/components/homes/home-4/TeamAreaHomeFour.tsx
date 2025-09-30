import { TeamSocialLinks } from '@/components/common/SocialLinks';
import team_data from '@/data/TeamData';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import back_icon from "@/assets/img/section/section-back-icon.png";
import line_icon from "@/assets/img/shape/section-title-line.png";


const TeamAreaHomeFour = () => {
  return (
    <>
      <section className="team-area pt-180 pb-65">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 offset-xl-3 col-lg-10 offset-lg-1">
              <div className="section-title text-center pos-rel mb-75">
                <div className="section-icon">
                  <Image className="section-back-icon" src={back_icon} alt="back-icon" />
                </div>
                <div className="section-text pos-rel">
                  <h5>Our Team</h5>
                  <h1>A Professional & Care Provider</h1>
                </div>
                <div className="section-line pos-rel">
                  <Image src={line_icon} alt="section-line" />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {team_data.map((item, i) =>
              <>
                {item.home === 4 &&
                  <div key={i} className="col-xl-3 col-lg-4 col-md-6">
                    <div className="team-box text-center mb-60">
                      <div className="team-thumb h4team-thumb mb-25 pos-rel">
                        <Image src={item.img} alt="" />
                        <Link className="team-link" href="/doctor-details">0{item.id}</Link>
                      </div>
                      <div className="team-content h4team-content mb-15">
                        <h3>{item.name}</h3>
                        <h6>{item.job_title}</h6>
                      </div>
                      <div className="h4team-social">
                        <ul className="list-inline">
                          <TeamSocialLinks />
                        </ul>
                      </div>
                    </div>
                  </div>
                }
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default TeamAreaHomeFour;