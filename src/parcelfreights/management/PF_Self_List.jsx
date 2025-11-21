'use client';

import DataTable from "@/examples/Tables/DataTable";
import { useState, useEffect, Fragment, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useRouter } from "next/navigation";

import axiosInstance from "@/utils/axiosInstance";
import { formatDate } from "@/utils/helpers";

function PF_Self_List() {
  const { pf_user } = useContext(UserContext);
  console.log("🚀 ~ PF_Self_List ~ pf_user:", pf_user.user_roles);

  // let queryOptions = null;
  const [tableData, setTableData] = useState([]);
  const [allData, setAllData] = useState([]);

  const router = useRouter();

  const [selectedRow, setSelectedRow] = useState(null);

  const [jobNo, setJobNo] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let response = await axiosInstance.post("freight/myparcels");

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
    setJobNo(row.values.job_no); // Extract the job number from the row data
    setSelectedRow(row);
    // const jobNo = row.values.job_no; // Extract the job number from the row data
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
    initialState: {},
  };

  return (
    <Fragment>
      <div className="pt-4 pb-6 Job-Management-Wrapper">
        <div className="mb-6">
          <div className="flex justify-center">
            <div className="w-full lg:w-3/4">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 leading-tight">
                  <h5 className="text-xl font-medium">
                    My Parcel Freights
                  </h5>
                </div>
                <div className="ml-auto pr-5 flex flex-col">
                  <div className="flex justify-end flex-row">
                    <button
                      className="px-4 py-2 rounded text-white font-medium mr-4"
                      style={{ background: 'linear-gradient(195deg, #49a3f1, #1A73E8)' }}
                      onClick={handleGetUnpaidJobs}
                    >
                      Parcels Quoted Only
                    </button>
                    <button
                      className="px-4 py-2 rounded text-white font-medium mr-4"
                      style={{ background: 'linear-gradient(195deg, #49a3f1, #1A73E8)' }}
                      onClick={handleGetPaidJobs}
                    >
                      Parcels Paid
                    </button>
                    <button
                      className="px-4 py-2 rounded text-white font-medium mr-4"
                      style={{ background: 'linear-gradient(195deg, #49a3f1, #1A73E8)' }}
                      onClick={handleGetAllJobs}
                    >
                      All Parcels
                    </button>
                  </div>
                </div>
                <DataTable
                  table={dataTableData}
                  initialState={dataTableData.initialState}
                  canSearch
                  onRowClick={handleRowClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default PF_Self_List;



