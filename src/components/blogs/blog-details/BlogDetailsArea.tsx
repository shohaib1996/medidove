import React from 'react';
import BlogSidebarArea from '../common-blog/BlogSidebarArea';
import BlogDetailsInnerArea from '../common-blog/BlogDetailsInnerArea';

const BlogDetailsArea = () => {
  return (
    <>
      <section className="blog-area pt-120 pb-80">
        <div className="container">
          <div className="row">
            <BlogDetailsInnerArea style_details={true} />
            <BlogSidebarArea />
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetailsArea;