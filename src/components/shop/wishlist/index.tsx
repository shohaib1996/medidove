import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';
import WishlistArea from './WishlistArea';
import FooterThree from '@/layout/footers/FooterThree';

const Wishlist = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Wishlist' page='Wishlist' />
        <WishlistArea />
      </main>
      <FooterThree />
    </>
  );
};

export default Wishlist;