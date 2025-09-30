'use client'
import React from 'react';

type DataType = {
  sub_title: string;
  title: string;
}

const fact_content: DataType = {
  sub_title: "Health Care Services",
  title: "Don't Hesitate, Contact <br /> Us For Better Help & Services.",
}
const {sub_title, title}  = fact_content

const FactAreaHomeFour = () => {
  return (
    <>
      <section className="fact-area fact-map green-bg pos-rel pt-115 pb-120">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-10 offset-xl-1">
              <div className="section-title pos-rel">
                <div
                  className="section-text section-text-white pos-rel text-center"
                >
                  <h5 className="white-color f-400">{sub_title}</h5>
                  <h1 className="white-color mb-0"  dangerouslySetInnerHTML={{ __html: title }}></h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FactAreaHomeFour;