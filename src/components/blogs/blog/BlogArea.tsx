
import BlogInnerArea from '../common-blog/BlogInnerArea';
import BlogSidebarArea from '../common-blog/BlogSidebarArea';

const BlogArea = () => {



  return (
    <>
      <section className="blog-area pt-120 pb-80">
        <div className="container">
          <div className="row">
            <BlogInnerArea />
            <BlogSidebarArea /> 
          </div>
        </div>
      </section>


    </>
  );
};

export default BlogArea;