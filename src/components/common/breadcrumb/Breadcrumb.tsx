import Link from 'next/link';
import React from 'react';

type DataType = {
  sub_title: string,
  title: string,
  page: string,
}

const Breadcrumb = ({sub_title, title,  page} : DataType) => {
  return (
    <>
      <section className="breadcrumb-bg pt-200 pb-180" style={{backgroundImage: `url(/assets/img/page/page-bg.jpg)`}}>
        <div className="container">
          <div className="row">
            <div className="col-lg-9 col-md-9">
              <div className="page-title">
                <p className="small-text pb-15">{sub_title}</p>
                <h2>{title}  </h2>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 d-flex justify-content-start justify-content-md-end align-items-center">
              <div className="page-breadcumb">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb ">
                    <li className="breadcrumb-item">
                      <Link href="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">{page}</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Breadcrumb;