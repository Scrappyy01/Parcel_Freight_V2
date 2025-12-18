'use client';

import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useParams } from "next/navigation";

import InfoModal from "@/components/InfoModal/InfoModal/InfoModal";

import { useDispatch, useSelector } from "react-redux";
import { updateConfirmation } from "../../redux/services/confirmationSlice";

import PFConsignmentSummary from "../payments/PF_Consignment_Summary";
import { isEcommerce, isTrade } from "@/utils/helpers";

function PF_SingleListing_Confirm_Info({
  onSubmitParcelFreightConfirmation,
  onBack,
}) {
  const [warrantyText, setWarrantyText] = useState("");
  const [termsText, setTermsText] = useState("");
  const [consignmentText, setConsignmentText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { pf_user, setPF_User } = useContext(UserContext);
  const [tradeUser, setTradeUser] = useState(
    isTrade(pf_user) || isEcommerce(pf_user)
  );

  const fetchWarrantyText = () => {
    fetch("/terms/warranty.txt")
      .then((res) => res.text())
      .then(setWarrantyText);
  };

  const fetchTermsText = () => {
    fetch("/terms/terms_conditions.txt")
      .then((res) => res.text())
      .then(setTermsText);
  };

  const fetchConsignmentText = () => {
    fetch("/terms/consignment_note.txt")
      .then((res) => res.text())
      .then(setConsignmentText);
  };

  const dispatch = useDispatch();
  const { data: collectionData } = useSelector((state) => state.collection);
  const { data: parcelFreightData } = useSelector(
    (state) => state.parcelFreight
  );
  const { data: addressData } = useSelector((state) => state.address);
  const { data, status, error } = useSelector((state) => state.confirmation);
  const { data: paymentData } = useSelector((state) => state.payment);

  const [quoteDetail, setQuoteDetail] = useState({
    service_name: parcelFreightData?.service_name || "",
    service_type: parcelFreightData?.service_type || "",
    service_code: parcelFreightData?.service_code || "",
    service_quote: parcelFreightData?.service_quote || 0,
    service_user_price: parcelFreightData?.service_user_price || 0,
    service_gst_price: parcelFreightData?.service_gst_price || 0,
  });
  const [formData, setFormData] = useState({
    confirmed_warranty: collectionData?.confirmed_warranty,
    confirmed_terms_conditions: collectionData?.confirmed_terms_conditions,
    confirmed_understand: collectionData?.confirmed_understand,
  });

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "Please agree with the Warranty"
  );

  const [showWarrantyModal, setShowWarrantyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  const params = useParams();
  const freight_id = params?.id; // Get 'id' from route params since the route is [id]

  useEffect(() => {
    setQuoteDetail({
      service_name:
        parcelFreightData?.service_name || collectionData?.service_name || "",
      service_type:
        parcelFreightData?.service_type || collectionData?.service_type || "",
      service_code:
        parcelFreightData?.service_code || collectionData?.service_code || "",
      service_quote:
        parcelFreightData?.service_quote || collectionData?.service_quote || 0,
      service_user_price:
        parcelFreightData?.service_user_price ||
        collectionData?.service_user_price ||
        0,
      service_gst_price:
        parcelFreightData?.service_gst_price ||
        collectionData?.service_gst_price ||
        0,
    });
  }, [parcelFreightData]);

  const handleGoBack = () => {
    onBack();
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  // Handle form submission and prevent default behavior
  const handleSubmit = async (event) => {
    console.log("submitted...");
    event.preventDefault();

    if (Object.values(formData).some((value) => !value)) {
      setShowError(true);
      return;
    }

    setIsLoading(true);
    const submitData = { ...formData, ...parcelFreightData };
    dispatch(updateConfirmation({ freight_id, submitData }));
    setShowError(false);
  };

  useEffect(() => {
    if (status === "succeeded") {
      setIsLoading(false);
      onSubmitParcelFreightConfirmation();
    }

    if (status === "failed") {
      setIsLoading(false);
      setShowError(true);
      if (process.env.NODE_ENV === "development") {
        setErrorMessage(error);
      } else {
        setErrorMessage(error);
      }
    }
  }, [status, onSubmitParcelFreightConfirmation]);

  return (
    <div className="text-sm">
      <div className="my-6 space-y-6">
        <PFConsignmentSummary
          collectionData={collectionData}
          addressData={addressData}
          parcelFreightData={parcelFreightData}
        />

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-800">Additional Information</h4>
          </div>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#FF7D44] mt-2"></div>
              <span className="leading-relaxed">
                All goods must be packed into a carton or on a
                pallet/skid/crate. Items must be packaged at or above
                Manufacturer's packaging specifications, so other freight can be
                stacked safely on and around your consignment.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#FF7D44] mt-2"></div>
              <span className="leading-relaxed">
                If using a pallet or a skid, the goods must still be packed into
                a carton or a crate, then strapped + wrapped onto the
                skid/pallet. The freight must not overhang the pallet.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#FF7D44] mt-2"></div>
              <span className="leading-relaxed">
                Correct declaration of weight and dimensions - Can you please
                ensure that you indicate the correct weight and dimensions of
                your carton. If it is under-weighted, or over your specified
                external dimensions, your delivery may be put on hold and extra
                charges will apply. This is a legal requirement under the Chain
                Of Responsibility laws.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#FF7D44] mt-2"></div>
              <span className="leading-relaxed">
                The Consignment Note supplied via email after booking MUST be
                attached to the item(s) before pickup. Failure to have the
                consignment note attached will result in a Futile Pickup
                Charge.
              </span>
            </li>
          </ul>
        </div>
        {showWarrantyModal && (
          <InfoModal
            title="LoadLink Transit Warranty"
            content={warrantyText}
            onClose={() => setShowWarrantyModal(false)}
          />
        )}

        {showTermsModal && (
          <InfoModal
            title="Terms & Conditions"
            content={termsText}
            onClose={() => setShowTermsModal(false)}
          />
        )}

        {showNoteModal && (
          <InfoModal
            title="Consignment Note Instructions"
            content={consignmentText}
            onClose={() => setShowNoteModal(false)}
          />
        )}
        <form
          onSubmit={handleSubmit}
          id="page-four-confirm"
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-600">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-800">Confirmation & Agreement</h4>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="confirmed_warranty"
                  name="confirmed_warranty"
                  checked={
                    formData?.confirmed_warranty === "1" ||
                    formData?.confirmed_warranty === 1 ||
                    formData?.confirmed_warranty === "true" ||
                    formData?.confirmed_warranty === true
                  }
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 accent-[#FF7D44] bg-white border-gray-300 rounded focus:ring-[#FF7D44] focus:ring-2 cursor-pointer"
                />
                <label htmlFor="confirmed_warranty" className="cursor-pointer text-gray-700 leading-relaxed">
                  <span>
                    YES - I have read, understood & agree to the{" "}
                    <button
                      type="button"
                      className="text-[#FF7D44] hover:underline font-medium p-0 bg-transparent border-0 cursor-pointer"
                      onClick={() => {
                        fetchWarrantyText();
                        setShowWarrantyModal(true);
                      }}
                    >
                      LoadLink Transit Warranty conditions
                    </button>{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="confirmed_terms_conditions"
                  name="confirmed_terms_conditions"
                  checked={
                    formData?.confirmed_terms_conditions === "1" ||
                    formData?.confirmed_terms_conditions === 1 ||
                    formData?.confirmed_terms_conditions === "true" ||
                    formData?.confirmed_terms_conditions === true
                  }
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 accent-[#FF7D44] bg-white border-gray-300 rounded focus:ring-[#FF7D44] focus:ring-2 cursor-pointer"
                />
                <label htmlFor="confirmed_terms_conditions" className="cursor-pointer text-gray-700 leading-relaxed">
                  <span>
                    YES - I have read, understood & agree to the{" "}
                    <button
                      type="button"
                      className="text-[#FF7D44] hover:underline font-medium p-0 bg-transparent border-0 cursor-pointer"
                      onClick={() => {
                        fetchTermsText();
                        setShowTermsModal(true);
                      }}
                    >
                      Terms & Conditions
                    </button>{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="confirmed_understand"
                  name="confirmed_understand"
                  checked={
                    formData?.confirmed_understand === "1" ||
                    formData?.confirmed_understand === 1 ||
                    formData?.confirmed_understand === "true" ||
                    formData?.confirmed_understand === true
                  }
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 accent-[#FF7D44] bg-white border-gray-300 rounded focus:ring-[#FF7D44] focus:ring-2 cursor-pointer"
                />
                <label htmlFor="confirmed_understand" className="cursor-pointer text-gray-700 leading-relaxed">
                  <span>
                    YES - I understand that the{" "}
                    <button
                      type="button"
                      className="text-[#FF7D44] hover:underline font-medium p-0 bg-transparent border-0 cursor-pointer"
                      onClick={() => {
                        fetchConsignmentText();
                        setShowNoteModal(true);
                      }}
                    >
                      Consignment Note
                    </button>{" "}
                    supplied via email after booking, must be attached to the
                    item/s as instructed before pickup <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>
            </div>
          </div>
          {showError && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 text-sm font-medium">
                {errorMessage}
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4 mt-6">
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-8 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm cursor-pointer"
              onClick={handleGoBack}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <button
              type="submit"
              form="page-four-confirm"
              disabled={
                ((paymentData &&
                  paymentData[0] &&
                  paymentData[0]?.status === "paid") ||
                tradeUser
                  ? false
                  : true) || isLoading
              }
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#FF7D44] to-[#FF6B35] text-white font-medium rounded-lg hover:from-[#FF6B35] hover:to-[#FF5A24] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#FF7D44] disabled:hover:to-[#FF6B35] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  Processing...
                </>
              ) : (
                <>
                  Confirm Booking
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PF_SingleListing_Confirm_Info;



