
import DoctorDetails from '@/components/doctors/doctor-details';
import Wrapper from '@/layout/Wrapper';
import React from 'react';

export const metadata = {
  title: "Doctor Details MediDove React Next js Tempalte",
};

const index = () => {
  return (
    <Wrapper>
      <DoctorDetails />      
    </Wrapper>
  );
};

export default index;