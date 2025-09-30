
import Checkout from '@/components/shop/checkout';
import Wrapper from '@/layout/Wrapper';
import React from 'react';
export const metadata = {
  title: "Checkout MediDove React Next js Tempalte",
};
const index = () => {
  return (
    <Wrapper>
      <Checkout />
    </Wrapper>
  );
};

export default index;