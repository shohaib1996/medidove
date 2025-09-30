'use client'
import blog_all_data from '@/data/BlogAllData';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const BlogThreeColumnThreeMasonry = () => {
  return (
    <>
      <section className="blog-area pt-120 pb-120">
        <div className="container">
          <ResponsiveMasonry className="row blog-masonry" columnsCountBreakPoints={{ 0: 1, 750: 2, 992: 3 }}>
            <Masonry gutter="20px">
              {blog_all_data.map((item, i) =>
                <div key={i} className="grid-item">
                  <article className="postbox post format-image mb-40">
                    <div className="postbox__thumb">
                      <Link href="#">
                        <Image src={item.img_3m} style={{width: '100%', height: 'auto'}} alt="title-image" />
                      </Link>
                    </div>
                    <div className="postbox__text p-30">
                      <div className="post-meta mb-15">
                        <span><a href="#"><i className="far fa-user"></i> {item.post_writer} </a></span>
                        <span><a href="#"><i className="far fa-comments"></i> {item.comments} Comments</a></span>
                      </div>
                      <h3 className="blog-title blog-title-sm">
                        <a href="#">{item.title}</a>
                      </h3>
                      <div className="post-text">
                        <p>{item.sm_des}</p>
                      </div>
                      <div className="read-more">
                        <a href="#" className="read-more">read more <i className="fas fa-long-arrow-alt-right"></i></a>
                      </div>
                    </div>
                  </article>
                </div>
              )}
            </Masonry>
          </ResponsiveMasonry> 

          <div className="row">
            <div className="col-12">
              <div className="basic-pagination basic-pagination-2 text-center">
                <ul>
                  <li><a href="#"><i className="fas fa-angle-double-left"></i></a></li>
                  <li><a href="#">01</a></li>
                  <li className="active"><a href="#">02</a></li>
                  <li><a href="#">03</a></li>
                  <li><a href="#"><i className="fas fa-ellipsis-h"></i></a></li>
                  <li><a href="#"><i className="fas fa-angle-double-right"></i></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogThreeColumnThreeMasonry;