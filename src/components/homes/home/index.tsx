import CtaAreaHomeOne from "./CtaAreaHomeOne";
import TeamAreaHomeOne from "./TeamAreaHomeOne";
import FactAreaHomeOne from "./FactAreaHomeOne";
import AboutAreaHomeOne from "./AboutAreaHomeOne";
import ServicesAreaHome from "./ServicesAreaHome";
import HeroSliderHomeOne from "./HeroSliderHomeOne";
import PricingAreaHomeOne from "./PricingAreaHomeOne";
import LatestNewsAreaHomeOne from "./LatestNewsAreaHomeOne";
import FooterOne from "@/layout/footers/FooterOne";
import HeaderOne from "@/layout/headers/HeaderOne";

const HomeOne = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <HeroSliderHomeOne />
        <AboutAreaHomeOne />
        <ServicesAreaHome />
        <TeamAreaHomeOne />
        <FactAreaHomeOne />
        <PricingAreaHomeOne />
        <CtaAreaHomeOne />
        <LatestNewsAreaHomeOne  style={false} />
      </main>
      <FooterOne />
    </>
  );
};

export default HomeOne;
