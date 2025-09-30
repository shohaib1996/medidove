import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import FooterThree from '@/layout/footers/FooterThree';
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';
import BlogThreeColumnThreeMasonry from './BlogThreeColumnThreeMasonry';

const BlogThreeColumbMasonry = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Blog Three Column Masonry' page='Blog Three Column Masonry' />
        <BlogThreeColumnThreeMasonry />
      </main>
      <FooterThree />
    </>
  );
};

export default BlogThreeColumbMasonry;