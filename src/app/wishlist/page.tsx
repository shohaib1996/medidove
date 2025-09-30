import Wishlist from '@/components/shop/wishlist';
import Wrapper from '@/layout/Wrapper';
import React from 'react';

export const metadata = {
  title: "Wishlist MediDove React Next js Tempalte",
};


const index = () => {
  return (
    <Wrapper>
      <Wishlist />
    </Wrapper>
  );
};

export default index;