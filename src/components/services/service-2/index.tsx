import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';
import ServiceAboutArea from '../service/ServiceAboutArea';
import ServiceTwoServicesArea from './ServiceTwoServicesArea';
import ServiceCalculateArea from '../service/ServiceCalculateArea';
import ServiceHiringArea from '../service/ServiceHiringArea';
import FooterThree from '@/layout/footers/FooterThree';

const ServiceTwo = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Our Services 02' page='Services 02' />
        <ServiceAboutArea service_2={true} />
        <ServiceTwoServicesArea />
        <ServiceCalculateArea />
        <ServiceHiringArea />
      </main>
      <FooterThree />

    </>
  );
};

export default ServiceTwo