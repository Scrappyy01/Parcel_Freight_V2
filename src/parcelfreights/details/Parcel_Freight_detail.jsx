'use client';

import { Fragment, useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { submitPackageWithQuote } from "../../redux/services/parcelFreightSlice";

import { useRouter, useParams } from "next/navigation";
import _, { isEmpty } from "lodash";

import ParcelFreightPricingRow from "../details/Parcel_Freight_Pricing_Row";

import { UserContext } from "../../contexts/UserContext";
import Parcel_Freight_Package from "../details/Parcel_Freight_Package";

import { getPricingRow } from "@/utils/helpers";
import { ROADEXPRESS } from "@/utils/constant";
import { OVERNIGHTEXPRESS } from "@/utils/constant";
import { AIREXPRESS } from "@/utils/constant";
import { ASAPHOTSHOT } from "@/utils/constant";
import { TECHNOLOGYEXPRESS } from "@/utils/constant";

const Parcel_Freight_Detail = ({ onSubmitParcelFreightDetail }) => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.collection);
  const {
    data: parcel_freight_data,
    status,
    error,
  } = useSelector((state) => state.parcelFreight);

  const { pf_user, setPf_User } = useContext(UserContext);
  const [selected, setSelected] = useState(false);
  const [flashRed, setFlashRed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const [selectedService, setSelectedService] = useState({});
  const [userId, setUserId] = useState(pf_user?.id || null);

  const [pickupSuburb, setPickupSuburb] = useState("");
  const [deliverySuburb, setDeliverySuburb] = useState("");
  const [freightCreatedAt, setFreightCreatedAt] = useState(
    "2024-01-01 00:00:00"
  );
  const [userName, setUserName] = useState("");
  const [totalQty, setTotalQty] = useState(1);
  const [totalKgs, setTotalKgs] = useState(1);
  const [totalVolume, setTotalVolume] = useState(1);
  const [pfPackage, setPfPackage] = useState({});
  const [selectServiceQuoteId, setSelectServiceQuoteId] = useState("");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [hasPaid, setHasPaid] = useState(false);

  // State to keep track of rows
  const [pricingRows, setPricingRows] = useState([
    {
      id: 1,
      service_type: _.startCase(ROADEXPRESS),
      service_name: "",
      service_quote: 0,
      service_user_price: 0,
      service_gst_price: 0,
      service_code: "",
      service_quote_id: "",
      service_estimated_delivery_datetime: "",
    },
    {
      id: 2,
      service_type: _.startCase(OVERNIGHTEXPRESS),
      service_name: "",
      service_quote: 0,
      service_user_price: 0,
      service_gst_price: 0,
      service_code: "",
      service_quote_id: "",
      service_estimated_delivery_datetime: "",
    },
    {
      id: 3,
      service_type: _.startCase(AIREXPRESS),
      service_name: "",
      service_quote: 0,
      service_user_price: 0,
      service_gst_price: 0,
      service_code: "",
      service_quote_id: "",
      service_estimated_delivery_datetime: "",
    },
    {
      id: 4,
      service_type: "ASAP Hot Shot",
      service_name: "",
      service_quote: 0,
      service_user_price: 0,
      service_gst_price: 0,
      service_code: "",
      service_quote_id: "",
      service_estimated_delivery_datetime: "",
    },
    {
      id: 5,
      service_type: _.startCase(TECHNOLOGYEXPRESS),
      service_name: "",
      service_quote: 0,
      service_user_price: 0,
      service_gst_price: 0,
      service_code: "",
      service_quote_id: "",
      service_estimated_delivery_datetime: "",
    },
  ]);

  const router = useRouter();
  const { freight_id } = useParams();

  // Handle form submission and prevent default behavior
  const handleParcelFreightDetailSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitLoading(true);

    if (!selectServiceQuoteId) {
      setErrorMessage("Please select a Delivery Service before continuing.");
      setIsSubmitLoading(false);
      return;
    }

    setErrorMessage("");
    dispatch(
      submitPackageWithQuote({ freight_id, selectServiceQuoteId, userId })
    );
  };

  useEffect(() => {
    if (status === "succeeded") {
      onSubmitParcelFreightDetail("submit parcel");
    }

    if (status === "failed") {
      setErrorMessage("Failed to submit parcel freight detail");
    }
    setIsSubmitLoading(false);
  }, [status, onSubmitParcelFreightDetail]);

  const handleGoBack = () => {
    router.push(`/parcel-freight/`);
  };

  const handleChange = (value) => {
    setSelected(true);
    if (pf_user) {
      setUserId(pf_user.id);
    }

    setSelectServiceQuoteId(value);
  };

  useEffect(() => {
    if (pf_user) {
      setUserId(pf_user.id);
    }
  }, [pf_user, userId]);

  useEffect(() => {
    setSelectedPickupOption(data.pickup_building_type);
    setSelectedDeliveryOption(data.delivery_building_type);
    setPickupSuburb(data.pickup_suburb);
    setDeliverySuburb(data.delivery_suburb);
    setFreightCreatedAt(data.freight_created_at || data.created_at);
    setUserName(data?.name || "");
    setPfPackage(data.freight_package);

    setTotalQty(data.totalQty);
    setTotalKgs(data.totalKgs);
    setTotalVolume(data.totalVolume);

    setPricingRows([
      getPricingRow(1, _.startCase(ROADEXPRESS), data.road_express),
      getPricingRow(2, _.startCase(OVERNIGHTEXPRESS), data.overnight_express),
      getPricingRow(3, _.startCase(AIREXPRESS), data.air_express),
      getPricingRow(4, _.startCase(ASAPHOTSHOT), data.asap_hot_shot),
      getPricingRow(5, _.startCase(TECHNOLOGYEXPRESS), data.technology_express),
    ]);

    setSelected(parcel_freight_data?.freight_service_quote_id);
    setSelectServiceQuoteId(parcel_freight_data.freight_service_quote_id);

    setHasPaid(data.freight_payment?.[0]?.id ? true : false);
  }, [data]); // Run effect when data changes

  useEffect(() => {}, [pfPackage, pricingRows, selectServiceQuoteId]);

  const [selectedPickupOption, setSelectedPickupOption] = useState(""); // Initialize with default selected option
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(""); // Initialize with default selected option

  let pickupResidentialCSS =
    selectedPickupOption === "Residential"
      ? "btn btn-primary"
      : "btn btn-light";

  let pickupCommercialCSS =
    selectedPickupOption === "Commercial" ? "btn btn-primary" : "btn btn-light";

  let deliveryResidentialCSS =
    selectedDeliveryOption === "Residential"
      ? "btn btn-primary"
      : "btn btn-light";

  let deliveryCommercialCSS =
    selectedDeliveryOption === "Commercial"
      ? "btn btn-primary"
      : "btn btn-light";

  return (
    <Fragment>
      <form
        onSubmit={handleParcelFreightDetailSubmit}
        id="page-two"
        className="bg-[rgb(247,243,235)] rounded-xl mt-0 max-w-[1300px] mx-auto p-8"
      >
        <div className="snf5-pfs-order-details">
          {pf_user?.role !== "Admin" ? (
            <div className="mt-[-10px] mb-[10px]" />
          ) : (
            ""
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="pfs-input-form-group">
                <label className="pfs-input-label">
                  Pickup Suburb
                </label>
                <div className="pfs-input flex items-center">
                  {pickupSuburb}
                </div>
              </div>
            </div>
            <div className="pfs-button-group mb-[10px] mt-[-2px]">
              <label className="pfs-input-label">Pickup Building Type</label>
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${
                    pickupResidentialCSS.includes("btn-primary")
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                  disabled
                >
                  Residential
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium border-t border-b border-r rounded-r-lg ${
                    pickupCommercialCSS.includes("btn-primary")
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                  disabled
                >
                  Commercial
                </button>
              </div>
            </div>
            <div>
              <div className="pfs-input-form-group">
                <label className="pfs-input-label">Delivery suburb</label>
                <div className="pfs-input flex items-center">
                  {deliverySuburb}
                </div>
              </div>
            </div>
            <div className="pfs-button-group mb-[10px] mt-[-2px]">
              <label className="pfs-input-label">Dropoff Building Type</label>
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${
                    deliveryResidentialCSS.includes("btn-primary")
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                  disabled
                >
                  Residential
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium border-t border-b border-r rounded-r-lg ${
                    deliveryCommercialCSS.includes("btn-primary")
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                  disabled
                >
                  Commercial
                </button>
              </div>
            </div>
          </div>

          {!isEmpty(pfPackage) && (
            <div className="mt-[10px]">
              <div className="mb-4 rounded-lg p-4" style={{ backgroundColor: "rgb(249 249 249)" }}>
                {pfPackage.map((row_of_data, index) => (
                  <Fragment key={row_of_data.id}>
                    <Parcel_Freight_Package
                      index={index}
                      rowData={row_of_data}
                      isDisable={true}
                    />
                  </Fragment>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-[10px]">
            <div>
              <div className="pfs-input-form-group">
                <label className="pfs-input-label">Total Quantity</label>
                <input
                  name=""
                  type="number"
                  title="Price must be in a valid monetary format"
                  className="pfs-input"
                  value={totalQty || 0}
                  disabled
                />
              </div>
            </div>
            <div>
              <div className="pfs-input-form-group">
                <label className="pfs-input-label">Total weight (kgs)</label>
                <input
                  name=""
                  type="number"
                  title="Price must be in a valid monetary format"
                  className="pfs-input"
                  value={totalKgs || 0}
                  disabled
                />
              </div>
            </div>
            <div>
              <div className="pfs-input-form-group">
                <label className="pfs-input-label">
                  Total volume (cm<sup>3</sup>)
                </label>
                <input
                  name=""
                  type="number"
                  title="Price must be in a valid monetary format"
                  className="pfs-input"
                  value={totalVolume || ""}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="mt-[5px]">
            <label
              className="pfs-input-label text-[19px] ml-5 mb-5 block"
            >
              Delivery Service
            </label>
            <div className="mb-[10px]">
              <div className="grid grid-cols-1">
                <div className="grid grid-cols-12 gap-2 mt-0">
                  <div className="col-span-3">
                    <strong>Service</strong>
                  </div>
                  <div className="col-span-3">Estimated Delivery Date</div>
                  <div className="col-span-5">Price exclude GST AUD$</div>
                </div>
                <hr className="col-span-12 my-2" />
              </div>
              {pricingRows.map(
                (row_of_data, index) =>
                  row_of_data.service_quote_id !== "" && (
                    <Fragment key={row_of_data.id}>
                      <ParcelFreightPricingRow
                        index={index}
                        rowData={row_of_data}
                        isDisable={true}
                        onChange={handleChange}
                        flashRed={flashRed}
                        selectServiceQuoteId={selectServiceQuoteId}
                        hasPaid={hasPaid}
                      />
                    </Fragment>
                  )
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-4">
            <div>
              {errorMessage && (
                <div className="pfs-error-message-inline">{errorMessage}</div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-6 py-2.5 text-white font-medium rounded-lg transition-all goback-button"
                style={{ 
                  background: 'linear-gradient(to right, #6B7280, #4B5563)',
                  border: 'none'
                }}
                onClick={handleGoBack}
              >
                Back
              </button>

              <button
                type="submit"
                form="page-two"
                disabled={!pf_user?.id}
                className="px-6 py-2.5 text-white font-medium rounded-lg transition-all submit-button disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  background: pf_user?.id 
                    ? 'linear-gradient(to right, #FF7D44, #ff9066)' 
                    : 'linear-gradient(to right, #9CA3AF, #6B7280)',
                  border: 'none'
                }}
              >
                {isSubmitLoading ? (
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                ) : (
                  "Next"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export default Parcel_Freight_Detail;



