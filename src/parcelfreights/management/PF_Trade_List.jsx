'use client';

import { useState, useEffect, Fragment, useContext } from "react";
import { UserContext } from "./../../contexts/UserContext";
import { useRouter } from "next/navigation";

import { Button, Card } from "@/components/ui/ui";

import DataTable from "@/examples/Tables/DataTable";

import axiosInstance from "@/utils/axiosInstance";
import { formatDate } from "@/utils/helpers";

function PF_Trade_List() {
  const { pf_user } = useContext(UserContext);

  // let queryOptions = null;
  const [tableData, setTableData] = useState([]);
  const [allData, setAllData] = useState([]);

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
    <Fragment>
      <div className="py-8">
        <div className="w-full">
          <div className="grid grid-cols-1 gap-6">
            <div className="w-full">
              <Card>
                <Card.Header>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-[#132B43]">Trade Parcel Freights</h2>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="p-6">
                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-3 justify-end mb-6">
                      <Button
                        variant="contained"
                        color="info"
                        size="medium"
                        onClick={handleGetUnpaidJobs}
                      >
                        Parcels Quoted Only
                      </Button>
                      <Button
                        variant="contained"
                        color="info"
                        size="medium"
                        onClick={handleGetPaidJobs}
                      >
                        Parcels Paid
                      </Button>
                      <Button
                        variant="contained"
                        color="info"
                        size="medium"
                        onClick={handleGetAllJobs}
                      >
                        All Parcels
                      </Button>
                    </div>

                    {/* Data Table */}
                    <DataTable
                      table={dataTableData}
                      initialState={dataTableData.initialState}
                      canSearch
                      showTotalEntries
                      isSorted
                      entriesPerPage={{ defaultValue: 10, entries: [5, 10, 15, 20, 25] }}
                      pagination={{ variant: "gradient", color: "info" }}
                      onRowClick={handleRowClick}
                    />
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default PF_Trade_List;



