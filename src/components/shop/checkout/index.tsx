import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';
import CheckoutArea from './CheckoutArea';
import FooterThree from '@/layout/footers/FooterThree';

const Checkout = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Checkout' page='Checkout' />
        <CheckoutArea />
      </main>
      <FooterThree />
    </>
  );
};

export default Checkout;