'use client';

import { useState, useEffect } from "react";
import _ from "lodash";

import axiosInstance from "../../../utils/axiosInstance";
import DataTable from "../../../examples/Tables/DataTable";
import DataTableBodyCell from "../../../examples/Tables/DataTable/DataTableBodyCell";
import Modal from "@/components/ui/ui/Modal";
import EditTPExpressForm from "./Edit_TPExpress_Form";

const Express_Content = () => {
  const [thirdPartyExpresses, setThirdPartyExpresses] = useState([]);

  const tpexpressInit = {
    id: "",
    name: "",
    description: "",
    express_code: "",
    service_name: "",
    category: "",
  };

  const [thirdPartyExpress, setThirdPartyExpress] = useState(tpexpressInit);
  const [open, setOpen] = useState(false);

  const style = {
    width: "80%",
  };

  const thirdPartyExpressData = {
    columns: [
      { Header: "ID", accessor: "id", with: "15%" },
      { Header: "Name", accessor: "name" },
      { Header: "Description", accessor: "description" },
      { Header: "Express Code", accessor: "express_code" },
      { Header: "Service", accessor: "service_name" },
      { Header: "Category", accessor: "category" },
    ],
    rows: thirdPartyExpresses,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(
          "/admin/third_party_expresses"
        );

        if (response.data) {
          setThirdPartyExpresses(getRows(response.data));
        }
      } catch (error) {
        console.error("Error fetching third party expresses: ", error);
      }
    })();
  }, []);

  const getRows = (data) => {
    return data.map((express) => ({
      id: express.id,
      name: express.name,
      description: express.description,
      express_code: express.express_code,
      service_name: express.service_name,
      category:
        express.freight_expresses
          .map((express) => _.startCase(express.name))
          .join(", ") || "",
    }));
  };

  const handleRowClick = (row) => {
    setThirdPartyExpress({
      id: row.cells[0].value,
      name: row.cells[1].value,
      description: row.cells[2].value,
      express_code: row.cells[3].value,
      service_name: row.cells[4].value,
      category: row.cells[5].value,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseForm = (data) => {
    if (data.submitData) {
      setThirdPartyExpresses(
        thirdPartyExpresses.map((tp_express) => {
          if (tp_express.id === data.submitData.id) {
            return data.submitData;
          }
          return tp_express;
        })
      );
    }

    if (data.close) {
      setOpen(false);
      setThirdPartyExpress(tpexpressInit);
    }
  };

  return (
    <main className="flex-grow bg-gray-50 p-6">
      <div className="flex flex-col items-center mx-6 pb-10 mt-0 md:mt-0 space-y-4">
        <div className="w-full">
          <h3 className="text-xl font-semibold mb-4">Mapping Express:</h3>
        </div>

        <div className="w-full">
          <DataTable
            key="user-data-table"
            table={thirdPartyExpressData}
            getRowId={(row) => row.id}
            initialState={thirdPartyExpresses.initialState}
            canSearch
            onRowClick={handleRowClick}
            components={{
              Cell: (params) => {
                <DataTableBodyCell
                  key={`${params.row.id}-${params.field}`}
                  value={params.value}
                  row={params.row}
                />;
              },
            }}
          />
          {open && (
            <Modal isOpen={open} onClose={handleClose} title="Edit Express">
              <div style={{ width: style.width }}>
                <EditTPExpressForm
                  tp_express={thirdPartyExpress}
                  handleCloseForm={handleCloseForm}
                />
              </div>
            </Modal>
          )}
        </div>
      </div>
    </main>
  );
};

export default Express_Content;

