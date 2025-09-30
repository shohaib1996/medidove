import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';
import RegisterArea from './RegisterArea';
import FooterThree from '@/layout/footers/FooterThree';

const Register = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Register' page='Register' />
        <RegisterArea />
      </main>
      <FooterThree />
    </>
  );
};

export default Register;