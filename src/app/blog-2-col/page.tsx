
import BlogTwoColumn from '@/components/blogs/blog-2-col';
import Wrapper from '@/layout/Wrapper';
import React from 'react';

export const metadata = {
  title: "Blog Two Columb MediDove React Next js Tempalte",
};
const index = () => {
  return (
    <Wrapper>
      <BlogTwoColumn />
    </Wrapper>
  );
};

export default index;