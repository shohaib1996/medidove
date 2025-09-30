
import BlogLeftSidebar from '@/components/blogs/blog-left-sidebar';
import Wrapper from '@/layout/Wrapper';
import React from 'react';

export const metadata = {
  title: "Blog Left Sidebar MediDove React Next js Tempalte",
};

const index = () => {
  return (
    <Wrapper>
      <BlogLeftSidebar />
    </Wrapper>
  );
};

export default index;