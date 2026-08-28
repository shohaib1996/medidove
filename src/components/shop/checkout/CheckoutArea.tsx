"use client";

import { useState } from "react";
import type { NiceSelectOption } from "@/ui/NiceSelect";
import BillingDetails from "./BillingDetails";
import CustomerAccess from "./CustomerAccess";
import OrderSummary from "./OrderSummary";
import ShippingDetails from "./ShippingDetails";

const CheckoutArea = () => {
  const [login, setLogin] = useState(false);
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isShipOpen, setIsShipOpen] = useState(false);
  const selectHandler = (_item: NiceSelectOption) => {};

  return (
    <>
      <CustomerAccess
        login={login}
        isCodeOpen={isCodeOpen}
        onToggleLogin={() => setLogin((current) => !current)}
        onToggleCoupon={() => setIsCodeOpen((current) => !current)}
      />

      <section className="checkout-area pb-70">
        <div className="container">
          <form onSubmit={(event) => event.preventDefault()}>
            <div className="row">
              <div className="col-lg-6">
                <BillingDetails
                  isOpen={isOpen}
                  onToggleAccount={() => setIsOpen((current) => !current)}
                  selectHandler={selectHandler}
                />
                <ShippingDetails
                  isShipOpen={isShipOpen}
                  onToggleShipping={() =>
                    setIsShipOpen((current) => !current)
                  }
                  selectHandler={selectHandler}
                />
              </div>
              <div className="col-lg-6">
                <OrderSummary />
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default CheckoutArea;
