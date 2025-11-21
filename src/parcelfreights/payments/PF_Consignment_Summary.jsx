'use client';

import React from "react";

const PF_Consignment_Summary = ({
  collectionData,
  addressData,
  parcelFreightData,
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-12 md:grid-cols-12 gap-4">
        {/* Package Details */}
        <div className="lg:col-span-5 md:col-span-5">
          <h4 className="text-lg font-semibold mb-3">Package Details:</h4>
          {Array.isArray(collectionData?.freight_package) &&
            collectionData.freight_package.map((item) => (
              <ul key={item.id} className="list-none space-y-1 mb-4">
                <li>
                  <strong>Quantity: </strong>
                  <span>{item.quantity}</span>
                </li>
                <li>
                  <strong>Weight: </strong>
                  <span>{item.weight}kg</span>
                </li>
                <li>
                  <strong>Dimensions: </strong>
                  <span>
                    (w) {item.width}cm x (l) {item.length}cm x (h) {item.height}cm
                  </span>
                </li>
              </ul>
            ))}
        </div>

        {/* Quote */}
        <div className="lg:col-span-3 md:col-span-3">
          <h4 className="text-lg font-semibold mb-3">Quote:</h4>
          <div>
            <ul className="list-none space-y-1">
              <li>
                <strong>Price: </strong>
                <span>
                  ${parcelFreightData?.service_user_price || "0"} + GST
                </span>
              </li>
              <li>
                <strong>Courier: </strong>
                <span>{parcelFreightData?.service_name || ""}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Address Details */}
        <div className="lg:col-span-4 md:col-span-4">
          <h4 className="text-lg font-semibold mb-3">Address Details:</h4>
          {Array.isArray(addressData) &&
            addressData.map((address) => (
              <ul
                key={address.id || address.address_type}
                className="list-none space-y-1"
              >
                {address.address_type === "Pickup" && (
                  <li>
                    <strong>Pickup From: </strong>
                    <span>
                      {address.address1}{" "}
                      {address.suburb}{" "}
                      {address.state}{" "}
                      {address.postcode}
                    </span>
                  </li>
                )}
                {address.address_type === "Dropoff" && (
                  <li>
                    <strong>Dropoff To: </strong>
                    <span>
                      {address.address1}{" "}
                      {address.suburb}{" "}
                      {address.state}{" "}
                      {address.postcode}
                    </span>
                  </li>
                )}
              </ul>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PF_Consignment_Summary;



