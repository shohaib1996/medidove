
import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';
import BlogThreeColumnArea from './BlogThreeColumnArea';
import FooterThree from '@/layout/footers/FooterThree';

const BlogThreeColumn = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Blog Three Column' page='Blog Three Column' />
        <BlogThreeColumnArea />
      </main>
      <FooterThree />
    </>
  );
};

export default BlogThreeColumn;