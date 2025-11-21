'use client';

import { useState, useEffect } from "react";

import { validateEmail, validatePhoneNumber } from "../../utils/helpers";
import { AU_STATE } from "@/utils/constant";

const PF_Address_Details_Form = ({
  deliveryType,
  formData,
  onChange,
  isCompany = false,
  hasError = false,
}) => {
  const getFieldValue = (fieldName) =>
    formData[`${deliveryType}_${fieldName}`] || "";
  const [state, setState] = useState("");
  const [suburb, setSuburb] = useState("");
  const [postcode, setPostcode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [areaCode, setAreaCode] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    switch (deliveryType) {
      case "pickup":
        if (formData) {
          setState(formData.pickup_state);
          setSuburb(formData.pickup_suburb);
          setPostcode(formData.pickup_postcode);
          setAddress1(formData.pickup_address1);
          setAddress2(formData.pickup_address2);
          setAddress3(formData.pickup_address3);
          setCompanyName(formData.pickup_company_name);
          setContactName(formData.pickup_company_contact_name);
          setEmail(formData.pickup_company_email);
          setAreaCode(formData.pickup_company_phone_area_code);
          setPhone(formData.pickup_company_phone);
        }
        break;
      case "dropoff":
        if (formData) {
          setState(formData.dropoff_state);
          setSuburb(formData.dropoff_suburb);
          setPostcode(formData.dropoff_postcode);
          setAddress1(formData.dropoff_address1);
          setAddress2(formData.dropoff_address2);
          setAddress3(formData.dropoff_address3);
          setCompanyName(formData.dropoff_company_name);
          setContactName(formData.dropoff_company_contact_name);
          setEmail(formData.dropoff_company_email);
          setAreaCode(formData.dropoff_company_phone_area_code);
          setPhone(formData.dropoff_company_phone);
        }
        break;
      case "sender":
        if (formData) {
          setState(formData.sender_state);
          setSuburb(formData.sender_suburb);
          setPostcode(formData.sender_postcode);
          setAddress1(formData.sender_address1);
          setAddress2(formData.sender_address2);
          setAddress3(formData.sender_address3);
          setCompanyName(formData.sender_company_name);
          setContactName(formData.sender_company_contact_name);
          setEmail(formData.sender_company_email);
          setAreaCode(formData.sender_company_phone_area_code);
          setPhone(formData.sender_company_phone);
        }
        break;
      default:
        break;
    }
  }, [formData]);

  return (
    <>
      <div className="lg:col-span-6 md:col-span-6 sm:col-span-12">
        <h3 className="capitalize">{deliveryType} address</h3>
        <div className="pfs-input-form-group">
          <div className="pfs-input-form-group">
            <label className="pfs-input-label">State *</label>
            <select
              className="pfs-input"
              name={`${deliveryType}_state`}
              readOnly={deliveryType !== "sender"}
              onChange={deliveryType === "sender" ? onChange : undefined}
              value={getFieldValue("state")}
            >
              <option value="">Select State</option>
              {AU_STATE.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {hasError && !state && (
              <p className="text-xs text-red-600 mt-1">
                {deliveryType} state cannot be empty
              </p>
            )}
          </div>
        </div>
        <div className="pfs-input-form-group">
          <label className="pfs-input-label">City / Suburb *</label>
          <input
            className="pfs-input"
            name={`${deliveryType}_suburb`}
            readOnly={deliveryType !== "sender"}
            onChange={deliveryType === "sender" ? onChange : undefined}
            value={getFieldValue("suburb")}
          />
          {hasError && !suburb && (
            <p className="text-xs text-red-600 mt-1">
              {deliveryType} suburb cannot be empty
            </p>
          )}
        </div>
        <div className="pfs-input-form-group">
          <label className="pfs-input-label">Postcode *</label>
          <input
            className="pfs-input"
            name={`${deliveryType}_postcode`}
            readOnly={deliveryType !== "sender"}
            onChange={deliveryType === "sender" ? onChange : undefined}
            value={getFieldValue("postcode") || ""}
          />
          {hasError && !postcode && (
            <p className="text-xs text-red-600 mt-1">
              {deliveryType} postcode cannot be empty
            </p>
          )}
        </div>
        <div className="pfs-input-form-group">
          <label className="pfs-input-label">Address 1 *</label>
          <input
            className="pfs-input flex items-center"
            name={`${deliveryType}_address1`}
            value={getFieldValue("address1") || ""}
            onChange={onChange}
          />
          {hasError && (!address1 || address1.trim().length === 0) && (
            <p className="text-xs text-red-600 mt-1">
              {deliveryType} address cannot be empty
            </p>
          )}
        </div>
        <div className="pfs-input-form-group">
          <label className="pfs-input-label">Address 2</label>
          <input
            className="pfs-input flex items-center"
            name={`${deliveryType}_address2`}
            value={getFieldValue("address2") || ""}
            onChange={onChange}
          />
        </div>
        <div className="pfs-input-form-group">
          <label className="pfs-input-label">Address 3</label>
          <input
            className="pfs-input flex items-center"
            name={`${deliveryType}_address3`}
            value={getFieldValue("address3") || ""}
            onChange={onChange}
          />
        </div>
      </div>
      <div className="lg:col-span-6 md:col-span-6 sm:col-span-12">
        <h3 className="capitalize">
          {deliveryType} contact details
        </h3>
        {isCompany && (
          <div className="pfs-input-form-group">
            <label className="pfs-input-label">Company Name</label>
            <input
              className="pfs-input flex items-center"
              name={`${deliveryType}_company_name`}
              value={getFieldValue("company_name") || ""}
              onChange={onChange}
            />
            {hasError && !companyName && (
              <p className="text-xs text-red-600 mt-1">
                Please enter a valid company name.
              </p>
            )}
          </div>
        )}
        <div className="pfs-input-form-group">
          <label className="pfs-input-label">
            Contact Full Name *
          </label>
          <input
            className="pfs-input flex items-center"
            name={`${deliveryType}_company_contact_name`}
            value={getFieldValue("company_contact_name") || ""}
            onChange={onChange}
          />
          {hasError && !contactName && (
            <p className="text-xs text-red-600 mt-1">
              Please enter a valid contact full name.
            </p>
          )}
          {hasError && contactName && !contactName.trim().includes(" ") && (
            <p className="text-xs text-red-600 mt-1">
              Please enter a valid contact full name, e.g. Firstname Lastname
            </p>
          )}
        </div>
        <div className="pfs-input-form-group">
          <label className="pfs-input-label">Email Address *</label>
          <input
            className="pfs-input flex items-center"
            name={`${deliveryType}_company_email`}
            value={getFieldValue("company_email") || ""}
            onChange={onChange}
          />
          {hasError && !validateEmail(email) && (
            <p className="text-xs text-red-600 mt-1">
              Please enter a valid email.
            </p>
          )}
        </div>
        <div className="pfs-input-form-group">
          <label className="pfs-input-label">Phone No. *</label>
          <input
            className="pfs-input flex items-center"
            name={`${deliveryType}_company_phone`}
            value={getFieldValue("company_phone") || ""}
            onChange={onChange}
          />
          {hasError &&
            (!phone ||
              phone.trim().length === 0 ||
              !validatePhoneNumber(phone)) && (
              <p className="text-xs text-red-600 mt-1">
                Please enter a valid Australia phone number.
              </p>
            )}
        </div>
      </div>
    </>
  );
};

export default PF_Address_Details_Form;



