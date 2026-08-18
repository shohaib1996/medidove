
import HeaderOne from '@/layout/headers/HeaderOne';
import React from 'react';
import Breadcrumb from '../common/breadcrumb/Breadcrumb';
import AppointmentAboutArea from './AppointmentAboutArea';
import AppointmentCalculateArea from './AppoinmentCalculateArea';
import LatestNewsAreaHomeOne from "./../homes/home/LatestNewsAreaHomeOne";
import FooterThree from "@/layout/footers/FooterThree";

const Appointment = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title='We are here for your care.' title='Appointment' page='Appointment' />
        <AppointmentAboutArea />
        <AppointmentCalculateArea />
        <LatestNewsAreaHomeOne style={true} />
      </main>
      <FooterThree />
    </>
  );
};

export default Appointment;
