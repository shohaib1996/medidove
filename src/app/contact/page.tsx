import Contact from '@/components/contact';
import Wrapper from '@/layout/Wrapper';
import React from 'react';


export const metadata = {
  title: "Contact MediDove React Next js Tempalte",
};


const index = () => {
  return (
    <Wrapper>
      <Contact />
    </Wrapper>
  );
};

export default index;