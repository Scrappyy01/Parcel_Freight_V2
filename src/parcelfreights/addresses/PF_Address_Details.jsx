'use client';

import { Fragment, useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { isEmpty } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import {
  submitAddress,
  updateAddress,
} from "./../../redux/services/addressSlice";

import { Button, Typography } from "@/components/ui/ui";

import PF_Address_Details_Form from "./PF_Address_Details_Form";
import PFFedexExtraForm from "./PF_Fedex_Extra_Form";
import PFCPExtraForm from "./PF_CP_Extra_Form";
import {
  validateEmail,
  formatCollectionDate,
  validatePhoneNumber,
} from "@/utils/helpers";
import { validateCollectionTime, getTime } from "@/utils/helpers";
import { isToday } from "@/utils/helpers";
import { buildHolidaysSetAU } from "@/utils/helpers";

function PF_Address_Details({ onSubmitParcelFreightAddress, onBack }) {
  const {
    data: freight_address,
    status,
    error,
  } = useSelector((state) => state.address);
  const { data: parcelFreight } = useSelector((state) => state.parcelFreight);
  const { data: collection } = useSelector((state) => state.collection);
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState("");
  const [isPickupCompany, setIsPickupCompany] = useState(
    collection && collection.pickup_building_type === "Commercial"
  );
  const [isDropoffCompany, setIsDropoffCompany] = useState(
    collection && collection.delivery_building_type === "Commercial"
  );
  const [isFedex, setIsFedex] = useState(false);

  const [formData, setFormData] = useState({
    pickup_state: "",
    pickup_suburb: "",
    pickup_postcode: "",
    pickup_address1: "",
    pickup_address2: "",
    pickup_address3: "",
    pickup_company_name: "",
    pickup_company_contact_name: "",
    pickup_company_email: "",
    pickup_company_phone_area_code: "",
    pickup_company_phone: "",
    dropoff_state: "",
    dropoff_suburb: "",
    dropoff_postcode: "",
    dropoff_address1: "",
    dropoff_address2: "",
    dropoff_address3: "",
    dropoff_company_name: "",
    dropoff_company_contact_name: "",
    dropoff_company_email: "",
    dropoff_company_phone_area_code: "",
    dropoff_company_phone: "",
    selected_service: {},
    collection_date_time: collection.collection_date_time,
    collection_time_start: collection.collection_time_start,
    collection_time_end: collection.collection_time_end,
  });

  const [hasError, setHasError] = useState(false);

  const params = useParams();
  const freight_id = params?.id; // Get 'id' from route params since the route is [id]

  const holidaysSet = useMemo(() => {
    if (formData?.pickup_state) {
      return buildHolidaysSetAU(formData?.pickup_state);
    }
  }, [formData?.pickup_state]);

  useEffect(() => {
    const updatedAddress = [];

    if (!isEmpty(freight_address)) {
      let freight_address_arr = freight_address;
      if (!Array.isArray(freight_address)) {
        freight_address_arr = Object.values(freight_address);
      }
      freight_address_arr.forEach((address) => {
        switch (address.address_type) {
          case "Pickup":
            updatedAddress.pickup_state = address.state;
            updatedAddress.pickup_suburb = address.suburb;
            updatedAddress.pickup_postcode = address.postcode;
            updatedAddress.pickup_address1 = address.address1;
            updatedAddress.pickup_address2 = address.address2;
            updatedAddress.pickup_address3 = address.address3;
            updatedAddress.pickup_company_name = address.company_name;
            updatedAddress.pickup_company_contact_name =
              address.company_contact_name;
            updatedAddress.pickup_company_email = address.company_email;
            updatedAddress.pickup_company_phone_area_code =
              address.company_phone_area_code;
            updatedAddress.pickup_company_phone = address.company_phone;
            break;
          case "Dropoff":
            updatedAddress.dropoff_state = address.state;
            updatedAddress.dropoff_suburb = address.suburb;
            updatedAddress.dropoff_postcode = address.postcode;
            updatedAddress.dropoff_address1 = address.address1;
            updatedAddress.dropoff_address2 = address.address2;
            updatedAddress.dropoff_address3 = address.address3;
            updatedAddress.dropoff_company_name = address.company_name;
            updatedAddress.dropoff_company_contact_name =
              address.company_contact_name;
            updatedAddress.dropoff_company_email = address.company_email;
            updatedAddress.dropoff_company_phone_area_code =
              address.company_phone_area_code;
            updatedAddress.dropoff_company_phone = address.company_phone;
            break;
        }
      });

      setFormData({
        ...formData,
        ...updatedAddress,
        selected_service: parcelFreight,
      });
    }
  }, [freight_address, parcelFreight]);

  const handleGoBack = () => {
    onBack();
  };

  const handleChange = (e, nameForm = "", courierName = "") => {
    if (e instanceof Date && !isNaN(e)) {
      setFormData((prevData) => ({
        ...prevData,
        [nameForm]: formatCollectionDate(e, courierName),
      }));
    } else {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission and prevent default behavior
  const handleParcelFreightAddressSubmit = async (event) => {
    console.log("submitted...");
    event.preventDefault();
    if (
      !formData.pickup_state ||
      !formData.pickup_suburb ||
      !formData.pickup_postcode ||
      !formData.pickup_address1 ||
      !formData.pickup_company_contact_name ||
      !formData.pickup_company_email ||
      !formData.pickup_company_phone ||
      !formData.dropoff_state ||
      !formData.dropoff_suburb ||
      !formData.dropoff_postcode ||
      !formData.dropoff_address1 ||
      !formData.dropoff_company_contact_name ||
      !formData.dropoff_company_email ||
      !formData.dropoff_company_phone ||
      (collection &&
        collection.pickup_building_type === "Commercial" &&
        !formData.pickup_company_name) ||
      (collection &&
        collection.dropoff_building_type === "Commercial" &&
        !formData.dropoff_company_name) ||
      !formData.collection_time_end
    ) {
      setHasError(true);
      return;
    }

    // Validate collection date is today and start time compared to cutoff time
    if (
      formData.collection_time_start &&
      collection.service_collection_cutoff_time &&
      isToday(new Date(formData.collection_date_time)) &&
      !validateCollectionTime(
        getTime(formData.collection_time_start),
        collection.service_collection_cutoff_time
      )
    ) {
      setHasError(true);
      setErrorMessage(
        `Collection start time must be early then the Today's ${collection.service_collection_cutoff_time}.`
      );
      return;
    }

    // Validate collection end time compared to cutoff time
    if (
      formData.collection_time_end &&
      collection.service_collection_cutoff_time &&
      isToday(new Date(formData.collection_date_time)) &&
      !validateCollectionTime(
        getTime(formData.collection_time_end),
        collection.service_collection_cutoff_time
      )
    ) {
      setHasError(true);
      setErrorMessage(
        `Collection end time must be early then the Today's ${collection.service_collection_cutoff_time}.`
      );
      return;
    }

    // Validate collection start time compared with end time
    if (formData.collection_time_start > formData.collection_time_end) {
      setHasError(true);
      setErrorMessage("Collection start time must be earlier than end time.");
      return;
    }

    // validate company contact name and must contain at least a first and last name
    if (
      (formData.pickup_company_contact_name &&
        !formData.pickup_company_contact_name.trim().includes(" ")) ||
      (formData.dropoff_company_contact_name &&
        !formData.dropoff_company_contact_name.trim().includes(" "))
    ) {
      setHasError(true);
      return;
    }

    const isValidContactName = (name) => {
      const regex = /^[A-Za-z0-9 -]+$/;
      return regex.test(name);
    };

    if (
      formData.selected_service.service_name === "Couriers Please" &&
      (!isValidContactName(formData.pickup_company_contact_name) ||
        !isValidContactName(formData.dropoff_company_contact_name))
    ) {
      setHasError(true);
      setErrorMessage("Contact Name must be letters, number, -, and space");
      return;
    }

    // validate company email
    if (
      (formData.pickup_company_email &&
        !validateEmail(formData.pickup_company_email)) ||
      (formData.dropoff_company_email &&
        !validateEmail(formData.dropoff_company_email))
    ) {
      setHasError(true);
      return;
    }

    // validate company phone numbers
    if (
      (formData.pickup_company_phone &&
        !validatePhoneNumber(formData.pickup_company_phone)) ||
      (formData.dropoff_company_phone &&
        !validatePhoneNumber(formData.dropoff_company_phone))
    ) {
      setHasError(true);
      return;
    }

    setHasError(false);

    if (!formData.collection_date_time) {
      formData.collection_date_time = new Date();
    }

    if (!formData.collection_time_start) {
      formData.collection_time_start = new Date();
    }

    if (!freight_address[0]?.postcode) {
      dispatch(submitAddress({ freight_id, formData }));
    } else {
      dispatch(updateAddress({ freight_id, formData }));
    }
  };

  useEffect(() => {
    if (status === "succeeded") {
      setErrorMessage("");
      onSubmitParcelFreightAddress();
      // Scroll to top of the page when successfully moving to next section
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (status === "failed") {
      console.log("Validation Error:", error);
      if (error && typeof error === "object") {
        // Get all Laravel validation messages
        const messages = error.message || Object.values(error).flat();
        setErrorMessage(messages);
      } else if (typeof error === "string") {
        setErrorMessage(error);
      } else {
        setErrorMessage("Failed to submit address");
      }
    }
  }, [status, error]);

  useEffect(() => {
    setIsFedex(
      collection.service_name.toLowerCase().replace(/\s+/g, "") === "fedex"
    );
  }, [collection]);

  return (
    <Fragment>
      {errorMessage && (
        <Typography className="text-center" color="error">
          {errorMessage}
        </Typography>
      )}
      <form
        onSubmit={handleParcelFreightAddressSubmit}
        id="page-three-address"
        className="XXcontainer form-background"
        noValidate
      >
        <div className="grid grid-cols-1 gap-6">
          <PF_Address_Details_Form
            isCompany={isPickupCompany}
            deliveryType="pickup"
            formData={formData}
            onChange={handleChange}
            hasError={hasError}
          />
          <PF_Address_Details_Form
            isCompany={isDropoffCompany}
            deliveryType="dropoff"
            formData={formData}
            onChange={handleChange}
            hasError={hasError}
          />
          {isFedex ? (
            <PFFedexExtraForm
              formData={formData}
              serviceName={collection.service_name}
              onChange={handleChange}
              hasError={hasError}
              pickup_state={collection.pickup_state}
              holidaysSet={holidaysSet}
            />
          ) : (
            <PFCPExtraForm
              formData={formData}
              serviceName={collection.service_name}
              onChange={handleChange}
              hasError={hasError}
              pickup_state={collection.pickup_state}
              holidaysSet={holidaysSet}
            />
          )}
        </div>
        {errorMessage && (
          <Typography className="text-center" color="error">
            {errorMessage}
          </Typography>
        )}
        <div className="flex justify-center items-center gap-4 mt-8 mb-6">
          <button
            type="button"
            onClick={handleGoBack}
            className="px-12 py-4 bg-white border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <button
            type="submit"
            form="page-three-address"
            className="px-12 py-4 bg-gradient-to-r from-[#FF7D44] to-[#ff9966] text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all cursor-pointer shadow-md flex items-center gap-2"
          >
            Confirm Details 
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </Fragment>
  );
}

export default PF_Address_Details;



