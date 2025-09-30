
import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import AboutAreHomeThree from '@/components/homes/home-3/AboutAreHomeThree';
import FactAreaHomeOne from '@/components/homes/home/FactAreaHomeOne';
import TeamAreaHomeOne from '@/components/homes/home/TeamAreaHomeOne';
import FooterThree from '@/layout/footers/FooterThree';
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';

const Doctor = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Doctor' page='Doctor' />
        <TeamAreaHomeOne />
        <FactAreaHomeOne />
        <AboutAreHomeThree style={true} />
      </main>
      <FooterThree />
    </>
  );
};

export default Doctor;