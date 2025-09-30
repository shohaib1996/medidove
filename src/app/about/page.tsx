import React from 'react';
import About from '@/components/about';
import Wrapper from '@/layout/Wrapper';

export const metadata = {
  title: "About MediDove React Next js Tempalte",
};

const index = () => {
  return (
    <Wrapper>
      <About />
    </Wrapper>
  );
};

export default index;