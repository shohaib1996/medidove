
import BlogNoSidebar from '@/components/blogs/blog-no-sidebar';
import Wrapper from '@/layout/Wrapper';
import React from 'react';


export const metadata = {
  title: "Blog No Sidebar MediDove React Next js Tempalte",
};

const index = () => {
  return (
    <Wrapper>
      <BlogNoSidebar />
    </Wrapper>
  );
};

export default index;