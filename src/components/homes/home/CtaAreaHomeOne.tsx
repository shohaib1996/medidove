import Link from "next/link";

type CtaContentType = {
  bg_img: string;
  title: string;
  sm_info: string;
}
const cta_content: CtaContentType = {
  bg_img: "/assets/img/slider/slider-bg-1.jpg",
  title: "Stay healthy & strong to enjoy life",
  sm_info: "Trust Us To Be There To Help All & Make Things Well Again.",
}
const {bg_img, title, sm_info}  = cta_content

const CtaAreaHomeOne = () => {
  return (
    <>
      <section className="cta-area pos-rel pt-115 pb-120" style={{ backgroundImage: `url(${bg_img})` }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-10 offset-xl-1 col-md-12">
              <div className="cta-text text-center">
                <div className="section-title pos-rel mb-50">
                  <div className="section-text section-text-white pos-rel">
                    <h5>{title}</h5>
                    <h1 className="white-color">{sm_info}</h1>
                  </div>
                </div>
                <div className="section-button section-button-left">
                  <Link data-animation="fadeInLeft" data-delay=".6s" href="/appoinment" className="btn btn-icon btn-icon-green ml-0">
                    <span>+</span>get a consultant
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CtaAreaHomeOne;