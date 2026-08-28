const OrderSummary = () => (
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
                    Flat Rate: <span className="amount">$7.00</span>
                  </label>
                </li>
                <li>
                  <input type="radio" /> <label>Free Shipping:</label>
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
              Make your payment directly into our bank account. Please use your
              Order ID as the payment reference. Your order {"ww are not"} be
              shipped until the funds have cleared in our account.
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
              Please send your cheque to Store Name, Store Street, Store Town,
              Store State / County, Store Postcode.
            </div>
          </div>
        </div>

        <div className="card accordion-item">
          <div className="card-header">
            <h5 className="mb-0 accordion-header" id="headingThree">
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
              Pay via PayPal; you can pay with your credit card if you do not
              have a PayPal account.
            </div>
          </div>
        </div>
      </div>
      <div className="order-button-payment mt-20">
        <button type="submit" className="primary_btn btn theme-btn">
          Place order
        </button>
      </div>
    </div>
  </div>
);

export default OrderSummary;
