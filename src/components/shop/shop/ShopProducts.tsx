'use client'
import shop_data from '@/data/ShopData';
import NiceSelect from '@/ui/NiceSelect';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import ReactPaginate from 'react-paginate';


const ShopProducts = () => {
  const selectHandler = (e: any) => { };

  const itemsPerPage = 9;
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = shop_data.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(shop_data.length / itemsPerPage);
  // click to request another page.
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % shop_data.length;
    setItemOffset(newOffset);
  };


  return (
    <>
      <section className="shop-banner-area pt-120 pb-120">
        <div className="container">
          <div className="row mt-20">
            <div className="col-xl-4 col-lg-5 col-md-6">
              <div className="product-showing mb-40">
                <p>Showing 1-22 of 32 results</p>
              </div>
            </div>
            <div className="col-xl-8 col-lg-7 col-md-6">
              <div className="shop-tab f-right">
                <ul
                  className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="pills-home-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-home"
                      type="button"
                      role="tab"
                      aria-controls="pills-home"
                      aria-selected="true"> <i className="fas fa-th-large"></i> </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-profile-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-profile"
                      type="button"
                      role="tab"
                      aria-controls="pills-profile"
                      aria-selected="false"><i className="fas fa-list-ul"></i></button>
                  </li>
                </ul>
              </div>
              <div className="pro-filter mb-40 f-right">
                <NiceSelect
                  className="pro-filter"
                  options={[
                    { value: "1", text: "Shop By" },
                    { value: "2", text: "Top Sales" },
                    { value: "3", text: "New Product" },
                    { value: "4", text: "A to Z Product" },
                  ]}
                  defaultCurrent={0}
                  onChange={selectHandler}
                  name=''
                  placeholder=''
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="tab-content" id="pills-tabContent">

                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                  <div className="row">
                    {currentItems.map((item, i) =>
                      <div key={i} className="col-lg-4 col-md-6">
                        <div className="product mb-40">
                          <div className="product__img">
                            <Link href="/product-details">
                              <Image src={item.img} alt={item.title} style={{ width: "100%", height: "auto" }} />
                            </Link>
                            <div className="product-action text-center">
                              <a href="#"><i className="fas fa-shopping-cart"></i></a>
                              <a href="#"><i className="fas fa-heart"></i></a>
                              <Link href="/porduct-details">
                                <i className="fas fa-expand"></i>
                              </Link>
                            </div>
                          </div>
                          <div className="product__content text-center pt-30">
                            <span className="pro-cat"><a href="#">{item.item_name}</a></span>
                            <h4 className="pro-title"><Link href="/product-details">{item.title}</Link></h4>
                            <div className="price">
                              <span>${item.price.toLocaleString()}.00</span>
                              <span className="old-price">${item.old_price}.00</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                  {currentItems.map((list_item, index) =>
                    <div key={index} className="row">
                      <div className="col-lg-4 col-md-6">
                        <div className="product mb-30">
                          <div className="product__img">
                            <Link href="/product-details">
                              <Image style={{ width: "100%", height: "auto" }} src={list_item.img} alt="theme-pure" />
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-8">
                        <div className="product-list-content pt-10 mb-30">
                          <div className="product__content mb-20">
                            <span className="pro-cat"><a href="#">{list_item.item_name}</a></span>
                            <h4 className="pro-title">
                              <Link href="/product-details">{list_item.title}</Link>
                            </h4>
                            <div className="price">
                              <span>${list_item.price}.00</span>
                              <span className="old-price">${list_item.old_price}.00</span>
                            </div>
                          </div>
                          <p>{list_item.sm_des}</p>
                          <div className="product-action-list">
                            <a className="primary_btn btn-theme">add to cart</a>
                            <a className="action-btn" href="#"><i className="fas fa-heart"></i></a>
                            <Link className="action-btn" href="/product-details">
                              <i className="fas fa-expand"></i></Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="basic-pagination basic-pagination-2 text-center mt-20">
                <ReactPaginate
                  breakLabel="..."
                  nextLabel=">"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={9}
                  pageCount={pageCount}
                  previousLabel="<"
                  renderOnZeroPageCount={null}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopProducts;