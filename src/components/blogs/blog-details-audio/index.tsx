import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import FooterThree from '@/layout/footers/FooterThree';
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';
import BlogDetailsAudioArea from './BlogDetailsAudioArea';

const BlogDetailsAudio = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Blog Details Audio' page='Blog Details Audio' />
        <BlogDetailsAudioArea />
      </main>
      <FooterThree />

    </>
  );
};

export default BlogDetailsAudio;