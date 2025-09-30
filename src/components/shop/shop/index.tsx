import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';
import ShopProducts from './ShopProducts';
import FooterThree from '@/layout/footers/FooterThree';

const Shop = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Shop Page' page='Shop' />
        <ShopProducts />
      </main>
      <FooterThree />
    </>
  );
};

export default Shop;