import React from 'react';

import popular_feeds_1 from "@/assets/img/blog/details/img1.jpg";
import popular_feeds_2 from "@/assets/img/blog/details/img2.jpg";
import popular_feeds_3 from "@/assets/img/blog/details/img3.jpg";
import Image, { StaticImageData } from 'next/image';


interface DataType {
  id: number;
  img: StaticImageData;
  title: string;
  time: string;
}[]

const popular_feeds: DataType[] = [
  {
    id: 1,
    img: popular_feeds_1,
    title: "Dolor sit cing elit lorem ipsum , sed do.",
    time: "October 18, 2023",
  },
  {
    id: 2,
    img: popular_feeds_2,
    title: "Dolor sit cing elit lorem ipsum , sed do.",
    time: "October 18, 2023",
  },
  {
    id: 3,
    img: popular_feeds_3,
    title: "Dolor sit cing elit lorem ipsum , sed do.",
    time: "October 18, 2023",
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
                <a href="#"><Image src={item.img} alt="theme-pure" /></a>
              </div>
              <div className="widget-posts-body">
                <h6 className="widget-posts-title"><a href="#">{item.title}</a></h6>
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