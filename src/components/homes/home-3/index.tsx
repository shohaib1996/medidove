
import HeaderThree from '@/layout/headers/HeaderThree'; 
import HeroBannerHomeThree from './HeroBannerHomeThree'; 
import ServiceAreaHomeThree from './ServiceAreaHomeThree';
import AppointmentAreaHomeThree from './AppointmentAreaHomeThree';
import TeamAreaHomeThree from './TeamAreaHomeThree';
import MembershipAreaHomeThree from './MembershipAreaHomeThree';
import FaqAreaHomeThree from './FaqAreaHomeThree';
import PricingAreaHomeThree from './PricingAreaHomeThree';
import HiringAreaHomeThree from './HiringAreaHomeThree';
import BrandAreaHomeThree from './BrandAreaHomeThree';
import LatestNewsAreaHomeThree from './LatestNewsAreaHomeThree';
import FooterThree from '@/layout/footers/FooterThree';
import AboutAreHomeThree from './AboutAreHomeThree';

const Homethree = () => {
  return (
    <>
      <HeaderThree />
      <main>
        <HeroBannerHomeThree />
        <AboutAreHomeThree />
        <ServiceAreaHomeThree />
        <AppointmentAreaHomeThree />
        <TeamAreaHomeThree />
        <MembershipAreaHomeThree />
        <FaqAreaHomeThree />
        <PricingAreaHomeThree />
        <HiringAreaHomeThree />
        <BrandAreaHomeThree />
        <LatestNewsAreaHomeThree />
      </main>
      <FooterThree />
    </>
  );
};

export default Homethree;