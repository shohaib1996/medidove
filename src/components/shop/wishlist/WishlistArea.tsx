'use client'
import React from 'react';
import shop_img_1 from "@/assets/img/shop/img2.jpg";
import shop_img_2 from "@/assets/img/shop/img4.jpg";
import Image from 'next/image';

const WishlistArea = () => {
  return (
    <>
      <section className="cart-area pt-120 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <form  onSubmit={e => e.preventDefault()}>
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
                          <Image src={shop_img_1} alt="theme-pure" /></a></td>
                        <td className="product-name"><a href="#">Bakix Furniture</a></td>
                        <td className="product-price"><span className="amount">$130.00</span></td>
                        <td className="product-quantity">
                          <button className="primary_btn btn theme-btn-2" type="submit">Add TO Cart</button>
                        </td>
                        <td className="product-subtotal"><span className="amount">$130.00</span></td>
                        <td className="product-remove"><a href="#"><i className="fa fa-times"></i></a></td>
                      </tr>
                      <tr>
                        <td className="product-thumbnail"><a href="#">
                          <Image src={shop_img_2} alt="theme-pure" /></a></td>
                        <td className="product-name"><a href="#">Sujon Chair Set</a></td>
                        <td className="product-price"><span className="amount">$120.50</span></td>
                        <td className="product-quantity">
                          <button className="primary_btn btn theme-btn-2" type="submit">Add TO Cart</button>
                        </td>
                        <td className="product-subtotal"><span className="amount">$120.50</span></td>
                        <td className="product-remove"><a href="#"><i className="fa fa-times"></i></a></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WishlistArea;