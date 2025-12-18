'use client';

import React from "react";

const PF_Consignment_Summary = ({
  collectionData,
  addressData,
  parcelFreightData,
}) => {
  return (
    <div className="rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#132B43] to-[#1e3a54]">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800">Booking Summary</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Package Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
            <svg className="w-5 h-5 text-[#FF7D44]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h4 className="text-base font-semibold text-gray-800">Package Details</h4>
          </div>
          {Array.isArray(collectionData?.freight_package) &&
            collectionData.freight_package.map((item, index) => (
              <div key={item.id || index} className="space-y-4">
                {index > 0 && <div className="border-t border-gray-200 my-4"></div>}
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  <div className="flex-1">
                    <span className="text-sm text-gray-500 uppercase font-medium">Quantity</span>
                    <p className="text-base text-gray-800 font-semibold mt-1">{item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <div className="flex-1">
                    <span className="text-sm text-gray-500 uppercase font-medium">Weight</span>
                    <p className="text-base text-gray-800 font-semibold mt-1">{item.weight} kg</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <div className="flex-1">
                    <span className="text-sm text-gray-500 uppercase font-medium">Dimensions</span>
                    <p className="text-base text-gray-800 font-semibold mt-1">
                      {item.width} × {item.length} × {item.height} cm
                    </p>
                    <p className="text-xs text-gray-500 mt-1">(W × L × H)</p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Quote */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
            <svg className="w-5 h-5 text-[#FF7D44]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="text-base font-semibold text-gray-800">Quote</h4>
          </div>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-gray-50 to-gray-150 rounded-lg p-4 border border-gray-200">
              <span className="text-xs text-gray-600 uppercase font-medium block mb-1">Total Price</span>
              <p className="text-2xl font-bold text-gray-800">
                ${parcelFreightData?.service_user_price || "0.00"}
              </p>
              <span className="text-xs text-gray-500">+ GST</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <span className="text-xs text-gray-500 uppercase font-medium">Courier Service</span>
                <p className="text-sm text-gray-800 font-medium">{parcelFreightData?.service_name || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
            <svg className="w-5 h-5 text-[#FF7D44]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h4 className="text-base font-semibold text-gray-800">Addresses</h4>
          </div>
          <div className="space-y-3">
            {Array.isArray(addressData) &&
              addressData.map((address) => (
                <div key={address.id || address.address_type}>
                  {address.address_type === "Pickup" && (
                    <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] text-blue-600 uppercase font-bold tracking-wide">Pickup From</span>
                          </div>
                          <p className="text-sm text-gray-900 font-medium leading-relaxed">
                            {address.address1}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {address.suburb} {address.state} {address.postcode}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {address.address_type === "Dropoff" && (
                    <div className="bg-gradient-to-r from-orange-50 to-orange-50/50 rounded-lg p-3 border border-orange-200">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] text-orange-600 uppercase font-bold tracking-wide">Dropoff To</span>
                          </div>
                          <p className="text-sm text-gray-900 font-medium leading-relaxed">
                            {address.address1}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {address.suburb} {address.state} {address.postcode}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PF_Consignment_Summary;



