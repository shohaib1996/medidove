
import React from 'react';
import Wrapper from '@/layout/Wrapper';
import Appoinment from '@/components/appoinment';

export const metadata = {
  title: "Appoinment MediDove React Next js Tempalte",
};

const index = () => {
  return (
    <Wrapper>
      <Appoinment />
    </Wrapper>
  );
};

export default index;