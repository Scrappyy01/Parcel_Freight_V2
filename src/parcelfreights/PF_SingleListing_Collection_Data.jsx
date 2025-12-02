import { Fragment, useEffect, useState, useContext, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UserContext } from "../contexts/UserContext";
import { fetchCollection } from "../redux/services/collectionSlice";
import { resetParcelFreightStatus } from "../redux/services/parcelFreightSlice";
import { resetCollectionStatus } from "../redux/services/collectionSlice";
import { resetAddressStatus } from "../redux/services/addressSlice";
import { resetConfirmationStatus } from "../redux/services/confirmationSlice";
import { resetPaymentStatus } from "../redux/services/paymentSlice";
import { resetTrackingStatus } from "../redux/services/trackingSlice";

import { useRouter, useParams } from "next/navigation";
import { isEmpty, isNumber } from "lodash";

import ParcelFreightAddress from "./addresses/PF_Address_Details";
import ParcelFreightDetail from "./details/Parcel_Freight_detail.jsx";

import loadlink from "@/assets/ll-logo.svg";
import loadlinkLogo from "@/assets/Loadlink-Logo.svg";
import PFSingleListingConfirmInfo from "./confirmInfo/PF_SingleListing_Confirm_Info.jsx";
import Payment from "./payments/Payment.jsx";
import PFSummary from "./orderSummary/PF_Summary";
import PFTracking from "./tracks/PF_Tracking";
import { isTrade, isEcommerce } from "@/utils/helpers";

const PF_SingleListing_Collection_Data = () => {
  const [activeKey, setActiveKey] = useState("job-data");
  const [disableJob, setDisableJob] = useState(false);
  const [disableAddress, setDisableAddress] = useState(true);
  const [disableConfirmation, setDisableConfirmation] = useState(true);
  const [disablePayment, setDisablePayment] = useState(true);
  const [disableSummary, setDisableSummary] = useState(true);
  const [disableTracking, setDisableTracking] = useState(true);
  const [flashRed, setFlashRed] = useState(false);
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.collection);

  const { pf_user, setPF_User } = useContext(UserContext);
  const [tradeUser, setTradeUser] = useState(false);
  const [ecommerceUser, setEcommerceUser] = useState(false);

  const router = useRouter();
  const params = useParams();
  const freight_id = params?.id; // Get 'id' from route params since the route is [id]
  const ignoreAutoProgressRef = useRef(false);

  useEffect(() => {
    // No location state in Next.js - just skip this check
  }, []);

  useEffect(() => {
    setTradeUser(isTrade(pf_user));
    setEcommerceUser(isEcommerce(pf_user));
  }, [pf_user]);

  useEffect(() => {
    dispatch(fetchCollection({ freight_id, user_id: pf_user.id }));
  }, [dispatch, freight_id, pf_user]);

  useEffect(() => {
    if (!isEmpty(data)) {
      if (ignoreAutoProgressRef.current) {
        setActiveKey("job-data");
        setDisableJob(false);
        setDisableAddress(true);
        setDisableConfirmation(true);
        setDisablePayment(true);
        setDisableSummary(true);
        setDisableTracking(true);
        return;
      }

      // 8 booked; 9 sent invoice
      if (data.status == 2 || data.status == 8 || data.status == 9) {
        setDisableJob(true);
        setDisableAddress(true);
        setDisableConfirmation(true);
        setDisableSummary(false);
        setDisableTracking(false);
        setActiveKey("summary");
      } else {
        if (!!(data.freight_service_quote_id ?? "").toString().trim()) {
          setDisableAddress(false);
        }

        if (
          !isEmpty(data.freight_address) &&
          !!(data?.freight_address[0].address1 ?? "").toString().trim() &&
          !!(data?.freight_address[1].address1 ?? "").toString().trim()
        ) {
          setDisablePayment(false);
          if (tradeUser || ecommerceUser) {
            setDisableConfirmation(false);
          }
        }

        if (
          (data?.confirmed_warranty === "1" ||
            data?.confirmed_warranty === 1 ||
            data?.confirmed_warranty === "true" ||
            data?.confirmed_warranty === true) &&
          (data?.confirmed_terms_conditions === "1" ||
            data?.confirmed_terms_conditions === 1 ||
            data?.confirmed_terms_conditions === "true" ||
            data?.confirmed_terms_conditions === true) &&
          (data?.confirmed_understand === "1" ||
            data?.confirmed_understand === 1 ||
            data?.confirmed_understand === "true" ||
            data?.confirmed_understand === true)
        ) {
          setDisableConfirmation(false);
          if (!!(data?.order_code ?? "").toString().trim()) {
            setDisableSummary(false);
            setDisableTracking(false);
          }
        }
      }
    }
  }, [data]);

  const handleParcelFreightDetailSubmit = () => {
    ignoreAutoProgressRef.current = false;
    setActiveKey("collection");
    setDisableAddress(false);
    dispatch(resetParcelFreightStatus());
  };

  const handleParcelFreightAddressSubmit = () => {
    setActiveKey("payment");
    if (tradeUser || ecommerceUser) {
      setActiveKey("confirmation");
      setDisableConfirmation(false);
    }
    setDisablePayment(false);
    dispatch(resetAddressStatus());
  };

  const handlePaymentSubmit = () => {
    setActiveKey("confirmation");
    setDisableConfirmation(false);
    dispatch(resetPaymentStatus());
  };

  const handleParcelFreightConfirmationSubmit = () => {
    setActiveKey("summary");
    setDisableSummary(false);
    setDisableTracking(false);
    dispatch(resetConfirmationStatus());
  };

  const handleSummary = () => {
    setActiveKey("summary");
    setDisableSummary(false);
  };

  const handleTrackingSubmit = () => {
    dispatch(resetTrackingStatus());
  };

  /**
   * * display loading spinner if status is loading
   */
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]" style={{ marginTop: '75px' }}>
        <img 
          src={loadlinkLogo.src} 
          alt="Loadlink" 
          className="w-64 animate-pulse mb-6"
        />
        <p className="text-gray-600 text-lg mb-4">Loading booking details...</p>
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #FF7D44, transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite'
            }}
          />
        </div>
        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>
    );
  }

  /**
   * display error message if status is failed
   */
  if (status === "failed") {
    return (
      <div style={{ textAlign: "center" }}>
        <div className="bg-gray-800 text-white px-4 py-3 rounded" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="SingleListing-Wrapper">
      <div className="SingleListing-Wrapper-Level02 flex justify-center">
        <div className="SingleListing-Wrapper-Main-Card bg-white rounded-lg shadow-lg w-full">
          <Fragment>
            <div
              className="container"
              style={{
                marginTop: "45px",
                maxWidth: "1300px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              
              {/* Custom Tabs Navigation */}
              <div className="border-b border-gray-200 mb-3">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => !disableJob && setActiveKey("job-data")}
                    disabled={disableJob}
                    className={`py-4 px-6 block hover:text-blue-600 focus:outline-none ${
                      activeKey === "job-data"
                        ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                        : "text-gray-600"
                    } ${disableJob ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    Job Data
                  </button>
                  <button
                    onClick={() => !disableAddress && setActiveKey("collection")}
                    disabled={disableAddress}
                    className={`py-4 px-6 block hover:text-blue-600 focus:outline-none ${
                      activeKey === "collection"
                        ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                        : "text-gray-600"
                    } ${disableAddress ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    Collection
                  </button>
                  {!(tradeUser || ecommerceUser) && (
                    <button
                      onClick={() => !disablePayment && setActiveKey("payment")}
                      disabled={disablePayment}
                      className={`py-4 px-6 block hover:text-blue-600 focus:outline-none ${
                        activeKey === "payment"
                          ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                          : "text-gray-600"
                      } ${disablePayment ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      Payment
                    </button>
                  )}
                  <button
                    onClick={() => !disableConfirmation && setActiveKey("confirmation")}
                    disabled={disableConfirmation}
                    className={`py-4 px-6 block hover:text-blue-600 focus:outline-none ${
                      activeKey === "confirmation"
                        ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                        : "text-gray-600"
                    } ${disableConfirmation ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    Confirmation
                  </button>
                  <button
                    onClick={() => !disableSummary && setActiveKey("summary")}
                    disabled={disableSummary}
                    className={`py-4 px-6 block hover:text-blue-600 focus:outline-none ${
                      activeKey === "summary"
                        ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                        : "text-gray-600"
                    } ${disableSummary ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    Summary
                  </button>
                  <button
                    onClick={() => !disableTracking && setActiveKey("tracking")}
                    disabled={disableTracking}
                    className={`py-4 px-6 block hover:text-blue-600 focus:outline-none ${
                      activeKey === "tracking"
                        ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                        : "text-gray-600"
                    } ${disableTracking ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    Tracking
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeKey === "job-data" && (
                  <ParcelFreightDetail
                    onSubmitParcelFreightDetail={
                      handleParcelFreightDetailSubmit
                    }
                  />
                )}
                
                {activeKey === "collection" && (
                  <ParcelFreightAddress
                    onSubmitParcelFreightAddress={
                      handleParcelFreightAddressSubmit
                    }
                    onBack={() => {
                      setFlashRed(false);
                      setActiveKey("job-data");
                    }}
                  />
                )}
                
                {!(tradeUser || ecommerceUser) && activeKey === "payment" && (
                  <Payment
                    onSubmitPayment={handlePaymentSubmit}
                    onBack={() => {
                      setFlashRed(false);
                      setActiveKey("collection");
                    }}
                    onNext={() => {
                      setFlashRed(false);
                      setActiveKey("confirmation");
                    }}
                  />
                )}
                
                {activeKey === "confirmation" && (
                  <PFSingleListingConfirmInfo
                    onSubmitParcelFreightConfirmation={
                      handleParcelFreightConfirmationSubmit
                    }
                    onBack={() => {
                      setFlashRed(false);
                      isTrade(pf_user) || isEcommerce(pf_user)
                        ? setActiveKey("collection")
                        : setActiveKey("payment");
                    }}
                  />
                )}
                
                {activeKey === "summary" && (
                  <PFSummary
                    onBack={() => {
                      setFlashRed(false);
                      setActiveKey("confirmation");
                    }}
                    onStatus={() => {
                      setFlashRed(false);
                      setActiveKey("tracking");
                    }}
                  />
                )}
                
                {activeKey === "tracking" && (
                  <PFTracking
                    onSubmitParcelFreightTracking={handleTrackingSubmit}
                    onBack={() => {
                      setFlashRed(false);
                      setActiveKey("summary");
                    }}
                  />
                )}
              </div>
            </div>
          </Fragment>
        </div>
      </div>
    </div>
  );
};

export default PF_SingleListing_Collection_Data;
