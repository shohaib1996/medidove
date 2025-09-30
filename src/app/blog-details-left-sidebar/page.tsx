import BlogDetailsLeftSidebar from '@/components/blogs/blog-details-left-sidebar';
import Wrapper from '@/layout/Wrapper';
import React from 'react';

export const metadata = {
  title: "Blog Details Left Sidebar MediDove React Next js Tempalte",
};


const index = () => {
  return (
    <Wrapper>
      <BlogDetailsLeftSidebar />
    </Wrapper>
  );
};

export default index;