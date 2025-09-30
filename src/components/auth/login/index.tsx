
import Breadcrumb from '@/components/common/breadcrumb/Breadcrumb';
import FooterThree from '@/layout/footers/FooterThree';
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';
import LoginArea from './LoginArea';

const Login = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Login' page='Login' />
        <LoginArea />
      </main>
      <FooterThree />
    </>
  );
};

export default Login;