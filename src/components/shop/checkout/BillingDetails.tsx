import NiceSelect, { NiceSelectOption } from "@/ui/NiceSelect";
import { countryOptions } from "./checkout-form-data";

type BillingDetailsProps = {
  isOpen: boolean;
  onToggleAccount: () => void;
  selectHandler: (item: NiceSelectOption) => void;
};

const BillingDetails = ({
  isOpen,
  onToggleAccount,
  selectHandler,
}: BillingDetailsProps) => (
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
            options={countryOptions}
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
          <label htmlFor="cbox" onClick={onToggleAccount}>
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
            Create an account by entering the information below. If you are a
            returning customer please login at the top of the page.
          </p>
          <label>
            Account password <span className="required">*</span>
          </label>
          <input type="password" placeholder="password" />
        </div>
      </div>
    </div>
  </div>
);

export default BillingDetails;
