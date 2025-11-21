'use client';

import React, { Fragment, useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import { submitPayment } from "../../redux/services/paymentSlice";

import { Typography, Input, Button, Spinner } from "@/components/ui/ui";
import "react-datepicker/dist/react-datepicker.css";
import { isEmpty } from "lodash";
import { validateEmail } from "@/utils/helpers";
import { DIGIT_MONTHS, DIGIT_YEARS } from "@/utils/constant";
import PFConsignmentSummary from "../payments/PF_Consignment_Summary";
import { Helmet } from "react-helmet";

const Payment = ({ onSubmitPayment, onBack, onNext }) => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.payment);
  const { data: parcelFreightData } = useSelector(
    (state) => state.parcelFreight
  );

  const [formData, setFormData] = useState({
    cardHolderName: "",
    cardNumber: "",
    cvv: "",
    expiryMonth: "",
    expiryYear: "",
    paymentAmount: 0,
    email: "",
    tc: false,
    printlabel: false,
    service_id: parcelFreightData.freight_service_quote_id,
  });

  const [cardHolderName, setCardHolderName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [email, setEmail] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const { data: collectionData } = useSelector((state) => state.collection);
  const { data: addressData } = useSelector((state) => state.address);
  const [errorMessage, setErrorMessage] = useState("");

  const [hasError, setHasError] = useState(false);
  const { freight_id } = useParams();
  const [isPayLoading, setIsPayLoading] = useState(false);

  useEffect(() => {
    if (!isEmpty(data)) {
      const {
        card_holder_name,
        expiry_month,
        expiry_year,
        total,
        email,
        status,
      } = data[0];
      setCardHolderName(card_holder_name);
      setExpiryMonth(expiry_month);
      setExpiryYear(expiry_year);
      setPaymentAmount((total / 100).toFixed(2));
      setEmail(email);
      setPaymentStatus(status);
    }
  }, [data]);

  useEffect(() => {
    console.log("parcelFreightData.service_gst_price", parcelFreightData);
    setFormData({
      ...formData,
      paymentAmount: (
        (Number(parcelFreightData.service_user_price) || 0) +
        (Number(parcelFreightData.service_gst_price) || 0)
      ).toFixed(2),
      service_id: parcelFreightData.freight_service_quote_id,
    });
    setErrorMessage("");
    setHasError(false);
  }, [parcelFreightData]);

  const handleSubmitPayment = async (event) => {
    event.preventDefault();
    if (paymentStatus === "paid") {
      console.log("payment go next");
      return;
    }
    console.log("submitting payment");
    if (
      !formData.cardHolderName ||
      !formData.cardNumber ||
      !formData.cvv ||
      !formData.expiryMonth ||
      !formData.expiryYear ||
      !formData.email ||
      !formData.tc ||
      !formData.printlabel ||
      (formData.email && !validateEmail(formData.email))
    ) {
      setHasError(true);
      setErrorMessage(
        "Please ensure all required fields are filled in correctly."
      );
      return;
    }
    setErrorMessage(""); // Clear previous errors if any
    setIsPayLoading(true);
    // Payment API
    const resultAction = await dispatch(
      submitPayment({ freight_id, formData })
    );

    if (resultAction.payload && resultAction.payload?.status === "succeeded") {
      setIsPayLoading(false);
    }
  };

  useEffect(() => {
    if (status === "succeeded") {
      setErrorMessage("");
      setHasError(false);
      setIsPayLoading(false);
      console.log("paid successded");
      onSubmitPayment();
    } else if (status === "failed" || error) {
      setHasError(true);
      setErrorMessage(
        "We were unable to process your payment. Please try again or check your card details."
      );
      setIsPayLoading(false);
      console.error("Payment failed:", error);
    }
  }, [status, onSubmitPayment, error]);

  const handleGoBack = () => {
    setErrorMessage("");
    setHasError(false);
    onBack();
  };

  const handleGoNext = () => {
    onNext();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const actualValue = type === "checkbox" ? checked : value;

    setFormData((prev) => {
      const update = { ...prev, [name]: actualValue };

      if (name === "cardNumber") {
        update.cardNumber_encrypt =
          window.eCrypt.encryptValue(
            value,
            process.env.REACT_APP_EWAY_ENCRYPTION_KEY
          ) || "";
        if (value.length > 19) {
          setHasError(true);
        }
      }

      if (name === "cvv") {
        update.cvv_encrypt =
          window.eCrypt.encryptValue(
            value,
            process.env.REACT_APP_EWAY_ENCRYPTION_KEY
          ) || "";
        if (value.length > 3) {
          setHasError(true);
        }
      }

      return update;
    });
  };

  const handleChangeDate = (date, event) => {
    if (date.target.name === "expiry_month") {
      setFormData((prev) => ({
        ...prev,
        expiryMonth: date.target.value,
      }));
    }
    if (date.target.name === "expiry_year") {
      setFormData((prev) => ({
        ...prev,
        expiryYear: date.target.value,
      }));
    }
  };

  return (
    <div className="font-size-14">
      <Helmet>
        <script src="https://secure.ewaypayments.com/scripts/eCrypt.min.js"></script>
      </Helmet>
      <h2 className="mb-4">
        Payment {paymentStatus === "paid" && <span> - {paymentStatus}</span>}
      </h2>
      <PFConsignmentSummary
        collectionData={collectionData}
        addressData={addressData}
        parcelFreightData={parcelFreightData}
      />
      <hr style={{ color: "#b9b9b9" }} />
      <form
        onSubmit={handleSubmitPayment}
        id="paymentForm"
        className="XXcontainer form-background"
      >
        {errorMessage && paymentStatus !== "paid" && (
          <div className="alert custom-error-message" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="pfs-input-form-group">
              <label className="pfs-input-label">
                Card Holder Name {paymentStatus !== "paid" && "*"}
              </label>
              {paymentStatus === "paid" ? (
                <div>{cardHolderName}</div>
              ) : (
                <input
                  name="cardHolderName"
                  style={{ alignContent: "center" }}
                  className="pfs-input"
                  value={formData.cardHolderName || ""}
                  onChange={handleChange}
                />
              )}
              {paymentStatus !== "paid" &&
                hasError &&
                !formData.cardHolderName && (
                  <Typography
                    variant="caption"
                    color="error"
                    fontWeight="light"
                  >
                    Please enter your card holder name
                  </Typography>
                )}
            </div>
            {paymentStatus !== "paid" && (
              <div
                className="pfs-input-form-group"
                controlId="cardNumber"
              >
                <label className="pfs-input-label">
                  Card Number {paymentStatus !== "paid" && "*"}
                </label>

                <input
                  name="cardNumber"
                  className="pfs-input"
                  value={formData.cardNumber || ""}
                  onChange={handleChange}
                />
                {hasError && !formData.cardNumber && (
                  <Typography
                    variant="caption"
                    color="error"
                    fontWeight="light"
                  >
                    Please enter your card number
                  </Typography>
                )}
                {hasError && formData.cardNumber.length > 19 && (
                  <Typography
                    variant="caption"
                    color="error"
                    fontWeight="light"
                  >
                    Please check the card number length
                  </Typography>
                )}
              </div>
            )}
          </div>
          <div>
            {paymentStatus !== "paid" && (
              <div className="pfs-input-form-group" controlId="cvv">
                <label className="pfs-input-label">
                  CVV {paymentStatus !== "paid" && "*"}
                </label>
                <input
                  name="cvv"
                  className="pfs-input"
                  value={formData.cvv || ""}
                  onChange={handleChange}
                />
                {hasError && !formData.cvv && (
                  <Typography
                    variant="caption"
                    color="error"
                    fontWeight="light"
                  >
                    Please enter your CVV
                  </Typography>
                )}
                {hasError && formData.cvv.length > 3 && (
                  <Typography
                    variant="caption"
                    color="error"
                    fontWeight="light"
                  >
                    Please check your CVV length
                  </Typography>
                )}
              </div>
            )}
            <div
              className="pfs-input-form-group"
              controlId="expiryMonth"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="pfs-input-label">
                    Expiry Month {paymentStatus !== "paid" && "*"}
                  </label>
                  {paymentStatus === "paid" ? (
                    <div>{expiryMonth}</div>
                  ) : (
                    <select
                      style={{ alignContent: "center" }}
                      className="pfs-input"
                      name="expiry_month"
                      onChange={handleChangeDate}
                      value={formData.expiryMonth}
                    >
                      <option value="">Select Month</option>
                      {Object.entries(DIGIT_MONTHS).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="pfs-input-label">
                    Expiry Year {paymentStatus !== "paid" && "*"}
                  </label>
                  {paymentStatus === "paid" ? (
                    <div>{expiryYear}</div>
                  ) : (
                    <select
                      style={{ alignContent: "center" }}
                      className="pfs-input"
                      name="expiry_year"
                      onChange={handleChangeDate}
                      value={formData.expiryYear}
                    >
                      <option value="">Select Year</option>
                      {DIGIT_YEARS.map((value, index) => (
                        <option key={index} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              {paymentStatus !== "paid" &&
                hasError &&
                (!formData.expiryYear || !formData.expiryYear) && (
                  <Typography
                    variant="caption"
                    color="error"
                    fontWeight="light"
                  >
                    Please select expiry year and month
                  </Typography>
                )}
            </div>
          </div>
          <div>
            <div
              className="pfs-input-form-group"
              controlId="paymentAmount"
            >
              <label className="pfs-input-label">
                Payment Amount inc GST AUD$ {paymentStatus !== "paid" && "*"}
              </label>
              {paymentStatus === "paid" ? (
                <div>${paymentAmount}</div>
              ) : (
                <input
                  name="paymentsAmountsDisabled"
                  className="pfs-input"
                  value={formData.paymentAmount || ""}
                  onChange={handleChange}
                  disabled={true}
                />
              )}
              {paymentStatus !== "paid" &&
                hasError &&
                !formData.paymentAmount && (
                  <Typography
                    variant="caption"
                    color="error"
                    fontWeight="light"
                  >
                    Please enter your payment amount
                  </Typography>
                )}
            </div>
          </div>
          <div>
            <div className="pfs-input-form-group" controlId="email">
              <label className="pfs-input-label">
                Email {paymentStatus !== "paid" && "*"}
              </label>
              {paymentStatus === "paid" ? (
                <div>{email}</div>
              ) : (
                <input
                  name="email"
                  className="pfs-input"
                  value={formData.email || ""}
                  onChange={handleChange}
                />
              )}
              {paymentStatus !== "paid" &&
                hasError &&
                (!formData.email || !validateEmail(formData.email)) && (
                  <Typography
                    variant="caption"
                    color="error"
                    fontWeight="light"
                  >
                    Please enter a valid email address
                  </Typography>
                )}
            </div>
          </div>
          {paymentStatus !== "paid" && (
            <Fragment>
              <div>
                <div className="pfs-input-form-group" controlId="tc">
                  <input
                    name="tc"
                    type="checkbox"
                    label="I agree to the terms and conditions *"
                    checked={formData.tc}
                    onChange={handleChange}
                  />
                  {hasError && !formData.tc && (
                    <Typography
                      variant="caption"
                      color="error"
                      fontWeight="light"
                    >
                      Please agree to the terms and conditions
                    </Typography>
                  )}
                </div>
              </div>
              <div>
                <div
                  className="pfs-input-form-group"
                  controlId="printlabel"
                >
                  <input
                    name="printlabel"
                    type="checkbox"
                    label="I confirm I have a printer to print the Shipping Label *"
                    checked={formData.printlabel}
                    onChange={handleChange}
                  />
                  {hasError && !formData.printlabel && (
                    <Typography
                      variant="caption"
                      color="error"
                      fontWeight="light"
                    >
                      I confirm I have a printer to print the Shipping Label
                    </Typography>
                  )}
                </div>
              </div>
            </Fragment>
          )}
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="contained"
            color="primary"
            className="w-1/2"
            onClick={handleGoBack}
          >
            Back
          </Button>

          {paymentStatus !== "paid" || paymentStatus === "booked" ? (
            <Button
              type="submit"
              form="paymentForm"
              variant="contained"
              color="info"
              className="w-1/2"
              disabled={isPayLoading}
            >
              {isPayLoading ? (
                <span className="flex items-center gap-2">
                  <Spinner size="small" color="white" />
                  Processing...
                </span>
              ) : (
                "Pay"
              )}
            </Button>
          ) : (
            <Button
              type="submit"
              form="paymentForm"
              variant="contained"
              color="info"
              className="w-1/2"
              onClick={handleGoNext}
            >
              Next
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Payment;







