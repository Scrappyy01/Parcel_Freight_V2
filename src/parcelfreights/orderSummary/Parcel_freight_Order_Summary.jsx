'use client';

import { Fragment } from "react";
import { useSelector } from "react-redux";

import { formatDate } from "@/utils/helpers";
import Summary_Address from "../../components/ParcelFreightOrderSummary/Summary_Address";
import Summary_Package from "../../components/ParcelFreightOrderSummary/Summary_Package";

const Parcel_Freight_Order_Summary = ({ onBack }) => {
  const { data: collection } = useSelector((state) => state.collection);
  const { data: parcelFreight } = useSelector((state) => state.parcelFreight);
  const { data: freightAddress } = useSelector((state) => state.address);

  const handleGoBack = () => {
    onBack();
  };

  return (
    <Fragment>
      <div className="pt-4 pb-6 Job-Management-Wrapper">
        <div className="mb-6">
          <div className="flex justify-center">
            <div className="w-full lg:w-3/4">
              <h3 className="text-3xl font-medium mb-4">
                Shipment: {collection.order_code}
              </h3>
              
              {/* Address Cards */}
              <div className="bg-white rounded-lg shadow mb-3">
                <div className="flex flex-row justify-between items-start">
                  {Array.isArray(freightAddress) &&
                    freightAddress.map((address) => {
                      switch (address.address_type) {
                        case "Pickup":
                          return (
                            <Summary_Address
                              key={address.id}
                              address={address}
                            />
                          );

                        case "Dropoff":
                          return (
                            <Summary_Address
                              key={address.id}
                              address={address}
                            />
                          );

                        default:
                          return null;
                      }
                    })}
                </div>
              </div>

              {/* Details Card */}
              <div className="bg-white rounded-lg shadow mt-3">
                <div className="flex flex-row justify-between items-start">
                  {/* Booking Details */}
                  <div className="flex-1">
                    <div className="p-6 leading-tight">
                      <h5 className="text-xl font-medium mb-4">
                        Booking details
                      </h5>
                      <div className="mt-4">
                        <div className="text-sm font-semibold text-gray-700">
                          Shipment number:
                        </div>
                        <div className="text-sm text-gray-600">
                          {collection.order_code}
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-sm font-semibold text-gray-700">
                          Booking number
                        </div>
                        <div className="text-sm text-gray-600">
                          {collection.id}
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-sm font-semibold text-gray-700">
                          Booking date
                        </div>
                        <div className="text-sm text-gray-600">
                          {collection?.collection_date_time
                            ? formatDate(collection.collection_date_time)
                            : ""}
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-sm font-semibold text-gray-700">
                          Service
                        </div>
                        <div className="text-sm text-gray-600">
                          {parcelFreight.service_type}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipment Details */}
                  <div className="flex-1">
                    <div className="p-6 leading-tight">
                      <h5 className="text-xl font-medium mb-4">
                        Shipment Details
                      </h5>
                      <div className="mt-4">
                        <div className="text-sm font-semibold text-gray-700">
                          Total items:
                        </div>
                      </div>

                      {collection?.freight_package &&
                        Array.isArray(collection.freight_package) &&
                        collection.freight_package.map((freight_package) => {
                          return (
                            <Summary_Package
                              key={freight_package.id}
                              freight_package={freight_package}
                            />
                          );
                        })}
                    </div>
                  </div>

                  {/* Shipping Costs */}
                  <div className="flex-1">
                    <div className="p-4">
                      <div className="bg-[rgb(234,235,236)] rounded-lg">
                        <div className="p-6 leading-tight">
                          <h5 className="text-xl font-medium mb-4">
                            Shipping costs
                          </h5>
                          <div className="text-sm text-gray-600">
                            Service: {parcelFreight.service_type}
                          </div>
                          <div className="text-sm text-gray-600">
                            Cost: ${parcelFreight.service_user_price} + GST
                          </div>
                        </div>
                        <div className="p-6 pt-0 leading-tight">
                          <div className="text-sm text-gray-600 font-bold">
                            Billing
                          </div>
                          <div className="text-sm text-gray-600">
                            {Array.isArray(freightAddress) &&
                              freightAddress.map((address) => {
                                if (address.address_type === "Sender") {
                                  return (
                                    <Summary_Address
                                      key={address.id}
                                      address={address}
                                    />
                                  );
                                }
                                return null;
                              })}
                          </div>
                          <div className="mt-3 text-sm text-gray-600">
                            Please note that this is quote estimate only.{" "}
                            <br />
                            Your shipment may be subject to additional
                            <br />
                            surcharges not displayed in the quote provided.
                            <br /> For a full list of surcharges please visit
                            <br />
                            xxxxx
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <div className="bg-white rounded-lg shadow mt-3">
                <div className="flex justify-end p-4">
                  <button
                    type="button"
                    className="btn btn-primary wgl-button wgl-button-save mt-2 w-1/2 goback-button"
                    onClick={handleGoBack}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Parcel_Freight_Order_Summary;



