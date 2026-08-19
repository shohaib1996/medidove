'use client'
import blog_all_data from '@/data/BlogAllData';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const BlogTwoColumnTwoMasonry = () => {
  return (
    <>
      <section className="blog-area pt-120 pb-120">
        <div className="container">
          <ResponsiveMasonry className="row blog-masonry" columnsCountBreakPoints={{ 0: 1, 750: 2, 992: 2 }}>
            <Masonry gutter="20px">
              {blog_all_data.map((item) =>
                <div key={item.id} className="grid-item">
                  <article className="postbox post format-image mb-40">
                    <div className="postbox__thumb">
                      <Link href="/blog">
                        <Image src={item.img_2m} style={{ width: '100%', height: 'auto' }} alt={item.title} />
                      </Link>
                    </div>
                    <div className="postbox__text p-30">
                      <div className="post-meta mb-15">
                        <span><Link href="/blog"><i className="far fa-user"></i> {item.post_writer} </Link></span>
                        <span><Link href="/blog"><i className="far fa-comments"></i> {item.comments} Comments</Link></span>
                      </div>
                      <h3 className="blog-title blog-title-sm">
                        <Link href="/blog">{item.title}</Link>
                      </h3>
                      <div className="post-text">
                        <p>{item.sm_des}</p>
                      </div>
                      <div className="read-more">
                        <Link href="/blog" className="read-more">read more <i className="fas fa-long-arrow-alt-right"></i></Link>
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
                  <li><Link href="/blog"><i className="fas fa-angle-double-left"></i></Link></li>
                  <li><Link href="/blog">01</Link></li>
                  <li className="active"><Link href="/blog">02</Link></li>
                  <li><Link href="/blog">03</Link></li>
                  <li><Link href="/blog"><i className="fas fa-ellipsis-h"></i></Link></li>
                  <li><Link href="/blog"><i className="fas fa-angle-double-right"></i></Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogTwoColumnTwoMasonry;
