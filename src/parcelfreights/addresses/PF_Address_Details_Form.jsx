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
        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-blue-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#132B43] to-[#1e4a6f] text-white shadow-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 capitalize">{deliveryType} Address</h3>
            </div>
            {(deliveryType === "pickup" || deliveryType === "dropoff") && (
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer shadow-sm"
                >
                  Address Book
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer shadow-sm"
                >
                  Save Address
                </button>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
              {deliveryType !== "sender" ? (
                <input
                  className={`w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg text-gray-600 outline-none cursor-not-allowed ${
                    hasError && !state ? 'border-red-500' : ''
                  }`}
                  name={`${deliveryType}_state`}
                  readOnly
                  value={getFieldValue("state")}
                />
              ) : (
                <select
                  className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-gray-900 outline-none transition-all cursor-pointer ${
                    hasError && !state ? 'border-red-500' : 'border-gray-200'
                  }`}
                  name={`${deliveryType}_state`}
                  onChange={onChange}
                  value={getFieldValue("state")}
                >
                  <option value="">Select State</option>
                  {AU_STATE.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              )}
              {hasError && !state && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {deliveryType} state cannot be empty
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">City / Suburb *</label>
              <input
                className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-all ${
                  hasError && !suburb ? 'border-red-500' : 'border-gray-200'
                } ${deliveryType !== "sender" ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : 'bg-white text-gray-900'}`}
                name={`${deliveryType}_suburb`}
                readOnly={deliveryType !== "sender"}
                onChange={deliveryType === "sender" ? onChange : undefined}
                value={getFieldValue("suburb")}
              />
              {hasError && !suburb && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {deliveryType} suburb cannot be empty
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Postcode *</label>
              <input
                className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-all ${
                  hasError && !postcode ? 'border-red-500' : 'border-gray-200'
                } ${deliveryType !== "sender" ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : 'bg-white text-gray-900'}`}
                name={`${deliveryType}_postcode`}
                readOnly={deliveryType !== "sender"}
                onChange={deliveryType === "sender" ? onChange : undefined}
                value={getFieldValue("postcode") || ""}
              />
              {hasError && !postcode && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {deliveryType} postcode cannot be empty
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address 1 *</label>
              <input
                className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-gray-900 outline-none transition-all ${
                  hasError && (!address1 || address1.trim().length === 0) ? 'border-red-500' : 'border-gray-200'
                }`}
                name={`${deliveryType}_address1`}
                value={getFieldValue("address1") || ""}
                onChange={onChange}
              />
              {hasError && (!address1 || address1.trim().length === 0) && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {deliveryType} address cannot be empty
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address 2</label>
              <input
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-900 outline-none transition-all"
                name={`${deliveryType}_address2`}
                value={getFieldValue("address2") || ""}
                onChange={onChange}
                placeholder="Apartment, suite, unit, etc. (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address 3</label>
              <input
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-900 outline-none transition-all"
                name={`${deliveryType}_address3`}
                value={getFieldValue("address3") || ""}
                onChange={onChange}
                placeholder="Additional address information (optional)"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-6 md:col-span-6 sm:col-span-12">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-orange-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-orange-200">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#FF7D44] to-[#ff9966] text-white shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 capitalize">{deliveryType} Contact Details</h3>
          </div>
          
          <div className="space-y-4">
            {isCompany && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                <input
                  className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-gray-900 outline-none transition-all ${
                    hasError && !companyName ? 'border-red-500' : 'border-gray-200'
                  }`}
                  name={`${deliveryType}_company_name`}
                  value={getFieldValue("company_name") || ""}
                  onChange={onChange}
                  placeholder="Enter company name"
                />
                {hasError && !companyName && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Please enter a valid company name.
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Full Name *</label>
              <input
                className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-gray-900 outline-none transition-all ${
                  hasError && !contactName ? 'border-red-500' : 'border-gray-200'
                }`}
                name={`${deliveryType}_company_contact_name`}
                value={getFieldValue("company_contact_name") || ""}
                onChange={onChange}
                placeholder="Enter contact person's full name"
              />
              {hasError && !contactName && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Please enter a valid contact full name.
                </p>
              )}
              {hasError && contactName && !contactName.trim().includes(" ") && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Please enter a valid contact full name, e.g. Firstname Lastname
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-gray-900 outline-none transition-all ${
                  hasError && !validateEmail(email) ? 'border-red-500' : 'border-gray-200'
                }`}
                name={`${deliveryType}_company_email`}
                value={getFieldValue("company_email") || ""}
                onChange={onChange}
                placeholder="contact@company.com"
              />
              {hasError && !validateEmail(email) && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Please enter a valid email.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone No. *</label>
              <input
                type="tel"
                className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-gray-900 outline-none transition-all ${
                  hasError && (!phone || phone.trim().length === 0 || !validatePhoneNumber(phone)) ? 'border-red-500' : 'border-gray-200'
                }`}
                name={`${deliveryType}_company_phone`}
                value={getFieldValue("company_phone") || ""}
                onChange={onChange}
                placeholder="0400 000 000"
              />
              {hasError &&
                (!phone ||
                  phone.trim().length === 0 ||
                  !validatePhoneNumber(phone)) && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Please enter a valid Australia phone number.
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PF_Address_Details_Form;



