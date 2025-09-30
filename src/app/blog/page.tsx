
import React from 'react';
import Wrapper from '@/layout/Wrapper'; 
import Blog from '@/components/blogs/blog';

export const metadata = {
  title: "Blog MediDove React Next js Tempalte",
};

const index = () => {
  return (
    <Wrapper>
      <Blog />
    </Wrapper>
  );
};

export default index;  