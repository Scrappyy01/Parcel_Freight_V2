'use client';

import React from "react";
import EditUserForm from "./Edit_User_Form";
import CreateUserForm from "./Create_User_Form";
import CreateApiClientForm from "./Create_Api_Client_Form";

import axiosInstance from "../../../utils/axiosInstance";
import DataTable from "../../../examples/Tables/DataTable";
import DataTableBodyCell from "../../../examples/Tables/DataTable/DataTableBodyCell";
import Modal from "@/components/ui/ui/Modal";

const parseRoleLabel = (user) => {
  if (typeof user?.role === "string" && user.role.trim()) {
    return user.role;
  }

  if (Array.isArray(user?.roles) && user.roles.length) {
    return (
      user.roles
        .map((role) => role?.name || role)
        .filter(Boolean)
        .join(", ") || "No Role Assigned"
    );
  }

  if (user?.role && typeof user.role === "object") {
    return (
      Object.keys(user.role)
        .filter((key) => user.role[key])
        .join(", ") || "No Role Assigned"
    );
  }

  return "No Role Assigned";
};

const formatUserRow = (user) => ({
  id: user?.id ?? "",
  name: user?.name ?? "",
  email: user?.email ?? "",
  role: parseRoleLabel(user),
  status: user?.status ?? user?.account_status ?? "",
});

const User_Content = () => {
  const [users, setUsers] = React.useState([]);
  const [userGrid, setUserGrid] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [openNew, setOpenNew] = React.useState(false);
  const [openClient, setOpenClient] = React.useState(false);
  const [openNewClient, setOpenNewClient] = React.useState(false);

  const [user, setUser] = React.useState({
    id: "",
    name: "",
    email: "",
    role: "",
    status: "",
  });

  const roleInit = {
    admin: false,
    staff: false,
    trade: false,
    user: false,
    ecommerce: false,
  };

  const userInit = {
    id: "",
    name: "",
    email: "",
    role: "",
    status: "",
  };

  const [currentRole, setCurrentRole] = React.useState(roleInit);

  const userData = {
    columns: [
      { Header: "ID", accessor: "id", width: "15%" },
      { Header: "Name", accessor: "name" },
      { Header: "Email", accessor: "email" },
      { Header: "Role", accessor: "role" },
      { Header: "Status", accessor: "status" },
    ],
    rows: users,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  };

  const handleRowClick = (row) => {
    const rowData = row?.original || {};
    setUser({
      id: rowData.id ?? row?.cells?.[0]?.value ?? "",
      name: rowData.name ?? row?.cells?.[1]?.value ?? "",
      email: rowData.email ?? row?.cells?.[2]?.value ?? "",
      role: rowData.role ?? row?.cells?.[3]?.value ?? "",
      status: rowData.status ?? row?.cells?.[4]?.value ?? "",
    });
    setOpen(true);
  };

  const getRows = (data) => {
    return data.map((user) => formatUserRow(user));
  };

  React.useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("/admin/users");
        setUsers(getRows(response.data));
        setUserGrid(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    })();
  }, []);

  const handleCreateUser = () => {
    setOpenNew(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUser(userInit);
  };

  const handleCloseNew = () => {
    setOpenNew(false);
    setUser(userInit);
  };

  const handleCreateApiClient = () => {
    console.log("Open Create API Client Form");
    setOpenClient(true);
  };

  const handleCloseClient = () => {
    setOpenClient(false);
    setUser(userInit);
  };

  const handleCloseNewClient = () => {
    setOpenNewClient(false);
    setUser(userInit);
  };

  const style = {
    width: "80%",
  };

  const handleCloseForm = (data) => {
    if (data.submitData) {
      const updatedRow = formatUserRow(data.submitData);
      setUsers((prev) =>
        prev.map((userRow) =>
          userRow.id === updatedRow.id ? updatedRow : userRow
        )
      );
      setUser(updatedRow);
    }
    if (data.close) {
      setOpen(false);
      setUser(userInit);
    }
  };
  const handleCloseNewForm = (data) => {
    if (data.newUser) {
      const newRow = formatUserRow(data.newUser);
      setUsers((prev) => [newRow, ...prev]);
    }
    if (data.close) {
      setOpenNew(false);
      setUser(userInit);
    }
  };
  const handleCloseApiClientForm = (data) => {
    if (data.submitData) {
      const updatedRow = formatUserRow(data.submitData);
      setUsers((prev) =>
        prev.map((userRow) =>
          userRow.id === updatedRow.id ? updatedRow : userRow
        )
      );
    }
    if (data.close) {
      setOpenClient(false);
      setUser(userInit);
    }
  };
  const handleCloseNewApiClientForm = (data) => {
    if (data.newUser) {
      const newUserRow = formatUserRow(data.newUser);
      setUsers((prev) => [newUserRow, ...prev]);
    }
    if (data.close) {
      setOpenClient(false);
      setUser(userInit);
    }
  };

  return (
    <main className="flex-grow bg-gray-50 p-6">
      <div className="flex flex-col items-center mx-6 pb-10 mt-0 md:mt-0 space-y-4">
        <div className="w-full flex justify-end">
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-4">Users:</h3>
          </div>
          <button
            className="px-4 py-2 text-white rounded mr-4"
            style={{ background: 'linear-gradient(195deg, #49a3f1, #1A73E8)' }}
            onClick={handleCreateUser}
          >
            New User
          </button>
          <button
            className="px-4 py-2 text-white rounded mr-4"
            style={{ background: 'linear-gradient(195deg, #49a3f1, #1A73E8)' }}
            onClick={handleCreateApiClient}
          >
            New API Client
          </button>
        </div>

        <div className="w-full">
          <DataTable
            key="user-data-table"
            table={userData}
            getRowId={(row) => row.id}
            initialState={userData.initialState}
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
            <Modal isOpen={open} onClose={handleClose} title="Edit User">
              <div style={{ width: style.width }}>
                <EditUserForm user={user} handleCloseForm={handleCloseForm} />
              </div>
            </Modal>
          )}

          {openNew && (
            <Modal isOpen={openNew} onClose={handleCloseNew} title="Create User">
              <div style={{ width: style.width }}>
                <CreateUserForm handleCloseNewForm={handleCloseNewForm} />
              </div>
            </Modal>
          )}

          {openClient && (
            <Modal isOpen={openClient} onClose={handleCloseClient} title="Create API Client">
              <div style={{ width: style.width }}>
                <CreateApiClientForm
                  handleCloseNewApiClientForm={handleCloseNewApiClientForm}
                  users={users}
                />
              </div>
            </Modal>
          )}
        </div>
      </div>
    </main>
  );
};

export default User_Content;

