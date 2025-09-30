import React from "react";
import HeaderOne from "@/layout/headers/HeaderOne";
import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import BlogArea from "./BlogArea";
import FooterThree from "@/layout/footers/FooterThree";

const Blog = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Blog Standard' page='Blog' />
        <BlogArea />
      </main>
      <FooterThree />
    </>
  );
};

export default Blog;
