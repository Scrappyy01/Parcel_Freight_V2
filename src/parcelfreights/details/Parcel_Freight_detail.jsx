'use client';

import { useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import _ from "lodash";

import { submitPackageWithQuote } from "../../redux/services/parcelFreightSlice";
import ParcelFreightPricingRow from "./Parcel_Freight_Pricing_Row";

import { UserContext } from "../../contexts/UserContext";
import { getPricingRow } from "@/utils/helpers";
import {
  ROADEXPRESS,
  OVERNIGHTEXPRESS,
  AIREXPRESS,
  ASAPHOTSHOT,
  TECHNOLOGYEXPRESS,
} from "@/utils/constant";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

const Parcel_Freight_Detail = ({ onSubmitParcelFreightDetail }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const freight_id = params?.id;

  const { data } = useSelector((state) => state.collection);
  const { data: parcel_freight_data, status } = useSelector((state) => state.parcelFreight);
  const { pf_user } = useContext(UserContext);

  const [pricingRows, setPricingRows] = useState([]);
  const [selectServiceQuoteId, setSelectServiceQuoteId] = useState("");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    if (data) {
      setPricingRows([
        getPricingRow(1, _.startCase(ROADEXPRESS), data.road_express),
        getPricingRow(2, _.startCase(OVERNIGHTEXPRESS), data.overnight_express),
        getPricingRow(3, _.startCase(AIREXPRESS), data.air_express),
        getPricingRow(4, "ASAP Hot Shot", data.asap_hot_shot),
        getPricingRow(5, _.startCase(TECHNOLOGYEXPRESS), data.technology_express),
      ]);
      setSelectServiceQuoteId(parcel_freight_data?.freight_service_quote_id || "");
      setHasPaid(Boolean(data.freight_payment?.[0]?.id));
    }
  }, [data, parcel_freight_data]);

  useEffect(() => {
    if (status === "succeeded") {
      onSubmitParcelFreightDetail("submit parcel");
    } else if (status === "failed") {
      setErrorMessage("Failed to submit parcel freight detail");
    }
    setIsSubmitLoading(false);
  }, [status, onSubmitParcelFreightDetail]);

  const handleChange = (value) => {
    setSelectServiceQuoteId(value);
    setErrorMessage("");
  };

  const handleGoBack = () => {
    router.push("/parcel-freight/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    if (!selectServiceQuoteId) {
      setErrorMessage("Please select a Delivery Service before continuing.");
      setIsSubmitLoading(false);
      return;
    }
    dispatch(submitPackageWithQuote({ freight_id, selectServiceQuoteId, userId: pf_user?.id }));
  };

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#193D5A] mb-3">
            Select Delivery Service
          </h1>
          <p className="text-gray-600 text-base">Choose the service that best fits your needs</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <form onSubmit={handleSubmit} className="p-5 md:p-6">
            
            {/* Delivery Service Selection */}
            <div className="space-y-4 mb-6">
              {pricingRows.map(
                (row_of_data, index) =>
                  row_of_data.service_quote_id && (
                    <ParcelFreightPricingRow
                      key={row_of_data.id}
                      index={index}
                      rowData={row_of_data}
                      isDisable={hasPaid}
                      onChange={handleChange}
                      selectServiceQuoteId={selectServiceQuoteId}
                      hasPaid={hasPaid}
                    />
                  )
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                <div className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-bold text-red-800 text-sm mb-1">Error</p>
                    <p className="text-xs text-red-700">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleGoBack}
                className="flex-1 py-3 px-6 bg-white border-2 border-gray-300 text-gray-700 font-semibold text-base rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
              
              <button
                type="submit"
                disabled={!pf_user?.id || isSubmitLoading || hasPaid}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-[#FF7D44] to-[#ff9066] text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] flex items-center justify-center gap-2 group"
              >
                {isSubmitLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Continue to Checkout
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Parcel_Freight_Detail;