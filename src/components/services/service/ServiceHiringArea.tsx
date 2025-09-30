
import React from 'react';
import hiring_img_1 from "@/assets/img/hire/hire1.jpg";
import hiring_img_2 from "@/assets/img/hire/hire2.jpg"
import Image from 'next/image';
import Link from 'next/link';

const hiring_content = {
  title: "For Employers",
  description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
}
const { title, description } = hiring_content

const ServiceHiringArea = () => {
  return (
    <>
      <section className="hiring-area pt-120 pb-120">
        <div className="container">

          <div className="row g-0 hire-bg-2">
            <div className="col-xl-6 col-lg-6">
              <div className="hire-img">
                <Image className="img" src={hiring_img_1} style={{width: "100%", height: "auto"}} alt="theme-pure" />
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="hire-text">
                <h1>{title}</h1>
                <p>{description}</p>
                <Link
                  data-animation="fadeInLeft"
                  data-delay=".6s" href="/contact"
                  className="btn btn-icon btn-icon-green ml-0"><span>+</span>Contact us</Link>
              </div>
            </div>
          </div>

          <div className="row g-0 hire-bg">
            <div className="col-xl-6 col-lg-6">
              <div className="hire-text">
                <h1>{title}</h1>
                <p>{description}</p>
                <Link data-animation="fadeInLeft" data-delay=".6s" href="#"
                  className="btn btn-icon ml-0"><span>+</span>apply today</Link>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="hire-img">
                <Image className="img" src={hiring_img_2} style={{width: "100%", height: "auto"}} alt="theme-pure" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceHiringArea;