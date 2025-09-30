
import testimonials_data from '@/data/TestimonialsData';
import Image from 'next/image';
import React from 'react';

const TestimonialsHomeFour = () => {
  return (
    <>
      <div className="testimonials pt-150 pb-80" style={{ backgroundImage: `url(/assets/img/home4/bg/testimonials-bg.jpg)`, backgroundRepeat: 'no-repeat'}}>
        <div className="container">
          <div className="row">
            <div className="col-xl-7 offset-xl-5 h4testi-col">
              <div className="row">
                {testimonials_data.map((item, i) =>
                  <>
                    {item.home === 4 &&
                      <div key={i} className="col-md-6">
                        <div className="h4testimonials-wrapper white-bg pos-rel">
                          <span className="h4testi-iconquato"><i className="fal fa-quote-right"></i></span>
                          <div className="h4testimonials-ratings">
                            <ul className="list-inline">
                              <li><i className="fas fa-star"></i></li>
                              <li><i className="fas fa-star"></i></li>
                              <li><i className="fas fa-star"></i></li>
                              <li><i className="fas fa-star"></i></li>
                              <li><i className="fas fa-star"></i></li>
                            </ul>
                          </div>
                          <div className="h4testimonials-content mb-20">
                            <p>{item.description}</p>
                          </div>
                          <div
                            className="h4testimonials-author d-flex align-items-center">
                            <div className="h4testimonials--author__icon">
                              <Image src={item.img} alt={item.name} />
                            </div>
                            <div className="h4testimonials--author__info">
                              <h5 className="f-600 theme-color">{item.name}</h5>
                              <span className="f-500 pink-color">{item.job_title}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestimonialsHomeFour;