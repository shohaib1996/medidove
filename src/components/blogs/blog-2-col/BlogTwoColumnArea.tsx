
import blog_all_data from '@/data/BlogAllData';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const BlogTwoColumnArea = () => {
  return (
    <>
      <section className="blog-area pt-120 pb-120">
        <div className="container">
          <div className="row">
            {blog_all_data.map((item, i) =>
              <div key={i} className="col-lg-6 col-md-6">
                <article className="postbox post format-image mb-40">
                  <div className="postbox__thumb">
                    <Link href="#">
                      <Image src={item.img} style={{width: '100%', height: 'auto'}} alt="titlem-image" />
                    </Link>
                  </div>
                  <div className="postbox__text p-30">
                    <div className="post-meta mb-15">
                      <span><Link href="#"><i className="far fa-user"></i> {item.post_writer} </Link></span>
                      <span><Link href="#"><i className="far fa-comments"></i> {item.comments} Comments</Link></span>
                    </div>
                    <h3 className="blog-title blog-title-sm">
                      <Link href="#">{item.title}</Link>
                    </h3>
                    <div className="post-text">
                      <p>{item.sm_des}</p>
                    </div>
                    <div className="read-more">
                      <Link href="#" className="read-more">read more <i className="fas fa-long-arrow-alt-right"></i></Link>
                    </div>
                  </div>
                </article>
              </div>
            )}
          </div>
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

export default BlogTwoColumnArea;