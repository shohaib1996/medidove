
import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import FooterThree from '@/layout/footers/FooterThree';
import HeaderOne from '@/layout/headers/HeaderOne';
import BlogDetailsVideoArea from './BlogDetailsVideoArea';

const BlogDetailsVideo = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Blog Details Video' page='Blog Video' />
        <BlogDetailsVideoArea />
      </main>
      <FooterThree />
    </>
  );
};

export default BlogDetailsVideo;