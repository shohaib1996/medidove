
import blog_all_data from '@/data/BlogAllData';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const BlogThreeColumnArea = () => {
  return (
    <>
      <section className="blog-area pt-100 pb-60">
        <div className="container">
          <div className="row">
            {blog_all_data.map((item, i) =>
              <div key={i} className="col-lg-4 col-md-6">
                <article className="postbox post format-image mb-40">
                  <div className="postbox__thumb">
                    <Link href="#">
                      <Image src={item.img_3col} style={{ width: '100%', height: 'auto' }} alt="title-image" />
                    </Link>
                  </div>
                  <div className="postbox__text p-30">
                    <div className="post-meta mb-15">
                      <span><a href="#"><i className="far fa-user"></i> {item.post_writer} </a></span>
                      <span><a href="#"><i className="far fa-comments"></i> {item.comments} Comments</a></span>
                    </div>
                    <h3 className="blog-title blog-title-sm">
                      <a href="#">{item.title.slice(0, 54)}</a>
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
          </div>
          <div className="row">
            <div className="col-12">
              <div className="basic-pagination basic-pagination-2 text-center mb-40">
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

export default BlogThreeColumnArea;