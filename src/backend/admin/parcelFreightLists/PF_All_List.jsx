'use client';

import DataTable from "@/examples/Tables/DataTable";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { useRouter } from "next/navigation";

import axiosInstance from "@/utils/axiosInstance";
import { formatDate } from "@/utils/helpers";

function PF_All_List() {
  const { pf_user } = useContext(UserContext);

  // let queryOptions = null;
  const [tableData, setTableData] = useState([]);
  const [allData, setAllData] = useState([]);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        let response;
        if (pf_user?.user_roles?.admin) {
          response = await axiosInstance.post("freight/allparcels");
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
  };

  const handleGetPaidJobs = (event) => {
    const data = allData.filter((row) => row.status === 3 || row.status === 8);
    setTableData(getRows(data));
  };

  const handleGetAllJobs = (event) => {
    setTableData(getRows(allData));
  };

  const pf_Columns = [
    { Header: "Freight ID", accessor: "job_no", width: "10%" },
    { Header: "Name", accessor: "user_name" },
    { Header: "date", accessor: "date", width: "20%" },
    { Header: "pickup", accessor: "pickup" },
    { Header: "delivery", accessor: "delivery" },
    { Header: "Order No.", accessor: "order_code" },
    { Header: "Cons No.", accessor: "consignment_number" },
  ];

  // Function to handle row click
  const handleRowClick = (row) => {
    router.push(`/parcel-freight/${row.values.job_no}/`); // Navigate to the route
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
    initialState: {
      // sortBy: [
      //   {
      //     id: "id", // The column ID to sort by
      //     desc: false, // Sort in descending order
      //   },
      // ],
    },
  };

  return (
    <main className="flex-grow bg-gray-50 p-6">
      <div className="flex flex-col items-center mx-6 pb-10 mt-0 md:mt-0 space-y-4">
        <div className="w-full flex justify-end items-center gap-4">
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-4">Parcel Freights List - ADMIN</h3>
          </div>
          <button
            className="px-4 py-2 text-white rounded mr-4"
            style={{ background: 'linear-gradient(195deg, #49a3f1, #1A73E8)' }}
            onClick={handleGetUnpaidJobs}
          >
            Parcels Quoted Only
          </button>
          <button
            className="px-4 py-2 text-white rounded mr-4"
            style={{ background: 'linear-gradient(195deg, #49a3f1, #1A73E8)' }}
            onClick={handleGetPaidJobs}
          >
            Parcels Paid
          </button>
          <button
            className="px-4 py-2 text-white rounded mr-4"
            style={{ background: 'linear-gradient(195deg, #49a3f1, #1A73E8)' }}
            onClick={handleGetAllJobs}
          >
            All Parcels
          </button>
        </div>
        <div className="w-full">
          <DataTable
            table={dataTableData}
            initialState={dataTableData.initialState}
            canSearch
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    </main>
  );
}

export default PF_All_List;

