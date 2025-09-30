
import BlogDetailsGallery from '@/components/blogs/blog-details-gallery';
import Wrapper from '@/layout/Wrapper';
import React from 'react';

export const metadata = {
  title: "Blog Details Gallery Sidebar MediDove React Next js Tempalte",
};


const index = () => {
  return (
    <Wrapper>
      <BlogDetailsGallery />
    </Wrapper>
  );
};

export default index;