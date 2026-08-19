'use client' 
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WriterPortfolio from './WriterPortfolio';
import PopularFeeds from './PopularFeeds';
import CategoriesArea from './CategoriesArea';
import SocialProfile from './SocialProfile';
import InstagramFeeds from './InstagramFeeds';
import InstagramTags from './InstagramTags';
import blog_banner from "@/assets/img/blog/details/banner.png";


const BlogSidebarArea = () => {
  return (
    <>
      <div className="col-lg-4">

        <div className="widget mb-40">
          <div className="widget-title-box mb-30">
            <span className="animate-border"></span>
            <h3 className="widget-title">Search Insights</h3>
          </div>
          <form className="search-form" onSubmit={e => e.preventDefault()}>
            <input type="text" placeholder="Search clinic AI topics..." />
            <button type="submit"><i className="fas fa-search"></i></button>
          </form>
        </div>

        <WriterPortfolio />
        <PopularFeeds />
        <CategoriesArea />
        <SocialProfile />
        <InstagramFeeds />
        <InstagramTags />

        <div className="widget mb-40 p-0 b-0">
          <div className="banner-widget">
            <Link href="/appointment"><Image src={blog_banner} style={{ width: "100%", height: "auto" }} alt="Book an AI-assisted appointment" /></Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogSidebarArea;
