
import Doctor from '@/components/doctors/doctor';
import Wrapper from '@/layout/Wrapper';
import React from 'react';

export const metadata = {
  title: "Doctor MediDove React Next js Tempalte",
};


const index = () => {
  return (
    <Wrapper>
      <Doctor />
    </Wrapper>
  );
};

export default index;