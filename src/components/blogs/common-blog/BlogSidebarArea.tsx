'use client' 
import React from 'react';
import Image from 'next/image';
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
            <h3 className="widget-title">Search Objects</h3>
          </div>
          <form className="search-form" onSubmit={e => e.preventDefault()}>
            <input type="text" placeholder="Search your keyword..." />
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
            <a href="#"><Image src={blog_banner} style={{ width: "100%", height: "auto" }} alt="theme-pure" /></a>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogSidebarArea;