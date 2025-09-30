import HomeOne from '@/components/homes/home';
import Wrapper from '@/layout/Wrapper';
import React from 'react';

export const metadata = {
  title: "Main Home MediDove React Next js Tempalte",
};

const HomeMain = () => {
  return (
    <Wrapper>
      <HomeOne />
    </Wrapper>
  );
};

export default HomeMain;