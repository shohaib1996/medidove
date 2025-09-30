
import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import FooterThree from '@/layout/footers/FooterThree';
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';
import CartArea from './CartArea';

const Cart = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Shopping  Cart' page='Shopping  Cart' />
        <CartArea />
      </main>
      <FooterThree />
    </>
  );
};

export default Cart;