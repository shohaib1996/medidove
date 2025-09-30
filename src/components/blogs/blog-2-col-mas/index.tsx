
import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';
import BlogTwoColumnTwoMasonry from './BlogTwoColumnTwoMasonry';
import FooterThree from '@/layout/footers/FooterThree';

const BlogTwoColMas = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Blog Two Column Masonry' page='Blog Two Column Masonry' />
        <BlogTwoColumnTwoMasonry />
      </main>
      <FooterThree />
    </>
  );
};

export default BlogTwoColMas;