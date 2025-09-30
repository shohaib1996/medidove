import HeaderFour from "@/layout/headers/HeaderFour";
import HeroAreaHomeFour from "./HeroAreaHomeFour";
import AboutAreaHomeFour from "./AboutAreaHomeFour";
import ServicesAreaHomeFour from "./ServicesAreaHomeFour";
import TeamAreaHomeFour from "./TeamAreaHomeFour";
import AppoinmentAreaHomeFour from "./AppoinmentAreaHomeFour";
import FactAreaHomeFour from "./FactAreaHomeFour";
import HiringAreaHomeFour from "./HiringAreaHomeFour";
import HowItWorksHomeFour from "./HowItWorksHomeFour";
import TestimonialsHomeFour from "./TestimonialsHomeFour";
import PhotoGalleryHomeFour from "./PhotoGalleryHomeFour";
import CounterAreaHomeFour from "./CounterAreaHomeFour";
import LatestNewsAreaHomeFour from "./LatestNewsAreaHomeFour";
import BrandAreaHomeFour from "./BrandAreaHomeFour";
import FooterFour from "@/layout/footers/FooterFour";



const HomeFour = () => {
  return (
    <>
      <HeaderFour />
      <main>
        <HeroAreaHomeFour style={false} />
        <AboutAreaHomeFour />
        <ServicesAreaHomeFour style={false} />
        <TeamAreaHomeFour />
        <AppoinmentAreaHomeFour />
        <FactAreaHomeFour />
        <HiringAreaHomeFour />
        <HowItWorksHomeFour />
        <TestimonialsHomeFour />
        <PhotoGalleryHomeFour />
        <CounterAreaHomeFour />
        <LatestNewsAreaHomeFour />
        <BrandAreaHomeFour />
      </main>
      <FooterFour />
    </>
  );
};

export default HomeFour;