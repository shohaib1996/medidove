
import FooterThree from '@/layout/footers/FooterThree';
import HeaderOne from '@/layout/headers/HeaderOne'; 
import BlogSidebarArea from '../common-blog/BlogSidebarArea';
import BlogInnerArea from '../common-blog/BlogInnerArea';
import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';

const BlogLeftSidebar = () => {
  return (
    <>
      <HeaderOne />
      <main>
      <Breadcrumb sub_title='We are here for your care.' title='Left Sidebar' page='Left Sidebar' /> 
        <section className="blog-area pt-120 pb-80 ">
          <div className="container">
            <div className="row">
              <BlogSidebarArea />
              <BlogInnerArea />
            </div>
          </div>
        </section>
      </main>
      <FooterThree />
    </>
  );
};

export default BlogLeftSidebar;