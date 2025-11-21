'use client';

import { useState, useEffect } from "react";
import { Checkbox } from "@mui/material";
import DataTable from "../../../examples/Tables/DataTable";
import Modal from "@/components/ui/ui/Modal";
import EditSettingForm from "./Edit_Setting_Form";
import CreateSettingForm from "./Create_Setting_Form";
import axiosInstance from "../../../utils/axiosInstance";

const Settings_Content = () => {
  const [settings, setSettings] = useState([]);
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [open, setOpen] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [selectedSettings, setSelectedSettings] = useState([]);

  const style = {
    width: "80%",
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedSettings(settings.map((s) => s.id));
    } else {
      setSelectedSettings([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedSettings((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedSettings.length === 0) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedSettings.length} selected settings? This action cannot be undone.`
    );
    if (!confirmDelete) return;
    try {
      await Promise.all(
        selectedSettings.map((id) =>
          axiosInstance.delete(`/admin/settings/${id}`)
        )
      );
      setSettings(
        settings.filter((setting) => !selectedSettings.includes(setting.id))
      );
      setSelectedSettings([]);
    } catch (error) {
      alert("Failed to delete one or more settings. Please try again.");
    }
  };

  const settingsData = {
    columns: [
      {
        Header: (
          <Checkbox
            checked={
              selectedSettings.length === settings.length && settings.length > 0
            }
            indeterminate={
              selectedSettings.length > 0 &&
              selectedSettings.length < settings.length
            }
            onChange={handleSelectAll}
            inputProps={{ "aria-label": "select all settings" }}
          />
        ),
        accessor: "select",
        width: "5%",
        Cell: ({ row }) => (
          <Checkbox
            checked={selectedSettings.includes(row.original.id)}
            onChange={() => handleSelectOne(row.original.id)}
            onClick={(e) => e.stopPropagation()}
            inputProps={{ "aria-label": `select setting ${row.original.id}` }}
          />
        ),
        disableSortBy: true,
        disableSorting: true,
        sortable: false,
        isSortable: false,
        sort: false,
        sortType: false,
      },
      { Header: "ID", accessor: "id", width: "10%" },
      { Header: "Key", accessor: "key", width: "30%" },
      { Header: "Value", accessor: "value", width: "30%" },
      { Header: "Description", accessor: "description", width: "20%" },
      {
        Header: "Actions",
        accessor: "actions",
        width: "15%",
        Cell: ({ row }) => (
          <button
            className="px-3 py-1 text-white rounded text-sm"
            style={{ background: 'linear-gradient(195deg, #ec407a, #d81b60)' }}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSetting(row.original.id);
            }}
          >
            Delete
          </button>
        ),
      },
    ],
    rows: settings,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("/admin/settings");
        if (response.data) {
          setSettings(getRows(response.data));
        }
      } catch (error) {
        console.error("Error fetching settings: ", error);
      }
    })();
  }, []);

  const getRows = (data) => {
    return data.map((setting) => ({
      id: setting.id,
      key: setting.key,
      value: setting.value,
      description: setting.description,
    }));
  };

  const handleRowClick = (row) => {
    setSelectedSetting({
      id: row.cells[1].value,
      key: row.cells[2].value,
      value: row.cells[3].value,
      description: row.cells[4].value,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSetting(null);
  };

  const handleCreateSetting = () => {
    setOpenNew(true);
  };

  const handleCloseNew = () => {
    setOpenNew(false);
  };

  const handleCloseForm = (data) => {
    if (data.submitData) {
      setSettings(
        settings.map((setting) =>
          setting.id === data.submitData.id ? data.submitData : setting
        )
      );
    }
    if (data.close) {
      setOpen(false);
      setSelectedSetting(null);
    }
  };

  const handleCloseNewForm = (data) => {
    if (data.newSetting) {
      setSettings([data.newSetting, ...settings]);
    }
    if (data.close) {
      setOpenNew(false);
    }
  };

  const handleDeleteSetting = async (settingId) => {
    const settingToDelete = settings.find(
      (setting) => setting.id === settingId
    );
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the setting "${settingToDelete?.key}"? This action cannot be undone.`
    );

    if (confirmDelete) {
      try {
        await axiosInstance.delete(`/admin/settings/${settingId}`);
        setSettings(settings.filter((setting) => setting.id !== settingId));
      } catch (error) {
        console.error("Error deleting setting: ", error);
        alert("Failed to delete setting. Please try again.");
      }
    }
  };

  return (
    <main className="flex-grow bg-gray-50 p-6">
      <div className="flex flex-col items-center mx-6 pb-10 mt-0 md:mt-0 space-y-4">
        <div className="w-full flex justify-end items-center gap-4">
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-4">Settings</h3>
          </div>
          <button
            className="px-4 py-2 text-white rounded"
            style={{ background: 'linear-gradient(195deg, #ec407a, #d81b60)' }}
            disabled={selectedSettings.length === 0}
            onClick={handleBulkDelete}
          >
            Delete Selected
          </button>
          <button
            className="px-4 py-2 text-white rounded mr-4"
            style={{ background: 'linear-gradient(195deg, #49a3f1, #1A73E8)' }}
            onClick={handleCreateSetting}
          >
            New Setting
          </button>
        </div>

        <div className="w-full">
          <DataTable
            key="settings-data-table"
            table={settingsData}
            getRowId={(row) => row.id}
            initialState={settingsData.initialState}
            canSearch
            onRowClick={handleRowClick}
          />
          {open && (
            <Modal isOpen={open} onClose={handleClose} title="Edit Setting">
              <div style={{ width: style.width }}>
                <EditSettingForm
                  setting={selectedSetting}
                  handleCloseForm={handleCloseForm}
                />
              </div>
            </Modal>
          )}

          {openNew && (
            <Modal isOpen={openNew} onClose={handleCloseNew} title="Create Setting">
              <div style={{ width: style.width }}>
                <CreateSettingForm handleCloseNewForm={handleCloseNewForm} />
              </div>
            </Modal>
          )}
        </div>
      </div>
    </main>
  );
};

export default Settings_Content;

