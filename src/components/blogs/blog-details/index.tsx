import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import FooterThree from '@/layout/footers/FooterThree';
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';
import BlogDetailsArea from './BlogDetailsArea';

const BlogDetails = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Blog Details' page='Blog Details' />
        <BlogDetailsArea />
      </main>
      <FooterThree />
    </>
  );
};

export default BlogDetails;