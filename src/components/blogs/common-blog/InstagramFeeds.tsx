import React from 'react';
import Image, { StaticImageData } from 'next/image';

import instagram_img_1 from "@/assets/img/instagram/ins1.jpg";
import instagram_img_2 from "@/assets/img/instagram/ins2.jpg";
import instagram_img_3 from "@/assets/img/instagram/ins3.jpg";
import instagram_img_4 from "@/assets/img/instagram/ins4.jpg";
import instagram_img_5 from "@/assets/img/instagram/ins5.jpg";
import instagram_img_6 from "@/assets/img/instagram/ins6.jpg";
import instagram_img_7 from "@/assets/img/instagram/ins7.jpg";
import instagram_img_8 from "@/assets/img/instagram/ins8.jpg";
import instagram_img_9 from "@/assets/img/instagram/ins9.jpg";

 
type DataType = StaticImageData[]

const instagram_data: DataType = [
  instagram_img_1,
  instagram_img_2,
  instagram_img_3,
  instagram_img_4,
  instagram_img_5,
  instagram_img_6,
  instagram_img_7,
  instagram_img_8,
  instagram_img_9,
]


const InstagramFeeds = () => {
  return (
    <>
      <div className="widget mb-40">
        <div className="widget-title-box mb-30">
          <span className="animate-border"></span>
          <h3 className="widget-title">Instagram Feeds</h3>
        </div>
        <ul id="Instafeed">
          {instagram_data.map((item, i) => <li key={i}><a href="#"><Image src={item} style={{width: "100%", height: "auto"}} alt="theme-pure" /></a></li>)}
        </ul>
      </div>


    </>
  );
};

export default InstagramFeeds;