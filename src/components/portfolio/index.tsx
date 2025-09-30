import React from "react";
import HeaderOne from "@/layout/headers/HeaderOne"; 
import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import PortfolioTwoArea from '../portfolio-2/PortfolioTwoArea';
import FooterThree from '@/layout/footers/FooterThree';

const Portfolio = () => {
  return (
    <>
      <HeaderOne />
      <main>
      <Breadcrumb sub_title='We are here for your care.' title='Portfolio 3 Column' page='Portfolio 3' />
      <PortfolioTwoArea style={true} />
      </main>
      <FooterThree />
    </>
  );
};

export default Portfolio;
