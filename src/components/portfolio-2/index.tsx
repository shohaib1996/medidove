
import React from 'react';
import HeaderOne from '@/layout/headers/HeaderOne';
import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import PortfolioTwoArea from './PortfolioTwoArea';
import FooterThree from '@/layout/footers/FooterThree';

const PortfolioTwo = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Portfolio 2 Column' page='Portfolio 2' />
        <PortfolioTwoArea />
      </main>
      <FooterThree />
    </>
  );
};

export default PortfolioTwo;