
import BlogThreeColumbMasonry from '@/components/blogs/blog-3-col-mas';
import Wrapper from '@/layout/Wrapper';
import React from 'react';

export const metadata = {
  title: "Blog Three Comlum Mas MediDove React Next js Tempalte",
};


const index = () => {
  return (
    <Wrapper>
      <BlogThreeColumbMasonry />
    </Wrapper>
  );
};

export default index;