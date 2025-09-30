
import React from 'react';

type DataType = {
  sub_title: string;
  title: string;
  sm_des: string;
  features: string[];
}
const about_appoin_content: DataType = {
  sub_title: "Our Approch",
  title: "If you are a patient seeking quality.",
  sm_des: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat.",
  features: [
    "Ut enim ad minim veniam, quis nostrud exercit.",
    "Ut enim ad minim veniam, quis nostrud exercit.",
    "Ut enim ad minim veniam, quis nostrud exercit.",
    "Ut enim ad minim veniam, quis nostrud exercit.",
  ]
}
const { sub_title, title, sm_des, features } = about_appoin_content

const AboutAppoinment = () => {
  return (
    <>
      <section className="appoinment-section pt-120 pb-120" style={{ backgroundImage: `url(/assets/img/bg/appointment.jpg)` }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="appoinment-box white">
                <div className="appoinment-content">
                  <span className="small-text">{sub_title}</span>
                  <h2>{title}</h2>
                  <p>{sm_des}</p>
                  <ul className="professinals-list pt-30">
                    {features.map((item, i) =>
                      <li key={i}>
                        <i className="fa fa-check"></i>
                         {item}
                      </li>
                    )}  
                  </ul>
                </div>
                <button className="primary_btn btn mt-40">make appointment</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutAppoinment;