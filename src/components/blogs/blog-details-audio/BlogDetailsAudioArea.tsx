
import React from 'react';
import BlogDetailsInnerArea from '../common-blog/BlogDetailsInnerArea';
import BlogSidebarArea from '../common-blog/BlogSidebarArea';

const BlogDetailsAudioArea = () => {
  return (
    <>
      <section className="blog-area pt-120 pb-80">
        <div className="container">
          <div className="row">
            <BlogDetailsInnerArea style_audio={true} />
            <BlogSidebarArea />
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetailsAudioArea;