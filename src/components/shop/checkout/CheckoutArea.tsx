"use client";
import NiceSelect from "@/ui/NiceSelect";
import React, { useState } from "react";

const CheckoutArea = () => {
  const [login, setLogin] = useState(false);
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isShipOpen, setIsShipOpen] = useState(false);
  const selectHandler = (e: any) => {};

  return (
    <>
      <section className="coupon-area pt-100 pb-30">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="coupon-accordion">
                <h3>
                  Returning customer?{" "}
                  <span id="showlogin" onClick={() => setLogin(!login)}>
                    Click here to login
                  </span>
                </h3>
                <div
                  id="checkout-login"
                  className={`coupon-content ${login ? "d-block" : ""}`}
                >
                  <div className="coupon-info">
                    <p className="coupon-text">
                      Quisque gravida turpis sit amet nulla posuere lacinia.
                      Cras sed est sit amet ipsum luctus.
                    </p>
                    <form onSubmit={(e) => e.preventDefault()}>
                      <p className="form-row-first">
                        <label>
                          Username or email <span className="required">*</span>
                        </label>
                        <input type="text" />
                      </p>
                      <p className="form-row-last">
                        <label>
                          Password <span className="required">*</span>
                        </label>
                        <input type="text" />
                      </p>
                      <p className="form-row">
                        <button
                          className="primary_btn btn theme-btn"
                          type="submit"
                        >
                          Login
                        </button>
                        <label>
                          <input type="checkbox" /> Remember me
                        </label>
                      </p>
                      <p className="lost-password">
                        <a href="#">Lost your password?</a>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="coupon-accordion">
                <h3>
                  Have a coupon?{" "}
                  <span
                    id="showcoupon"
                    onClick={() => setIsCodeOpen(!isCodeOpen)}
                  >
                    Click here to enter your code
                  </span>
                </h3>
                <div
                  id="checkout_coupon"
                  className={`coupon-checkout-content ${
                    isCodeOpen ? "d-block" : ""
                  }`}
                >
                  <div className="coupon-info">
                    <form onSubmit={(e) => e.preventDefault()}>
                      <p className="checkout-coupon">
                        <input type="text" placeholder="Coupon Code" />
                        <button
                          className="primary_btn  btn theme-btn"
                          type="submit"
                        >
                          Apply Coupon
                        </button>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="checkout-area pb-70">
        <div className="container">
          <form onSubmit={e => e.preventDefault()}>
            <div className="row">
              <div className="col-lg-6">
                <div className="checkbox-form">
                  <h3>Billing Details</h3>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="country-select">
                        <label>
                          Country <span className="required">*</span>
                        </label>
                        <NiceSelect
                          className="nice-select d-flex justify-content-start align-items-center"
                          options={[
                            { value: "1", text: "Bangladesh" },
                            { value: "2", text: "Algeria" },
                            { value: "3", text: "Afghanistan" },
                            { value: "4", text: "Ghana" },
                            { value: "5", text: "Albania" },
                            { value: "6", text: "Bahrain" },
                            { value: "7", text: "Colombia" },
                            { value: "8", text: "Dominican Republic" },
                          ]}
                          defaultCurrent={0}
                          onChange={selectHandler}
                          name=""
                          placeholder=""
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="checkout-form-list">
                        <label>
                          First Name <span className="required">*</span>
                        </label>
                        <input type="text" placeholder="" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="checkout-form-list">
                        <label>
                          Last Name <span className="required">*</span>
                        </label>
                        <input type="text" placeholder="" />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="checkout-form-list">
                        <label>Company Name</label>
                        <input type="text" placeholder="" />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="checkout-form-list">
                        <label>
                          Address <span className="required">*</span>
                        </label>
                        <input type="text" placeholder="Street address" />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="checkout-form-list">
                        <input
                          type="text"
                          placeholder="Apartment, suite, unit etc. (optional)"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="checkout-form-list">
                        <label>
                          Town / City <span className="required">*</span>
                        </label>
                        <input type="text" placeholder="Town / City" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="checkout-form-list">
                        <label>
                          State / County <span className="required">*</span>
                        </label>
                        <input type="text" placeholder="" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="checkout-form-list">
                        <label>
                          Postcode / Zip <span className="required">*</span>
                        </label>
                        <input type="text" placeholder="Postcode / Zip" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="checkout-form-list">
                        <label>
                          Email Address <span className="required">*</span>
                        </label>
                        <input type="email" placeholder="" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="checkout-form-list">
                        <label>
                          Phone <span className="required">*</span>
                        </label>
                        <input type="text" placeholder="Postcode / Zip" />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="checkout-form-list create-acc">
                        <input id="cbox" type="checkbox" />
                        <label
                          htmlFor="cbox"
                          onClick={() => setIsOpen(!isOpen)}
                        >
                          Create an account?
                        </label>
                      </div>
                      <div
                        id="cbox_info"
                        className={`checkout-form-list create-account ${
                          isOpen ? "d-block" : ""
                        }`}
                      >
                        <p>
                          Create an account by entering the information below.
                          If you are a returning customer please login at the
                          top of the page.
                        </p>
                        <label>
                          Account password <span className="required">*</span>
                        </label>
                        <input type="password" placeholder="password" />
                      </div>
                    </div>
                  </div>
                  <div className="different-address">
                    <div className="ship-different-title">
                      <h3>
                        <label
                          htmlFor="ship-box"
                          onClick={() => setIsShipOpen(!isShipOpen)}
                        >
                          Ship to a different address?
                        </label>
                        <input id="ship-box" type="checkbox" />
                      </h3>
                    </div>
                    <div
                      id="ship-box-info"
                      className={`${isShipOpen ? "d-block" : ""}`}
                    >
                      <div className="row">
                        <div className="col-md-12">
                          <div className="country-select">
                            <label>
                              Country <span className="required">*</span>
                            </label>
                            <NiceSelect
                              className="nice-select d-flex justify-content-start align-items-center"
                              options={[
                                { value: "1", text: "Bangladesh" },
                                { value: "2", text: "Algeria" },
                                { value: "3", text: "Afghanistan" },
                                { value: "4", text: "Ghana" },
                                { value: "5", text: "Albania" },
                                { value: "6", text: "Bahrain" },
                                { value: "7", text: "Colombia" },
                                { value: "8", text: "Dominican Republic" },
                              ]}
                              defaultCurrent={0}
                              onChange={selectHandler}
                              name=""
                              placeholder=""
                            />
                          </div>

                        </div>
                        <div className="col-md-6">
                          <div className="checkout-form-list">
                            <label>
                              First Name <span className="required">*</span>
                            </label>
                            <input type="text" placeholder="" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="checkout-form-list">
                            <label>
                              Last Name <span className="required">*</span>
                            </label>
                            <input type="text" placeholder="" />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="checkout-form-list">
                            <label>Company Name</label>
                            <input type="text" placeholder="" />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="checkout-form-list">
                            <label>
                              Address <span className="required">*</span>
                            </label>
                            <input type="text" placeholder="Street address" />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="checkout-form-list">
                            <input
                              type="text"
                              placeholder="Apartment, suite, unit etc. (optional)"
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="checkout-form-list">
                            <label>
                              Town / City <span className="required">*</span>
                            </label>
                            <input type="text" placeholder="Town / City" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="checkout-form-list">
                            <label>
                              State / County <span className="required">*</span>
                            </label>
                            <input type="text" placeholder="" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="checkout-form-list">
                            <label>
                              Postcode / Zip <span className="required">*</span>
                            </label>
                            <input type="text" placeholder="Postcode / Zip" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="checkout-form-list">
                            <label>
                              Email Address <span className="required">*</span>
                            </label>
                            <input type="email" placeholder="" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="checkout-form-list">
                            <label>
                              Phone <span className="required">*</span>
                            </label>
                            <input type="text" placeholder="Postcode / Zip" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="order-notes">
                      <div className="checkout-form-list">
                        <label>Order Notes</label>
                        <textarea
                          id="checkout-mess"
                          cols={30}
                          rows={10}
                          placeholder="Notes about your order, e.g. special notes for delivery."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="your-order mb-30 ">
                  <h3>Your order</h3>
                  <div className="your-order-table table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th className="product-name">Product</th>
                          <th className="product-total">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="cart_item">
                          <td className="product-name">
                            Vestibulum suscipit{" "}
                            <strong className="product-quantity"> * 1</strong>
                          </td>
                          <td className="product-total">
                            <span className="amount">$165.00</span>
                          </td>
                        </tr>
                        <tr className="cart_item">
                          <td className="product-name">
                            Vestibulum dictum magna{" "}
                            <strong className="product-quantity"> * 1</strong>
                          </td>
                          <td className="product-total">
                            <span className="amount">$50.00</span>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="cart-subtotal">
                          <th>Cart Subtotal</th>
                          <td>
                            <span className="amount">$215.00</span>
                          </td>
                        </tr>
                        <tr className="shipping">
                          <th>Shipping</th>
                          <td>
                            <ul>
                              <li>
                                <input type="radio" />{" "}
                                <label>
                                  Flat Rate:{" "}
                                  <span className="amount">$7.00</span>
                                </label>
                              </li>
                              <li>
                                <input type="radio" />{" "}
                                <label>Free Shipping:</label>
                              </li>
                              <li></li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="order-total">
                          <th>Order Total</th>
                          <td>
                            <strong>
                              <span className="amount">$215.00</span>
                            </strong>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="payment-method">
                    <div className="accordion" id="accordionExample">
                      <div className="card accordion-item">
                        <div className="card-header">
                          <h5 className="mb-0 accordion-header" id="headingOne">
                            <button
                              className="btn-link accordion-button text-start"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseOne"
                              aria-expanded="true"
                              aria-controls="collapseOne"
                            >
                              Direct Bank Transfer
                            </button>
                          </h5>
                        </div>

                        <div
                          id="collapseOne"
                          className="collapse show"
                          aria-labelledby="headingOne"
                          data-parent="#accordionExample"
                        >
                          <div className="card-body">
                            Make your payment directly into our bank account.
                            Please use your Order ID as the payment reference.
                            Your order {"ww are not"} be shipped until the funds have
                            cleared in our account.
                          </div>
                        </div>
                      </div>

                      <div className="card accordion-item">
                        <div className="card-header">
                          <h5 className="mb-0 accordion-header" id="headingTwo">
                            <button
                              className="btn-link accordion-button collapsed text-start"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseTwo"
                              aria-expanded="false"
                              aria-controls="collapseTwo"
                            >
                              Cheque Payment
                            </button>
                          </h5>
                        </div>
                        <div
                          id="collapseTwo"
                          className="accordion-collapse collapse"
                          aria-labelledby="headingTwo"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="card-body">
                            Please send your cheque to Store Name, Store Street,
                            Store Town, Store State / County, Store Postcode.
                          </div>
                        </div>
                      </div>

                      <div className="card accordion-item">
                        <div className="card-header">
                          <h5
                            className="mb-0 accordion-header"
                            id="headingThree"
                          >
                            <button
                              className="btn-link accordion-button collapsed text-start"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseThree"
                              aria-expanded="false"
                              aria-controls="collapseThree"
                            >
                              PayPal
                            </button>

                            
                          </h5>
                        </div>
                        <div
                          id="collapseThree"
                          className="accordion-collapse collapse"
                          aria-labelledby="headingThree"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="card-body">
                            Pay via PayPal; you can pay with your credit card if
                            you do not have a PayPal account.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="order-button-payment mt-20">
                      <button
                        type="submit"
                        className="primary_btn btn theme-btn"
                      >
                        Place order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

    </>
  );
};

export default CheckoutArea;
