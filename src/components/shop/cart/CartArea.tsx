'use client'
import React from 'react';

import shap_img_1 from "@/assets/img/shop/img1.jpg";
import shap_img_2 from "@/assets/img/shop/img2.jpg";
import Image from 'next/image';

const CartArea = () => {
  return (
    <>
      <section className="cart-area pt-120 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <form onSubmit={e => e.preventDefault()}>
                <div className="table-content table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="product-thumbnail">Images</th>
                        <th className="cart-product-name">Product</th>
                        <th className="product-price">Unit Price</th>
                        <th className="product-quantity">Quantity</th>
                        <th className="product-subtotal">Total</th>
                        <th className="product-remove">Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="product-thumbnail"><a href="#">
                          <Image src={shap_img_1} style={{width: '125px', height: 'auto'}} alt="theme-pure" /></a></td>
                        <td className="product-name"><a href="#">Bakix Furniture</a></td>
                        <td className="product-price"><span className="amount">$130.00</span></td>
                        <td className="product-quantity">
                          <div className="cart-plus-minus"><input type="text" defaultValue={1} /></div>
                        </td>
                        <td className="product-subtotal"><span className="amount">$130.00</span></td>
                        <td className="product-remove"><a href="#"><i className="fa fa-times"></i></a></td>
                      </tr>
                      <tr>
                        <td className="product-thumbnail"><a href="#">
                          <Image src={shap_img_2} style={{width: '125px', height: 'auto'}} alt="theme-pure" /></a></td>
                        <td className="product-name"><a href="#">Sujon Chair Set</a></td>
                        <td className="product-price"><span className="amount">$120.50</span></td>
                        <td className="product-quantity">
                          <div className="cart-plus-minus"><input type="text" defaultValue={1} /></div>
                        </td>
                        <td className="product-subtotal"><span className="amount">$120.50</span></td>
                        <td className="product-remove"><a href="#"><i className="fa fa-times"></i></a></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="coupon-all"> 
                        <div className="coupon">
                          <input id="coupon_code" className="input-text" name="coupon_code" defaultValue=""
                            placeholder="Coupon code" type="text" />
                            <button className="primary_btn btn theme-btn-2" name="apply_coupon" type="submit">
                              Apply coupon
                            </button>
                        </div>
                        <div className="coupon2"> 
                          <button className="primary_btn btn theme-btn" type='submit'>Update cart</button>
                        </div> 
                    </div>
                  </div>
                </div>
                <div className="row justify-content-end">
                  <div className="col-md-5 ml-auto">
                    <div className="cart-page-total">
                      <h2>Cart totals</h2>
                      <ul className="mb-20">
                        <li>Subtotal <span>$250.00</span></li>
                        <li>Total <span>$250.00</span></li>
                      </ul>
                      <button className="primary_btn btn theme-btn">Proceed to checkout</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CartArea;