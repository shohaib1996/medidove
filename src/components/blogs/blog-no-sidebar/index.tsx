import FooterThree from '@/layout/footers/FooterThree';
import HeaderOne from '@/layout/headers/HeaderOne';
import BlogInnerArea from '../common-blog/BlogInnerArea';
import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';

const BlogNoSidebar = () => {
  return (
    <>
      <HeaderOne />
      <main>
      <Breadcrumb sub_title='We are here for your care.' title='No Sidebar' page='No Sidebar' /> 
        <section className="blog-area pt-120 pb-80">
          <div className="container">
            <div className="row">
              <BlogInnerArea style={true} />
            </div>
          </div>
        </section>
      </main>
      <FooterThree />
    </>
  );
};

export default BlogNoSidebar;