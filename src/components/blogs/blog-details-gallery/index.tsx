import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import FooterThree from '@/layout/footers/FooterThree';
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';
import BlogDetailsGalleryArea from './BlogDetailsGalleryArea';

const BlogDetailsGallery = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Blog Details Gallery' page='Blog Gallery' />
        <BlogDetailsGalleryArea />
      </main>
      <FooterThree />
    </>
  );
};

export default BlogDetailsGallery;