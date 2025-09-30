"use client"
import React from 'react';
import Image from 'next/image';
import ProductDescArea from './ProductDescArea';
import SocialLinks from '@/components/common/SocialLinks';

import thumb_1 from "@/assets/img/shop/details/thumb1.jpg";
import thumb_2 from "@/assets/img/shop/details/thumb2.jpg";
import thumb_3 from "@/assets/img/shop/details/thumb3.jpg";

import large_1 from "@/assets/img/shop/details/large1.jpg";
import large_2 from "@/assets/img/shop/details/large2.jpg";
import large_3 from "@/assets/img/shop/details/large3.jpg";

const ProductDetailsArea = () => {
  return (
    <>
      <section className="shop-banner-area pt-120 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-xl-7">
              <div className="shop-thumb-tab mb-30">
                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <a className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                      <Image src={thumb_1} style={{width: '100%', height: 'auto'}} alt="theme-pure" />
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false"
                    ><Image src={thumb_2} style={{width: '100%', height: 'auto'}} alt="theme-pure" /></a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false"
                    ><Image src={thumb_3} style={{width: '100%', height: 'auto'}} alt="theme-pure" /></a>
                  </li>
                </ul>
              </div>
              <div className="product-details-img mb-30">
                <div className="tab-content" id="pills-tabContent">
                  <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                    <div className="product-large-img">
                      <Image src={large_1} style={{width: '100%', height: 'auto'}} alt="theme-pure" />
                    </div>
                  </div>
                  <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                    <div className="product-large-img">
                      <Image src={large_2} style={{width: '100%', height: 'auto'}} alt="theme-pure" />
                    </div>
                  </div>
                  <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
                    <div className="product-large-img">
                      <Image src={large_3} style={{width: '100%', height: 'auto'}} alt="theme-pure" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-5">
              <div className="product-details mb-30">
                <div className="product-details-title">
                  <p>Workstead</p>
                  <h1>Helios Piranho Lamp</h1>
                  <div className="price details-price pb-30 mb-20">
                    <span>$700.00</span>
                    <span className="old-price">$820.00</span>
                  </div>
                </div>
                <p>It is a long established fact that a reader will be distracted by the readable content of a page
                  when looking at its
                  layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of
                  letters, as opposed to
                  using Content here, content here, making it look like readable English.</p>
                <div className="product-cat mt-30 mb-30">
                  <span>Category: </span>
                  <a href="#">furniture,</a>
                  <a href="#">decor</a>
                </div>
                <div className="product-social mb-45">
                  <SocialLinks />  
                </div>
                <div className="product-details-action">
                  <form onSubmit={e => e.preventDefault()}>
                    <div className="plus-minus">
                      <div className="cart-plus-minus"><input type="text" defaultValue={1} /></div>
                    </div>
                    <button className="btn btn-black" type="submit">add to cart</button>
                    <button className="action-btn" type="submit"><i className="fas fa-heart"></i></button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ProductDescArea />

    </>
  );
};

export default ProductDetailsArea;