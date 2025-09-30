
import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react'; 
import FooterThree from '@/layout/footers/FooterThree';
import BlogTwoColumnArea from './BlogTwoColumnArea';

const BlogTwoColumn = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Blog Two Column' page='Blog Two Column' />
        <BlogTwoColumnArea />
      </main>
      <FooterThree />
    </>
  );
};

export default BlogTwoColumn;