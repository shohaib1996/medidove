
import Cart from '@/components/shop/cart';
import Wrapper from '@/layout/Wrapper';
import React from 'react';


export const metadata = {
  title: "Cart MediDove React Next js Tempalte",
};

const index = () => {
  return (
    <Wrapper>
      <Cart />
    </Wrapper>
  );
};

export default index;