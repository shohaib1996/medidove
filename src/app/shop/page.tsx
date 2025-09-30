
import Shop from '@/components/shop/shop';
import Wrapper from '@/layout/Wrapper';
import React from 'react';

export const metadata = {
  title: "Shop MediDove React Next js Tempalte",
};


const index = () => {
  return (
    <Wrapper>
      <Shop />
    </Wrapper>
  );
};

export default index;