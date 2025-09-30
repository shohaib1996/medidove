import React from "react"; 
import HeaderOne from "@/layout/headers/HeaderOne";
import Breadcrumb from "@/components/common/breadcrumb/Breadcrumb";
import FooterThree from "@/layout/footers/FooterThree";  
import PortfolioSliderArea from "./PortfolioSliderArea";  

const PortfolioSlider = () => {
  return (
    <>
      <HeaderOne />
      <main>
      <Breadcrumb sub_title='We are here for your care.' title='Portfolio Slider' page='Portfolio Slider' />
      <PortfolioSliderArea />
      </main>
      <FooterThree />
    </>
  );
};

export default PortfolioSlider;
