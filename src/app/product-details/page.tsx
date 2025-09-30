import ProductDetails from '@/components/shop/product-details';
import Wrapper from '@/layout/Wrapper';
import React from 'react';

export const metadata = {
  title: "Product Details MediDove React Next js Tempalte",
};

const index = () => {
  return (
    <Wrapper>
      <ProductDetails />
    </Wrapper>
  );
};

export default index;