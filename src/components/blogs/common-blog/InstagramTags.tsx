
import Link from 'next/link';
import React from 'react';

type DataType = string[]


const tags: DataType = [
  "Popular",
  "desgin",
  "usability",
  "develop",
  "consult",
  "icon",
  "HTML",
  "ux",
  "business",
  "kit",
  "keyboard",
  "tech",
]
const InstagramTags = () => {
  return (
    <>
      <div className="widget mb-40">
        <div className="widget-title-box mb-30">
          <span className="animate-border"></span>
          <h3 className="widget-title">Instagram Feeds</h3>
        </div>
        <div className="tag">
          {tags.map((item, i) => <Link key={i} href="#">{item}</Link>)}
        </div>
      </div>
    </>
  );
};

export default InstagramTags;