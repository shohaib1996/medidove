import React from 'react';

import popular_feeds_1 from "@/assets/img/blog/details/img1.jpg";
import popular_feeds_2 from "@/assets/img/blog/details/img2.jpg";
import popular_feeds_3 from "@/assets/img/blog/details/img3.jpg";
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';


type PopularFeed = {
  id: number;
  img: StaticImageData;
  title: string;
  time: string;
};

const popular_feeds: PopularFeed[] = [
  {
    id: 1,
    img: popular_feeds_1,
    title: "AI receptionist handoffs for busy clinics",
    time: "August 12, 2026",
  },
  {
    id: 2,
    img: popular_feeds_2,
    title: "Consent-aware WhatsApp reminder workflows",
    time: "August 14, 2026",
  },
  {
    id: 3,
    img: popular_feeds_3,
    title: "Smart intake without diagnosis claims",
    time: "August 18, 2026",
  },
]
const PopularFeeds = () => {
  return (
    <>
      <div className="widget mb-40">
        <div className="widget-title-box mb-30">
          <span className="animate-border"></span>
          <h3 className="widget-title">Popular Feeds</h3>
        </div>
        <ul className="recent-posts">
          {popular_feeds.map((item, i) =>
            <li key={i}>
              <div className="widget-posts-image">
                <Link href="/blog"><Image src={item.img} alt={item.title} /></Link>
              </div>
              <div className="widget-posts-body">
                <h6 className="widget-posts-title"><Link href="/blog">{item.title}</Link></h6>
                <div className="widget-posts-meta">{item.time}</div>
              </div>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default PopularFeeds;
