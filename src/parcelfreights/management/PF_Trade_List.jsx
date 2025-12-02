'use client';

import { useState, useEffect, Fragment, useContext } from "react";
import { UserContext } from "./../../contexts/UserContext";
import { useRouter } from "next/navigation";

import DataTable from "@/examples/Tables/DataTable";

import axiosInstance from "@/utils/axiosInstance";
import { formatDate } from "@/utils/helpers";

function PF_Trade_List() {
  const { pf_user } = useContext(UserContext);

  const [tableData, setTableData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  const router = useRouter();

  const [selectedRow, setSelectedRow] = useState(null);
  const [jobNo, setJobNo] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let response;
        if (pf_user?.user_roles?.trade) {
          response = await axiosInstance.post("freight/trade_parcels");
        }

        setAllData(response.data);
        setTableData(getRows(response.data));
      } catch (error) {
        return {
          message: error.response?.data?.message || error.message,
          status: error.response?.status || 500,
          error: error.response?.data || error.message,
        };
      }
    })();
  }, [pf_user]);

  const handleGetUnpaidJobs = (event) => {
    const data = allData.filter((row) => row.status === 1);
    setTableData(getRows(data));
    setActiveFilter("unpaid");
  };

  const handleGetPaidJobs = (event) => {
    const data = allData.filter((row) => row.status === 3 || row.status === 8);
    setTableData(getRows(data));
    setActiveFilter("paid");
  };

  const handleGetAllJobs = (event) => {
    setTableData(getRows(allData));
    setActiveFilter("all");
  };

  const pf_Columns = [
    { Header: "Freight ID", accessor: "job_no", width: "10%" },
    { Header: "Name", accessor: "user_name" },
    { Header: "Date", accessor: "date", width: "20%" },
    { Header: "Pickup", accessor: "pickup" },
    { Header: "Delivery", accessor: "delivery" },
    { Header: "Order No.", accessor: "order_code" },
    { Header: "Cons No.", accessor: "consignment_number" },
  ];

  // Function to handle row click
  const handleRowClick = async (row) => {
    const freightId = row.values.job_no;
    setJobNo(freightId);
    setSelectedRow(row);
    
    try {
      // Make API call to get quote details
      const response = await axiosInstance.get(`/freight/${freightId}/get_quote_details`);
      console.log('Quote details:', response.data);
      
      // Navigate to the parcel freight detail page with the freight ID
      router.push(`/parcel-freight/${freightId}`);
    } catch (error) {
      console.error('Error fetching quote details:', error);
      // Still navigate even if API call fails
      router.push(`/parcel-freight/${freightId}`);
    }
  };

  const getRows = (data) => {
    let updatedInfo = data.map((row) => {
      return {
        job_no: row.id,
        user_name: row.user_name,
        date: formatDate(row.created_at, "dd/MM/yyyy h:mm"),
        delivery: row.delivery_suburb,
        pickup: row.pickup_suburb,
        order_code: row.order_code,
        consignment_number: row.consignment_number,
        job_status: row.status,
      };
    });
    return updatedInfo;
  };

  const dataTableData = {
    columns: pf_Columns,
    rows: tableData,
    initialState: {},
  };

  return (
    <Fragment>
      <div className="min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          {/* Controls Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              {/* Header Section */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  Trade Parcel Freights
                </h1>
                <p className="text-sm text-gray-600">Manage and track your trade shipments</p>
              </div>
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-3 justify-end">
              <button
                className={`px-6 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${
                  activeFilter === "unpaid"
                    ? "text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                style={activeFilter === "unpaid" ? { background: 'linear-gradient(195deg, #132B43, #1a3a52)' } : {}}
                onClick={() => {
                  handleGetUnpaidJobs();
                }}
              >
                Parcels Quoted Only
              </button>
              <button
                className={`px-6 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${
                  activeFilter === "paid"
                    ? "text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                style={activeFilter === "paid" ? { background: 'linear-gradient(195deg, #132B43, #1a3a52)' } : {}}
                onClick={() => {
                  handleGetPaidJobs();
                }}
              >
                Parcels Paid
              </button>
              <button
                className={`px-6 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${
                  activeFilter === "all"
                    ? "text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                style={activeFilter === "all" ? { background: 'linear-gradient(195deg, #132B43, #1a3a52)' } : {}}
                onClick={() => {
                  handleGetAllJobs();
                }}
              >
                All Parcels
              </button>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full">
            <div className="overflow-x-auto">
              <DataTable
                table={dataTableData}
                initialState={dataTableData.initialState}
                canSearch
                showTotalEntries
                isSorted
                entriesPerPage={{ defaultValue: 10, entries: [5, 10, 15, 20, 25] }}
                onRowClick={handleRowClick}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default PF_Trade_List;



