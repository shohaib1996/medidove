
import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';
import ServiceDetailsArea from './ServiceDetailsArea';
import FooterThree from '@/layout/footers/FooterThree';

const ServiceDetails = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Our Services Details' page='Services Details' />
        <ServiceDetailsArea />
      </main>
      <FooterThree />

    </>
  );
};

export default ServiceDetails;