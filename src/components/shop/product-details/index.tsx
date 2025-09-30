
import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';
import ProductDetailsArea from './ProductDetailsArea';
import FooterThree from '@/layout/footers/FooterThree';

const ProductDetails = () => {
  return (
    <>
      <HeaderOne />
      <main>
      <Breadcrumb sub_title='We are here for your care.' title='Product Details' page='Product Details' />
        <ProductDetailsArea />
      </main>
      <FooterThree />
    </>
  );
};

export default ProductDetails;