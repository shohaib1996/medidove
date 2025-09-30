
import React from 'react';
import Wrapper from '@/layout/Wrapper';
import Portfolio from '@/components/portfolio/index';

export const metadata = {
  title: "Portfolio MediDove React Next js Tempalte",
};


const index = () => {
  return (
    <Wrapper>
      <Portfolio />
    </Wrapper>
  );
};

export default index;