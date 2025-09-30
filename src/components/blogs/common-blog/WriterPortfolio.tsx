
import Image from 'next/image';
import React from 'react';
import avatar_img from "@/assets/img/blog/details/me.jpg";
import SocialLinks from '@/components/common/SocialLinks';


type DataType = {
  sub_title: string;
  name: string;
  info: string;
}
const portfoli_content: DataType = {
  sub_title: "About Me",
  name: "Zulia Maron Duo",
  info: "A computer programmer, sometimes referred to as a software developer, a software engineer, a programmer or a coder, is a person who creates computer programs.",
}
const { sub_title, name, info } = portfoli_content

const WriterPortfolio = () => {
  return (
    <>
      <div className="widget mb-40">
        <div className="widget-title-box mb-30">
          <span className="animate-border"></span>
          <h3 className="widget-title">{sub_title}</h3>
        </div>
        <div className="about-me text-center">
          <Image src={avatar_img} alt="theme-pure" />
          <h4>{name}</h4>
          <p>{info}</p>
          <div className="widget-social-icon">
            <SocialLinks />   
          </div>
        </div>
      </div>
    </>
  );
};

export default WriterPortfolio;