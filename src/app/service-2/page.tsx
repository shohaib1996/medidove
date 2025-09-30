
import ServiceTwo from '@/components/services/service-2';
import Wrapper from '@/layout/Wrapper';
import React from 'react';


export const metadata = {
  title: "Service 02 MediDove React Next js Tempalte",
};


const index = () => {
  return (
    <Wrapper>
      <ServiceTwo />
    </Wrapper>
  );
};

export default index;