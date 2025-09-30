
import Link from 'next/link';
import React from 'react';

const hiring_content = {
  sub_title: "About Us",
  title: "Short Story About MediDove Clinic.",
  sm_des: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
  features_list: [
    "Nostrud Ut enim ad minim veniam, quis exercit.",
    "Ut enim ad minim veniam, quis nostrud exercit.",
    "Veniam Ut enim ad minim, quis nostrud exercit.",
    "Quis Ut enim ad minim veniam, nostrud exercit.",
  ]
}
const { sub_title, title, sm_des, features_list } = hiring_content

const HiringAreaHomeThree = () => {
  return (
    <>
      <section className="hiring-area pos-rel">
        <div className="hiring-top">
          <div className="hire-left-img" style={{ backgroundImage: `url(/assets/img/hire/hire3.jpg)` , backgroundSize: 'cover' }}></div>
          <div className="container-fluid pl-0 pr-0">
            <div className="row gx-0 overflow-hidden">
              <div className="col-xl-6 offset-xl-6 offset-lg-4">
                <div className="hire-text hire-text-2">
                  <div className="about-title mb-20">
                    <h5>{sub_title}</h5>
                    <h1>{title}</h1>
                  </div>
                  <div className="about-text">
                    <p>{sm_des}</p>
                  </div>
                  <ul className="professinals-list pt-10 pb-20">
                    {features_list.map((item, i) =>
                      <li key={i}> <i className="fa fa-check" style={{ cursor: "pointer" }}></i> {item} </li>
                    )}
                  </ul>
                  <div className="hiring-button">
                    <button data-animation="fadeInLeft" data-delay=".6s"
                      className="btn btn-icon btn-icon-green ml-0"><span>+</span>Apply Today</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hiring-bottom pos-rel">
          <div className="hire-right-img" style={{ backgroundImage: `url(/assets/img/hire/hire4.jpg)` , backgroundSize: 'cover' }}></div>
          <div className="container-fulid pl-0 pr-0">
            <div className="row gx-0 overflow-hidden">
              <div className="col-xl-6 col-lg-8">
                <div className="hire-text hire-text-2">
                  <div className="about-title mb-20">
                    <h5>{sub_title}</h5>
                    <h1>{title}</h1>
                  </div>
                  <div className="about-text">
                    <p>{sm_des}</p>
                  </div>
                  <ul className="professinals-list pt-10 pb-20">
                    {features_list.map((item, i) =>
                      <li key={i}> <i className="fa fa-check" style={{ cursor: "pointer" }}></i> {item} </li>
                    )}
                  </ul>
                  <div className="hiring-button">
                    <Link data-animation="fadeInLeft" data-delay=".6s" href="/contact" className="btn btn-icon ml-0">
                      <span>+</span>Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HiringAreaHomeThree;