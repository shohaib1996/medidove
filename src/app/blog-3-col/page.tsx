
import BlogThreeColumn from '@/components/blogs/blog-3-col';
import Wrapper from '@/layout/Wrapper';
import React from 'react';


export const metadata = {
  title: "Blog Three Comlum MediDove React Next js Tempalte",
};

const index = () => {
  return (
    <Wrapper>
      <BlogThreeColumn />
    </Wrapper>
  );
};

export default index;