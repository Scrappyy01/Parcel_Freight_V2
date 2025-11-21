'use client';

import React, { Fragment } from "react";
import _ from "lodash";

import axiosInstance from "../../../utils/axiosInstance";

import {
  R_NUMBER,
  R_UPPERCASE,
  R_LOWERCASE,
  R_SPECIALCHARS,
} from "../../../utils/constant";
import { set } from "date-fns";

const Create_Api_Client_Form = ({ handleCloseNewApiClientForm, users }) => {
  const [clientUserId, setClientUserId] = React.useState("");
  const [clientName, setClientName] = React.useState("");
  const [clientEmail, setClientEmail] = React.useState("");
  const [clientKid, setClientKid] = React.useState("");
  const [clientSecret, setClientSecret] = React.useState("");
  const [formErrors, setFormErrors] = React.useState({
    clientName: "",
    clientEmail: "",
    clientKid: "",
    clientSecret: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "clientName":
        setClientName(value);
        break;
      case "clientEmail":
        setClientEmail(value);
        break;
      case "clientKid":
        setClientKid(value);
        break;
      case "clientSecret":
        setClientSecret(value);
        break;
      case "clientUserid":
        setClientUserId(value);
        const user = users.find((user) => user.id === value);
        setClientEmail(user ? user.email : clientEmail || "");
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    let submitData = {
      userId: clientUserId,
      clientName: clientName,
      clientEmail: clientEmail,
      clientKid: clientKid,
      clientSecret: clientSecret,
    };

    if (clientName.trim() === "") {
      setFormErrors((prev) => ({
        ...prev,
        clientName: "Client Name is required.",
      }));
      return;
    } else {
      setFormErrors((prev) => ({
        ...prev,
        clientName: "",
      }));
    }
    if (clientEmail.trim() === "") {
      setFormErrors((prev) => ({
        ...prev,
        clientEmail: "Client Email is required.",
      }));
      return;
    } else {
      setFormErrors((prev) => ({
        ...prev,
        clientEmail: "",
      }));
    }
    if (clientKid.trim() === "") {
      setFormErrors((prev) => ({
        ...prev,
        clientKid: "Client Key is required.",
      }));
      return;
    } else {
      setFormErrors((prev) => ({
        ...prev,
        clientKid: "",
      }));
    }
    if (clientSecret.trim() === "") {
      setFormErrors((prev) => ({
        ...prev,
        clientSecret: "Client Secret is required.",
      }));
      return;
    } else {
      setFormErrors((prev) => ({
        ...prev,
        clientSecret: "",
      }));
    }

    axiosInstance
      .post(`/admin/api_client`, submitData)
      .then((response) => {
        let newUser = !!clientUserId ? null : response.data.data.user || null;
        newUser = {
          ...newUser,
          roles: [{ name: response.data.data.role || null }],
        };

        handleCloseNewApiClientForm({ close: true, newUser });
      })
      .catch((error) => {
        let emailError = "";
        let kidError = "";
        let newUser = null;
        if (error.response) {
          if (
            error.response.data.message?.includes("users.users_email_unique")
          ) {
            emailError = "Email already exists.";
          }

          if (
            error.response.data.message?.includes(
              "api_clients.api_clients_kid_unique"
            )
          ) {
            kidError = "Key exists and change to another one.";
          }

          if (error.response.data.user) {
            newUser = error.response.data.user;
          }
        }

        setFormErrors({ clientEmail: emailError, clientKid: kidError });

        if (newUser) {
          handleCloseNewApiClientForm({ close: false, newUser });
        }
      })
      .finally();
  };

  const handleGenerateKeySecret = (length = 12) => {
    const preKidChars = "ck_partner_prod_";
    const preSecretChars = "cs_partner_prod_";

    const newKid = preKidChars + generateRandomString(20);
    const newSecret = preSecretChars + generateRandomString(33);

    setClientKid(newKid);
    setClientSecret(newSecret);
  };

  const generateRandomString = (length) => {
    const characters = R_NUMBER + R_LOWERCASE + R_UPPERCASE;
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const copyKeySecret = () => {
    const keySecret = `Client Key: ${clientKid}\nClient Secret: ${clientSecret}`;
    navigator.clipboard.writeText(keySecret).then(
      () => {},
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <Fragment>
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="w-[27%]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
            <input
              type="text"
              value={clientName}
              name="clientName"
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.clientName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.clientName && (
              <p className="text-red-600 text-sm mt-1">{formErrors.clientName}</p>
            )}
          </div>
          <div className="w-[27%]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Email *</label>
            <input
              type="email"
              value={clientEmail}
              name="clientEmail"
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.clientEmail ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.clientEmail && (
              <p className="text-red-600 text-sm mt-1">{formErrors.clientEmail}</p>
            )}
          </div>
          <div className="w-[27%]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Client User Id</label>
            <select
              value={clientUserId}
              name="clientUserid"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={0}>Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.id} - {user.name} : [{user.role}]
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="w-[60%]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Key *</label>
            <input
              type="text"
              value={clientKid}
              name="clientKid"
              disabled={true}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded bg-gray-100 ${
                formErrors.clientKid ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.clientKid && (
              <p className="text-red-600 text-sm mt-1">{formErrors.clientKid}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <div className="w-[60%]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Secret *</label>
            <input
              type="text"
              value={clientSecret}
              name="clientSecret"
              disabled={true}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded bg-gray-100 ${
                formErrors.clientSecret ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.clientSecret && (
              <p className="text-red-600 text-sm mt-1">{formErrors.clientSecret}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleGenerateKeySecret()}
            className="px-4 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-50"
          >
            Generate Client Key and Secret
          </button>
          <button
            type="button"
            onClick={() => copyKeySecret()}
            className="px-4 py-2 border border-green-700 text-green-700 rounded hover:bg-green-50"
          >
            Copy Client Key and Secret
          </button>
        </div>

        <hr className="my-4" />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => handleCloseNewApiClientForm({ close: true })}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-white rounded"
            style={{ background: 'linear-gradient(195deg, #49a3f1, #1A73E8)' }}
          >
            Save
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default Create_Api_Client_Form;

