import ServiceDetails from '@/components/services/service-details';
import Wrapper from '@/layout/Wrapper';
import React from 'react';

export const metadata = {
  title: "Service Details MediDove React Next js Tempalte",
};

const index = () => {
  return (
    <Wrapper>
      <ServiceDetails />      
    </Wrapper>
  );
};

export default index;