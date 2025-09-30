"use client"
import React from "react";



const ProductDescArea = () => {
  return (
    <>
      <section className="product-desc-area pb-80">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="bakix-details-tab">
                <ul className="nav nav-tabs text-center justify-content-center pb-30 mb-50" id="nav-tab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="nav-home2-tab" data-bs-toggle="tab"
                      data-bs-target="#nav-home2"
                      type="button" role="tab"
                      aria-controls="nav-home2"
                      aria-selected="true"
                    >Description </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link"
                      id="pills-profile2-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-profile2"
                      type="button" role="tab"
                      aria-controls="pills-profile2"
                      aria-selected="false">Additional Information</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link"
                      id="pills-contact2-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-contact2"
                      type="button" role="tab"
                      aria-controls="pills-contact2"
                      aria-selected="false">Reviews(10)</button>
                  </li>
                </ul>
              </div>


              <div className="tab-content" id="pills-tabContent2">
                <div className="tab-pane fade show active" id="nav-home2" role="tabpanel" aria-labelledby="nav-home2-tab">
                  <div className="event-text mb-40">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                      incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
                      ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                      fugiat nulla pariatur. Excepteur sint
                      occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
                      id est laborum. Sed ut perspiciatis
                      unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                      totam rem aperiam, eaque ipsa quae ab
                      illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                      Nemo enim ipsam voluptatem quia
                      voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
                      eos qui ratione voluptatem sequi
                      nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
                      consectetur, adipisci velit, sed quia non
                      numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
                      voluptatem.</p>
                    <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                      deserunt mollit anim id est laborum. Sed ut
                      perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                      laudantium, totam rem aperiam, eaque
                      ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta
                      sunt explicabo. Nemo enim ipsam voluptatem
                      quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni
                      dolores eos qui ratione voluptatem sequi
                      nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
                      consectetur, adipisci velit, sed quia non
                      numquam eius modi tempora.</p>
                  </div>
                </div>
                <div className="tab-pane fade" id="pills-profile2" role="tabpanel" aria-labelledby="pills-profile2-tab">
                  <div className="additional-info">
                    <div className="table-responsive">
                      <h4>Additional information</h4>
                      <table className="table">
                        <tbody>
                          <tr>
                            <th>Weight</th>
                            <td className="product_weight">1.4 oz</td>
                          </tr>
                          <tr>
                            <th>Dimensions</th>
                            <td className="product_dimensions">62 * 56 * 12 in</td>
                          </tr>
                          <tr>
                            <th>Size</th>
                            <td className="product_dimensions">XL, XXL, LG, SM, MD</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="pills-contact2" role="tabpanel" aria-labelledby="pills-contact2-tab">
                  <div className="additional-info">
                    <div className="event-text mb-40">
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                        incididunt ut labore et dolore magna
                        aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
                        ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint
                        occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
                        id est laborum. Sed ut perspiciatis
                        unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                        totam rem aperiam, eaque ipsa quae ab
                        illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                        Nemo enim ipsam voluptatem quia
                        voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
                        eos qui ratione voluptatem sequi
                        nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
                        consectetur, adipisci velit, sed quia non
                        numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
                        voluptatem.</p>
                      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                        deserunt mollit anim id est laborum. Sed ut
                        perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                        laudantium, totam rem aperiam, eaque
                        ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta
                        sunt explicabo. Nemo enim ipsam voluptatem
                        quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni
                        dolores eos qui ratione voluptatem sequi
                        nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
                        consectetur, adipisci velit, sed quia non
                        numquam eius modi tempora.</p>
                    </div>
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

export default ProductDescArea;