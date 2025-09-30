
import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import AboutAreHomeThree from '@/components/homes/home-3/AboutAreHomeThree';
import TeamAreaHomeThree from '@/components/homes/home-3/TeamAreaHomeThree';
import FactAreaHomeOne from '@/components/homes/home/FactAreaHomeOne';
import FooterThree from '@/layout/footers/FooterThree';
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';

const DoctorTwo = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Doctor 02' page='Doctor 02' />
        <TeamAreaHomeThree />
        <FactAreaHomeOne />
        <AboutAreHomeThree style={true} />
      </main>
      <FooterThree />
    </>
  );
};

export default DoctorTwo;