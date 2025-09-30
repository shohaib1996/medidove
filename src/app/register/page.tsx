import Register from '@/components/auth/register';
import Wrapper from '@/layout/Wrapper';
import React from 'react';


export const metadata = {
  title: "Register MediDove React Next js Tempalte",
};

const index = () => {
  return (
    <Wrapper>
      <Register />
    </Wrapper>
  );
};

export default index;