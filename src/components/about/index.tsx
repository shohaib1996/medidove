
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';
import Breadcrumb from '../common/breadcrumb/Breadcrumb';
import AboutVideoArea from './AboutVideoArea';
import AboutCounterArea from './AboutCounterArea';
import AboutAppoinment from './AboutAppoinment';
import TeamAreaHomeOne from '../homes/home/TeamAreaHomeOne';
import FactAreaHomeOne from '../homes/home/FactAreaHomeOne';
import AboutTestimonialsArea from './AboutTestimonialsArea';
import AboutAnalysisArea from './AboutAnalysisArea';
import FooterThree from '@/layout/footers/FooterThree';

const About = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='About Us' page='About Us' />
        <AboutVideoArea />
        <AboutCounterArea />
        <AboutAppoinment />
        <TeamAreaHomeOne />
        <FactAreaHomeOne />
        <AboutTestimonialsArea />
        <AboutAnalysisArea />
      </main>
      <FooterThree />
    </>
  );
};

export default About;