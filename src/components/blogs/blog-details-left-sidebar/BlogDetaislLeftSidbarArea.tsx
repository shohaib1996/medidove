
import React from 'react';
import BlogSidebarArea from '../common-blog/BlogSidebarArea';
import BlogDetailsInnerArea from '../common-blog/BlogDetailsInnerArea';

const BlogDetaislLeftSidbarArea = () => {
  return (
    <>
      <section className="blog-area pt-120 pb-80">
        <div className="container">
          <div className="row">
            <BlogSidebarArea />
            <BlogDetailsInnerArea style_left={true} />
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetaislLeftSidbarArea;