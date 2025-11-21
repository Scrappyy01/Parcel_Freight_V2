'use client';

import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useParams } from "next/navigation";

import InfoModal from "@/components/InfoModal/InfoModal/InfoModal";

import { useDispatch, useSelector } from "react-redux";
import { updateConfirmation } from "../../redux/services/confirmationSlice";

import PF_Consignment_Summary from "../payments/PF_Consignment_Summary";

function PF_SingleListing_Confirm_Info({
  onSubmitParcelFreightConfirmation,
  onBack,
}) {
  const [warrantyText, setWarrantyText] = useState("");
  const [termsText, setTermsText] = useState("");
  const [consignmentText, setConsignmentText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const { pf_user, setPf_User } = useContext(UserContext);
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
    service_gst_price: parcelFreightData?.service.gst_price || 0,
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

  const { freight_id } = useParams();

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
        setErrorMessage("failed to confirm the warranties.");
      }
    }
  }, [status, onSubmitParcelFreightConfirmation]);

  return (
    <div style={{ fontSize: "14px" }}>
      <div className="my-6">
        <PF_Consignment_Summary
          collectionData={collectionData}
          addressData={addressData}
          parcelFreightData={parcelFreightData}
        />

        <div style={{ marginBottom: "50px" }}>
          <h4>Additional Information</h4>
          <ul className="pfs-mesNote " style={{ textAlign: "left" }}>
            <li>
              <span className="mesNote">
                All goods must be packed into a carton or on a
                pallet/skid/crate. Items must be packaged at or above
                Manufactureers packaging specifications, so other freight can be
                stacked safely on and around your consignment.
              </span>
            </li>
            <li>
              <span className="mesNote">
                If using a pallet or a skid, the goods must still be packed into
                a carton or a crate, then strapped + wrapped onto the
                skid/pallet. The freight must not overhang the pallet.
              </span>
            </li>
            <li>
              <span className="mesNote">
                Correct declaration of weight and dimensions - Can you please
                ensure that you indicate the correct weight and dimensions of
                your carton. If it is under-weighted, or over your specified
                external dimensions, your delivery may be put on hold and extra
                charges will apply. This is a legal requirement under the Chain
                Of Responsibility laws.
              </span>
            </li>
            <li>
              <span className="mesNote">
                The Consignment Note supplied via email after booking MUST be
                attached to the item(s) before pickup. Failure to have the
                consignment note attached will result in a Futiile Pickup
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
          className="XXcontainer bg-[rgb(247,243,235)] rounded-xl max-w-[1300px] mx-auto p-4"
        >
          <div className="grid grid-cols-1">
            <div className="lg:col-span-12 md:col-span-12 sm:col-span-12">
              <h4>LoadLink Transit Warranty</h4>
              <div className="pfs-input-form-group mb-3">
                <div className="flex items-start">
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
                    className="mt-1 mr-2"
                  />
                  <label htmlFor="confirmed_warranty" className="cursor-pointer">
                    <span>
                      YES - I have read, understood & agree to the{" "}
                      <button
                        type="button"
                        className="text-blue-600 hover:underline p-0 bg-transparent border-0"
                        onClick={() => {
                          fetchWarrantyText();
                          setShowWarrantyModal(true);
                        }}
                      >
                        LoadLink Transit Warranty conditions
                      </button>{" "}
                      *
                    </span>
                  </label>
                </div>
              </div>

              <div className="pfs-input-form-group mb-3">
                <div className="flex items-start">
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
                    className="mt-1 mr-2"
                  />
                  <label htmlFor="confirmed_terms_conditions" className="cursor-pointer">
                    <span>
                      YES - I have read, understood & agree to the{" "}
                      <button
                        type="button"
                        className="text-blue-600 hover:underline p-0 bg-transparent border-0"
                        onClick={() => {
                          fetchTermsText();
                          setShowTermsModal(true);
                        }}
                      >
                        Terms & Conditions
                      </button>{" "}
                      *
                    </span>
                  </label>
                </div>
              </div>

              <div className="pfs-input-form-group mb-3">
                <div className="flex items-start">
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
                    className="mt-1 mr-2"
                  />
                  <label htmlFor="confirmed_understand" className="cursor-pointer">
                    <span>
                      YES - I understand that the{" "}
                      <button
                        type="button"
                        className="text-blue-600 hover:underline p-0 bg-transparent border-0"
                        onClick={() => {
                          fetchConsignmentText();
                          setShowNoteModal(true);
                        }}
                      >
                        Consignment Note
                      </button>{" "}
                      supplied via email after booking, must be attached to the
                      item/s as instructed before pickup *
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          {showError && (
            <p className="text-red-600 text-center font-light">
              {errorMessage}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-primary wgl-button wgl-button-save mt-2 w-1/2 goback-button"
              onClick={handleGoBack}
            >
              Back
            </button>

            <button
              type="submit"
              form="page-four-confirm"
              disabled={
                (paymentData &&
                paymentData[0] &&
                paymentData[0]?.status === "paid"
                  ? false
                  : true) || isLoading
              }
              className="btn btn-primary wgl-button wgl-button-save mt-2 w-1/2 submit-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2"></div>
                  Processing...
                </>
              ) : (
                "Confirm Book"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PF_SingleListing_Confirm_Info;



