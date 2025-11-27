'use client';

import { Fragment, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";

import { formatDate } from "@/utils/helpers";
import axiosInstance from "@/utils/axiosInstance";

const PF_Summary = ({ onBack, onStatus }) => {
  const { freight_id } = useParams();

  const { data: collection } = useSelector((state) => state.collection);
  const { data: parcelFreight } = useSelector((state) => state.parcelFreight);
  const { data: freightAddress } = useSelector((state) => state.address);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoBack = () => {
    onBack();
  };

  const checkStatus = () => {
    onStatus();
  };

  const handleDownloadLabel = async (event) => {
    event.preventDefault();
    if (
      collection &&
      (collection.service_name === "Couriers Please" ||
        collection.service_name === "CouriersPlease")
    ) {
      await axiosInstance
        .post(
          `/freight/${freight_id}/get_couriers_label`,
          { order_code: collection.order_code },
          {
            responseType: "blob",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/pdf",
            },
          }
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${collection.order_code}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Error downloading label:", error);
          alert("Error downloading label. Please try again.");
        });
    } else if (
      collection &&
      (collection.service_name === "Fed Ex" ||
        collection.service_name === "FedEx")
    ) {
      try {
        const response = await axiosInstance.post(
          `/freight/${freight_id}/get_fedex_label`,
          {},
          {
            responseType: "blob",
            transformResponse: [(data) => data],
          }
        );

        if (!(response.data instanceof Blob)) {
          throw new Error("Failed to generate label, response is not a Blob.");
        }

        const pdfUrl = URL.createObjectURL(response.data);

        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "fedex_label.pdf";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(pdfUrl);
      } catch (err) {
        setError("Failed to generate label.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Get pickup and dropoff addresses
  const pickupAddress = freightAddress?.find((addr) => addr.address_type === "Pickup");
  const dropoffAddress = freightAddress?.find((addr) => addr.address_type === "Dropoff");
  const senderAddress = freightAddress?.find((addr) => addr.address_type === "Sender");

  return (
    <Fragment>
      <div className="min-h-screen py-8">
        <div className="w-full px-4 md:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-5xl font-bold text-black mb-2">Your Parcel is Booked!</h1>
            <p className="text-xl text-[#FF7D44] font-semibold">Shipment Information</p>
          </div>

          {/* Shipment ID Banner */}
          <div className="rounded-xl shadow-xl p-8" style={{ background: 'linear-gradient(to right, #FF7D44, #ff9066)' }}>
            <div className="text-center">
              <p className="text-white text-sm font-semibold mb-1">Shipment Details</p>
              <h2 className="text-5xl font-bold text-white tracking-wider">
                {collection?.order_code || "N/A"}
              </h2>
            </div>
          </div>

          {/* Main Content Grid - PICKUP and DROPOFF */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* PICKUP Section */}
            {pickupAddress && (
              <div className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: '2px solid #FF7D44' }}>
                  <svg className="w-8 h-8 text-[#FF7D44]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-[#132B43]">PICKUP</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Company Name</p>
                    <p className="text-lg font-bold text-[#132B43]">{pickupAddress.company_name || "N/A"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Contact</p>
                      <p className="text-sm font-medium text-gray-700">{pickupAddress.company_contact_name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Phone</p>
                      <p className="text-sm font-medium text-gray-700">{pickupAddress.company_phone || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Email</p>
                    <p className="text-sm font-medium text-[#FF7D44]">{pickupAddress.company_email || "N/A"}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Pickup Address</p>
                    <div className="text-sm text-gray-700 leading-relaxed">
                      <p className="font-medium">{pickupAddress.address1}</p>
                      {pickupAddress.address2 && <p>{pickupAddress.address2}</p>}
                      <p className="mt-1">
                        {pickupAddress.suburb}, {pickupAddress.state} {pickupAddress.postcode}
                      </p>
                      <p className="text-gray-500">Australia</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DROPOFF Section */}
            {dropoffAddress && (
              <div className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: '2px solid #FF7D44' }}>
                  <svg className="w-8 h-8 text-[#FF7D44]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="text-2xl font-bold text-[#132B43]">DROPOFF</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Company Name</p>
                    <p className="text-lg font-bold text-[#132B43]">{dropoffAddress.company_name || "N/A"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Contact</p>
                      <p className="text-sm font-medium text-gray-700">{dropoffAddress.company_contact_name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Phone</p>
                      <p className="text-sm font-medium text-gray-700">{dropoffAddress.company_phone || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Email</p>
                    <p className="text-sm font-medium text-[#FF7D44]">{dropoffAddress.company_email || "N/A"}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Delivery Address</p>
                    <div className="text-sm text-gray-700 leading-relaxed">
                      <p className="font-medium">{dropoffAddress.address1}</p>
                      {dropoffAddress.address2 && <p>{dropoffAddress.address2}</p>}
                      <p className="mt-1">
                        {dropoffAddress.suburb}, {dropoffAddress.state} {dropoffAddress.postcode}
                      </p>
                      <p className="text-gray-500">Australia</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BOOKING INFORMATION Section */}
          <div className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '2px solid #FF7D44' }}>
              <svg className="w-8 h-8 text-[#FF7D44]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-2xl font-bold text-[#132B43]">BOOKING INFORMATION</h3>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Consignment Number</p>
                <p className="text-lg font-bold text-[#132B43]">{collection?.consignment_number || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Booking Number</p>
                <p className="text-lg font-bold text-[#132B43]">{collection?.id || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Booking Date</p>
                <p className="text-lg font-bold text-[#132B43]">
                  {collection?.collection_date_time ? formatDate(collection.collection_date_time) : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Service</p>
                <p className="text-lg font-bold text-[#FF7D44]">{parcelFreight?.service_type || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* SHIPPING COSTS Section */}
          <div className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '2px solid #FF7D44' }}>
              <svg className="w-8 h-8 text-[#FF7D44]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-[#132B43]">SHIPPING COSTS</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-semibold text-gray-600">Service:</span>
                  <span className="text-lg font-bold text-[#FF7D44]">{parcelFreight?.service_type || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-lg" style={{ background: 'linear-gradient(to right, #1e3d5a, #132b43)' }}>
                  <span className="text-sm font-semibold text-white">Total Cost:</span>
                  <span className="text-2xl font-bold text-white">
                    ${parcelFreight?.service_user_price || "0.00"} + GST
                  </span>
                </div>
              </div>

              {senderAddress && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Billing Details</p>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p className="font-semibold text-[#132B43]">{senderAddress.company_name || "N/A"}</p>
                    <p className="text-[#FF7D44]">{senderAddress.company_email || "N/A"}</p>
                    <p>{senderAddress.company_phone || "N/A"}</p>
                    <p className="font-medium">{senderAddress.address1}</p>
                    {senderAddress.address2 && <p>{senderAddress.address2}</p>}
                    <p>
                      {senderAddress.suburb}, {senderAddress.state} {senderAddress.postcode}, Australia
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-400 p-5 rounded-lg shadow-sm">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm font-bold text-gray-800 mb-1">Please Note:</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    This is a quote estimate only. Your shipment may be subject to additional surcharges not displayed in the quote provided. For a full list of surcharges please visit our website.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SHIPMENT INFORMATION Section */}
          <div className="bg-gray-100 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '2px solid #FF7D44' }}>
              <svg className="w-8 h-8 text-[#FF7D44]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-2xl font-bold text-[#132B43]">SHIPMENT INFORMATION</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-600 uppercase">Items</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {collection?.freight_package && Array.isArray(collection.freight_package) ? (
                  collection.freight_package.map((freight_package, index) => (
                    <div 
                      key={freight_package.id} 
                      className="bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-[#FF7D44] transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 bg-[#FF7D44] rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <h4 className="text-lg font-bold text-[#132B43]">Item {index + 1}</h4>
                      </div>
                      <div className="ml-12 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Weight:</span>
                          <span className="text-sm font-bold text-[#132B43]">
                            {parseFloat(freight_package.weight * freight_package.quantity).toFixed(2)} kg
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Dimensions (LxWxH):</span>
                          <span className="text-sm font-bold text-[#132B43]">
                            {freight_package.length} x {freight_package.width} x {freight_package.height}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No items found</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-6 pb-8">
            <button 
              onClick={handleDownloadLabel}
              className="group relative py-6 px-8 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden border-0"
              style={{ background: 'linear-gradient(to right, #FF7D44, #ff9066)', border: 'none' }}
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <svg className="w-7 h-7 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="relative z-10">Generate Label</span>
            </button>
            
            <button 
              onClick={checkStatus}
              className="group relative py-6 px-8 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden border-0"
              style={{ background: 'linear-gradient(to right, #1e3d5a, #132b43)', border: 'none' }}
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <svg className="w-7 h-7 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="relative z-10">Parcel Freight Status</span>
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PF_Summary;




