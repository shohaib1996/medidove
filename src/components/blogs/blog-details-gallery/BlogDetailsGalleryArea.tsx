
import React from 'react';
import BlogDetailsInnerArea from '../common-blog/BlogDetailsInnerArea';
import BlogSidebarArea from '../common-blog/BlogSidebarArea';

const BlogDetailsGalleryArea = () => {
  return (
    <>
      <section className="blog-area pt-120 pb-80">
        <div className="container">
          <div className="row">
            <BlogDetailsInnerArea style_gallery={true} />
            <BlogSidebarArea />
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetailsGalleryArea;