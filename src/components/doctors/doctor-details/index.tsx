
import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';
import DoctorDetailsArea from './DoctorDetailsArea';
import FooterThree from '@/layout/footers/FooterThree';

const DoctorDetails = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Doctor Details' page='Doctor Details' />
        <DoctorDetailsArea />
      </main>
      <FooterThree />
    </>
  );
};

export default DoctorDetails;