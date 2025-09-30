
import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';
import ServiceAboutArea from './ServiceAboutArea';
import ServiceCalculateArea from './ServiceCalculateArea';
import ServiceHiringArea from './ServiceHiringArea';
import FooterThree from '@/layout/footers/FooterThree';

const Service = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Our Services' page='Services' />
        <ServiceAboutArea />
        <ServiceCalculateArea />
        <ServiceHiringArea />
      </main>
      <FooterThree />
    </>
  );
};

export default Service 