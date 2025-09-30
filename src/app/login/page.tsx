
import Login from '@/components/auth/login';
import Wrapper from '@/layout/Wrapper';
import React from 'react';


export const metadata = {
  title: "Login MediDove React Next js Tempalte",
};


const index = () => {
  return (
    <Wrapper>
      <Login />
    </Wrapper>
  );
};

export default index;