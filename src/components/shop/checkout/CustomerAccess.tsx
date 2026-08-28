type CustomerAccessProps = {
  login: boolean;
  isCodeOpen: boolean;
  onToggleLogin: () => void;
  onToggleCoupon: () => void;
};

const CustomerAccess = ({
  login,
  isCodeOpen,
  onToggleLogin,
  onToggleCoupon,
}: CustomerAccessProps) => (
  <section className="coupon-area pt-100 pb-30">
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="coupon-accordion">
            <h3>
              Returning customer?{" "}
              <span id="showlogin" onClick={onToggleLogin}>
                Click here to login
              </span>
            </h3>
            <div
              id="checkout-login"
              className={`coupon-content ${login ? "d-block" : ""}`}
            >
              <div className="coupon-info">
                <p className="coupon-text">
                  Quisque gravida turpis sit amet nulla posuere lacinia. Cras
                  sed est sit amet ipsum luctus.
                </p>
                <form onSubmit={(event) => event.preventDefault()}>
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
                    <button className="primary_btn btn theme-btn" type="submit">
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
              <span id="showcoupon" onClick={onToggleCoupon}>
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
                <form onSubmit={(event) => event.preventDefault()}>
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
);

export default CustomerAccess;
