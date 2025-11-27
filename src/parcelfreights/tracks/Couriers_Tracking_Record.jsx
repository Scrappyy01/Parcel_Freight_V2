'use client';

import { Button, Card } from "@/components/ui/ui";

import { getTracking } from "./../../redux/services/trackingSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  COURIES_PLEASE_STATUS_PICKUP,
  COURIES_PLEASE_STATUS_DELIVERED,
} from "./../../utils/constant";
import axiosInstance from "@/utils/axiosInstance";

const Couriers_Tracking_Record = ({ freight_id, order_code }) => {
  const dispatch = useDispatch();
  const [completed, setCompleted] = useState(0);
  const handleRefresh = async (event) => {
    event.preventDefault();
    const formData = { order_code: order_code };
    dispatch(getTracking({ freight_id, formData }));
  };

  const handleDownloadLabel = async (event) => {
    event.preventDefault();
    await axiosInstance
      .post(
        `/freight/${freight_id}/get_couriers_label`,
        { order_code: order_code },
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
        link.setAttribute("download", `${order_code}.pdf`); //or any other extension
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); // Clean up the URL object
      })
      .catch((error) => {
        console.error("Error downloading label:", error);
        alert("Error downloading label. Please try again.");
      });
  };

  const {
    data: trackingData,
    status,
    error,
  } = useSelector((state) => state.tracking);

  useEffect(() => {
    if (status === "succeeded") {
      let trackingStatus = trackingData?.[0]?.[0]?.status;
      if (trackingStatus) {
        if (
          trackingStatus.toLowerCase().indexOf(COURIES_PLEASE_STATUS_PICKUP) !==
          -1
        ) {
          setCompleted(100);
        } else if (
          trackingStatus
            .toLowerCase()
            .indexOf(COURIES_PLEASE_STATUS_DELIVERED) !== -1
        ) {
          setCompleted(600);
        } else if (trackingStatus) {
          setCompleted(400);
        }
      }
    }

    if (status === "failed") {
      console.error("failed");
    }
  }, [status]);

  return (
    <div className="my-12">
      <div className="w-full">
        <div className="flex gap-4 mb-6">
          <Button
            onClick={handleRefresh}
            className="px-6 py-2 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            style={{
              background: 'linear-gradient(to right, #1e3d5a, #132B43)',
              border: 'none'
            }}
          >
            Tracking
          </Button>
          <Button
            onClick={handleDownloadLabel}
            className="px-6 py-2 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            style={{
              background: 'linear-gradient(to right, #FF7D44, #ff9066)',
              border: 'none'
            }}
          >
            Generate Label
          </Button>
        </div>

        <Card>
          <div className="p-6 space-y-6">
            <h3 className="text-xl font-bold text-[#132B43]">Tracking Status:</h3>
            
            {/* Progress Steps */}
            <div className="progress-container">
              <div
                className={`progress-step ${completed == 100 ? "current" : completed > 100 ? "completed" : ""}`}
              >
                Collected
              </div>
              <div
                className={`progress-step ${completed == 400 ? "current" : completed > 400 ? "completed" : ""}`}
              >
                Delivering
              </div>
              <div
                className={`progress-step ${completed == 600 ? "current" : completed > 600 ? "completed" : ""}`}
              >
                Delivered
              </div>
            </div>

            {/* Tracking Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                      Date Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Contractor
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trackingData?.[0]?.map((tracking, index) =>
                    tracking?.itemsCoupons?.[0]?.trackingInfo?.map(
                      (info, infoIndex) => (
                        <tr
                          key={`${tracking.consignmentCode}-${infoIndex}`}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                            {infoIndex + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-300">
                            {info.date} {info.time}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-300">
                            {info.action}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {info.contractor}
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Couriers_Tracking_Record;


