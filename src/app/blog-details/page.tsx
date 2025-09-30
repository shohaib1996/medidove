import BlogDetails from '@/components/blogs/blog-details';
import Wrapper from '@/layout/Wrapper';
import React from 'react';

export const metadata = {
  title: "Blog Details MediDove React Next js Tempalte",
};

const index = () => {
  return (
    <Wrapper>
      <BlogDetails />
    </Wrapper>
  );
};

export default index;