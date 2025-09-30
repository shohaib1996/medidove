
import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';
import BlogDetaislLeftSidbarArea from './BlogDetaislLeftSidbarArea';
import FooterThree from '@/layout/footers/FooterThree';

const BlogDetailsLeftSidebar = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Blog Details Left Sidebar' page='Blog Details Left' />
        <BlogDetaislLeftSidbarArea />
      </main>
      <FooterThree />
    </>
  );
};

export default BlogDetailsLeftSidebar;