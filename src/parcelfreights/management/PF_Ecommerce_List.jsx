'use client';

import { useState, useEffect, Fragment, useContext, useMemo } from "react";

import "./parcel-freight-management.css";

import DataTable from "@/examples/Tables/DataTable";
import { UserContext } from "../../contexts/UserContext";
import { useRouter } from "next/navigation";

import axiosInstance from "../../utils/axiosInstance";
import {
  buildHolidaysSetAU,
  formatDate,
  getAustralianStateFromTimezone,
  getNextBusinessDate,
  isHoliday,
  isWeekend,
  nextBusinessDate,
} from "../../utils/helpers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "@/components/ui/ui/Modal";

function PF_Ecommerce_List() {
  const now = new Date();
  const { pf_user, setPf_User } = useContext(UserContext);

  // let queryOptions = null;
  const [tableData, setTableData] = useState([]);
  const [allData, setAllData] = useState([]);

  const router = useRouter();

  const [show, setShow] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(true);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [error, setError] = useState(null);
  const [content, setContent] = useState(null);
  const [cpTrackingData, setCpTrackingData] = useState(null);

  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [startDate, setStartDate] = useState(() => now);
  const [collectionDate, setCollectionDate] = useState(null);
  const [activeFilter, setActiveFilter] = useState("notSent");

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const maxDay = useMemo(() => {
    const d = new Date(now);
    d.setDate(d.getDate() + 14);
    d.setHours(23, 59, 59, 999);
    return d;
  }, []);

  const state = getAustralianStateFromTimezone(tz);
  const holidaysByState = buildHolidaysSetAU(state);

  // datepicker guards
  const minDateDP = useMemo(() => {
    const date = new Date(now);
    const isAfterTime =
      date.getHours() > 14 || (date.getHours() === 14 && date.getHours() >= 30);
    if (
      isWeekend(date, tz) ||
      isHoliday(date, tz, holidaysByState) ||
      isAfterTime
    ) {
      return getNextBusinessDate(date, tz, holidaysByState);
    }

    return date;
  }, [tz, holidaysByState]);

  const maxDateDP = new Date(maxDay);

  useEffect(() => {
    setStartDate(minDateDP);
  }, []);

  // filter dates: disable weekends/holidays
  const filterDate = (d) => {
    if (!d) return false;
    return !isWeekend(d, tz) && !isHoliday(d, tz, holidaysByState);
  };

  const [jobNo, setJobNo] = useState(null);

  const handleOnChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setStartDate(date);
      setCollectionDate(date.toISOString());
    }
  };

  // Toggle a single checkbox
  const handleSelectRow = (row) => {
    setSelectedRows((prev) => {
      const exists = prev.some((item) => item.freight_id === row.freight_id);
      if (exists) {
        // remove
        return prev.filter((item) => item.freight_id !== row.freight_id);
      } else {
        // add
        return [
          ...prev,
          {
            freight_id: row.freight_id,
            service_name: row.service_name,
            service_type: row.service_type,
          },
        ];
      }
    });
  };

  // Select all
  const handleSelectAll = () => {
    if (selectedRows.length === tableData.length) {
      setSelectedRows([]);
    } else {
      const allSelected = tableData.map((row) => ({
        freight_id: row.freight_id,
        service_name: row.service_name,
        service_type: row.service_type,
      }));
      setSelectedRows(allSelected);
    }
  };

  // Helper
  const isAllSelected =
    tableData.length > 0 && selectedRows.length === tableData.length;

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    if (!pf_user?.user_roles?.ecommerce) {
      return;
    }

    (async () => {
      try {
        let response;
        if (pf_user?.user_roles?.ecommerce) {
          response = await axiosInstance.post("freight/ecommerce_parcels");
          const rawData = response.data;
          setAllData(rawData);
          const notSent = rawData.filter((row) => row.status === 10);
          setTableData(getRows(notSent));
        }
      } catch (error) {
        console.error(error);
        return {
          message: error.response?.data?.message || error.message,
          status: error.response?.status || 500,
          error: error.response?.data || error.message,
        };
      }
    })();
  }, [pf_user]);

  const handleGenerateLabels = async () => {
    setBooking(true);
    try {
      const response = await axiosInstance.post("freight/generate_labels", {
        freights: selectedRows,
        pickup_date: collectionDate,
        timezone: tz,
      });

      const result = response.data;

      if (!Array.isArray(result)) {
        console.error("Unexpected response:", result);
        setBooking(false);
        return;
      }

      // compute the new data first
      const updatedData = allData.map((row) => {
        const updated = result.find((r) => r.freight_id === row.id);
        if (updated) {
          return {
            ...row,
            order_code: updated.order_code ?? row.order_code,
            consignment_number:
              updated.consignment_number ?? row.consignment_number,
            status: updated.status ?? row.status,
            collection_date_time: updated.collection_date_time,
            collection_time_start: updated.collection_time_start,
            collection_time_end: updated.collection_time_end,
          };
        }
        return row;
      });

      setAllData(updatedData);
      const sent = updatedData.filter((row) => row.status === 8);
      if (sent) {
        setShowCheckbox(false);
      }
      setTableData(getRows(sent));

      // setTableData(updatedData);
    } catch (error) {
      console.error("❌ Failed to print labels:", error);
    } finally {
      setBooking(false);
    }
  };

  const handleGetNotSent = (event) => {
    const data = allData.filter((row) => row.status === 10);
    setTableData(getRows(data));
    setShowCheckbox(true);
  };

  const handleGetSent = (event) => {
    const data = allData.filter((row) => row.status === 8);
    setTableData(getRows(data));
    setShowCheckbox(false);
  };

  const pf_Columns = [
    {
      Header: "",
      accessor: "select",
      sorted: false,
      Cell: ({ row }) => {
        const isChecked = selectedRows.some(
          (item) => item.freight_id === row.original.freight_id
        );
        return (
          <input
            type="checkbox"
            checked={isChecked}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation(); // prevent triggering onRowClick
              handleSelectRow(row.original);
            }}
          />
        );
      },
      className: "checkbox-column",
    },
    { Header: "Freight ID", accessor: "freight_id", width: "10%" },
    { Header: "eComm Order No.", accessor: "external_order_no" },
    { Header: "Name", accessor: "user_name" },
    { 
      Header: "Freight Service", 
      accessor: "service_type",
      Cell: ({ value }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    { Header: "Collection date", accessor: "date" },
    {
      Header: "pickup",
      accessor: "pickup",
      Cell: ({ value }) => (
        <span className="text-sm text-gray-700 truncate max-w-[150px] inline-block" title={value}>
          {value}
        </span>
      )
    },
    {
      Header: "delivery",
      accessor: "delivery",
      Cell: ({ row }) => {
        const freight = row.original;
        const dropoffInfo = freight.address_dropoff;
        const fullAddress = `${dropoffInfo?.company_contact_name || ""}\n${dropoffInfo?.company_email || ""}\n${dropoffInfo?.address1 || ""}\n${dropoffInfo?.suburb || ""} ${dropoffInfo?.state || ""} ${dropoffInfo?.postcode || ""}`;
        return (
          <span className="text-sm text-gray-700 truncate max-w-[150px] inline-block" title={fullAddress}>
            {freight?.delivery}
          </span>
        );
      },
    },
    { Header: "Order No.", accessor: "order_code" },
    { Header: "Cons No.", accessor: "consignment_number" },
    {
      Header: "Tracking",
      accessor: "actions",
      Cell: ({ row }) => {
        const freight = row.original;

        if (freight.status === 8) {
          return (
            <Fragment>
              <button
                className="text-white text-xs px-2 py-1 rounded mr-1 min-w-0 disabled:opacity-60 cursor-pointer"
                style={{ background: 'linear-gradient(195deg, #132B43, #1a3a52)', fontSize: '0.7rem' }}
                disabled={downloadingId === freight.freight_id}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrint(freight);
                }}
              >
                {downloadingId === freight.freight_id ? (
                  <>
                    <div className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2"></div>
                    Downloading...
                  </>
                ) : (
                  "Download"
                )}
              </button>
              <button
                className="text-white text-xs px-2 py-1 rounded min-w-0 cursor-pointer"
                style={{ background: 'linear-gradient(195deg, #132B43, #1a3a52)', fontSize: '0.7rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTracking(freight);
                }}
              >
                Track
              </button>
            </Fragment>
          );
        }
      },
    },
  ];

  const handlePrint = async (freight) => {
    setDownloadingId(freight.freight_id);
    setError(null);

    try {
      switch (freight.service_name) {
        case "Fed Ex":
          const response = await axiosInstance.post(
            `/freight/${freight.freight_id}/get_fedex_label`,
            {},
            {
              responseType: "blob",
              transformResponse: [(data) => data],
            }
          );

          if (!(response.data instanceof Blob)) {
            throw new Error(
              "Failed to generate label, response is not a Blob."
            );
          }

          const pdfUrl = URL.createObjectURL(response.data);

          const link = document.createElement("a");
          link.href = pdfUrl;
          link.download = `fedex_${freight.consignment_number}.pdf`; // Set the desired file name
          link.style.display = "none"; // Hide the link
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(pdfUrl); // Clean up the URL object

          break;
        case "Couriers Please":
          await axiosInstance
            .post(
              `/freight/${freight.freight_id}/get_couriers_label`,
              { order_code: freight.order_code },
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
              link.setAttribute(
                "download",
                `couriersplease_${freight.consignment_number}.pdf`
              ); //or any other extension
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(url); // Clean up the URL object
            });
          break;
        default:
          setShow(false);
          setError(null);
          break;
      }
    } catch (err) {
      setError("Failed to load tracking data");
      console.error("❌ Failed to open label:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleTracking = async (freight) => {
    setShow(true);
    setLoading(true);
    setError(null);
    setSelectedRow(freight);
    setCpTrackingData(null);
    setContent(null);
    switch (freight.service_name) {
      case "Fed Ex":
        try {
          const response = await axiosInstance.post(
            `/freight/${freight.freight_id}/get_fedex_tracking`,
            {
              Con: freight.consignment_number,
            }
          );
          setContent(response.data);
        } catch (err) {
          setError("Failed to load tracking data");
        } finally {
          setLoading(false);
        }

        break;
      case "Couriers Please":
        try {
          const resonse = await axiosInstance.post(
            `/freight/${freight.freight_id}/get_couriers_tracking`,
            {
              order_code: freight.order_code,
            }
          );
          setCpTrackingData(resonse.data);
        } catch (err) {
          setError("Failed to load tracking data");
        } finally {
          setLoading(false);
        }
        break;
      default:
        setShow(false);
        setError(null);
        setLoading(false);
        break;
    }
  };

  // Function to handle row click
  const handleRowClick = (row) => {
    setJobNo(row.values.freight_id); // Extract the job number from the row data
    setSelectedRow(row);
    setShow(true); // IJV - 2024.09.16 - we don't use the Modal interface anymore because it wasn't scrolling suitable well.
    // const jobNo = row.values.freight_id; // Extract the job number from the row data
    router.push(`/parcel-freight/${row.values.freight_id}/`); // Navigate to the route
  };

  const getRows = (data) => {
    let updatedInfo = data.map((row) => {
      const addressPickup = row.freight_address?.find(
        (address) => address.address_type === "Pickup"
      );
      const addressDropoff = row.freight_address?.find(
        (address) => address.address_type === "Dropoff"
      );
      return {
        freight_id: row.id,
        external_order_no: row.external_order_no,
        user_name: row.user_name,
        date: row?.collection_time_end
          ? formatDate(row.collection_time_end, "dd/MM/yyyy h:mm")
          : "",
        delivery: row.delivery_suburb,
        pickup: row.pickup_suburb,
        service_name: row.service_name,
        service_type: row.service_type,
        order_code: row.order_code,
        consignment_number: row.consignment_number,
        status: row.status,
        address_pickup: addressPickup,
        address_dropoff: addressDropoff,
      };
    });
    return updatedInfo;
  };

  const dataTableData = {
    columns: showCheckbox
      ? pf_Columns
      : pf_Columns.filter((col) => col.accessor !== "select"),
    rows: tableData,
    initialState: {},
  };

  return (
    <Fragment>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              E-Commerce Parcel Freights
            </h1>
            <p className="text-gray-600">Manage and track your e-commerce shipments</p>
          </div>

          {/* Controls Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left: Selection Actions */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  {showCheckbox && (
                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700 cursor-pointer">Select All</span>
                    </label>
                  )}
                  
                  <button
                    className="px-6 py-2.5 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-60 cursor-pointer hover:cursor-pointer"
                    style={{ background: 'linear-gradient(195deg, #132B43, #1a3a52)' }}
                    onClick={handleGenerateLabels}
                    disabled={selectedRows.length === 0 || booking}
                  >
                    {booking ? (
                      <>
                        <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2"></div>
                        Booking...
                      </>
                    ) : (
                      <>
                        <svg className="inline-block w-4 h-4 mr-2 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Book Freight ({selectedRows.length})
                      </>
                    )}
                  </button>

                  {/* Center: Date Picker */}
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      Collection Date
                    </label>
                    <div className="date-picker-wrapper">
                      <DatePicker
                        selected={startDate}
                        dateFormat={"dd/MM/yyyy"}
                        onChange={handleOnChange}
                        name="pickup_date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent cursor-pointer"
                        minDate={minDateDP}
                        maxDate={maxDateDP}
                        filterDate={filterDate}
                        wrapperClassName="w-full"
                        calendarClassName="border border-gray-200 rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Helper text when nothing selected */}
                {selectedRows.length === 0 && showCheckbox && (
                  <p className="text-sm text-gray-500 ml-1 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Select one or more parcels to book freight.
                  </p>
                )}
              </div>

              {/* Right: Filter Buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                    activeFilter === "notSent"
                      ? "text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                  style={activeFilter === "notSent" ? { background: 'linear-gradient(195deg, #132B43, #1a3a52)' } : {}}
                  onClick={() => {
                    handleGetNotSent();
                    setActiveFilter("notSent");
                  }}
                >
                  Ready to Send
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                    activeFilter === "sent"
                      ? "text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                  style={activeFilter === "sent" ? { background: 'linear-gradient(195deg, #132B43, #1a3a52)' } : {}}
                  onClick={() => {
                    handleGetSent();
                    setActiveFilter("sent");
                  }}
                >
                  Sent
                </button>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full">
            {tableData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {activeFilter === "notSent" ? "No Parcels Ready to Send" : "No Sent Parcels"}
                </h3>
                <p className="text-gray-500 text-center mb-6 max-w-md">
                  {activeFilter === "notSent" 
                    ? "There are currently no parcels ready to be sent. Create a new booking to get started."
                    : "You haven't sent any parcels yet. Book freight to see them here."}
                </p>
                {activeFilter === "notSent" && (
                  <button
                    onClick={() => router.push('/parcel-freight')}
                    className="px-6 py-3 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all cursor-pointer"
                    style={{ background: 'linear-gradient(195deg, #FF7D44, #ff9066)' }}
                  >
                    <svg className="inline-block w-5 h-5 mr-2 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Booking
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <DataTable table={dataTableData} canSearch />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {show && (
        <Modal
          isOpen={show}
          onClose={handleClose}
          title={selectedRow && `${selectedRow.service_name} Tracking`}
        >
          {loading && (
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <span className="sr-only">Loading...</span>
            </div>
          )}
          {error && <div className="text-red-600">{error}</div>}
          {content && <div dangerouslySetInnerHTML={{ __html: content }} />}
          {cpTrackingData?.[0]?.status && (
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">#</th>
                  <th className="border border-gray-300 px-4 py-2">Date Time</th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                  <th className="border border-gray-300 px-4 py-2">Contactor</th>
                </tr>
              </thead>
              <tbody>
                {cpTrackingData?.[0]?.map((tracking, index) =>
                  tracking?.itemsCoupons?.[0]?.trackingInfo?.map(
                    (info, infoIndex) => (
                      <tr key={`${tracking.consignmentCode}-${infoIndex}`} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{infoIndex + 1}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {info.date} {info.time}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{info.action}</td>
                        <td className="border border-gray-300 px-4 py-2">{info.contractor}</td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          )}
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </Fragment>
  );
}

export default PF_Ecommerce_List;



