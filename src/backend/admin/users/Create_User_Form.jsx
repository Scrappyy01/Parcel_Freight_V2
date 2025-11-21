'use client';

import React, { Fragment } from "react";
import _ from "lodash";

import axiosInstance from "../../../utils/axiosInstance";
import { Checkbox } from "@mui/material";

import {
  ROLES,
  R_NUMBER,
  R_UPPERCASE,
  R_LOWERCASE,
  R_SPECIALCHARS,
} from "../../../utils/constant";

const Edit_User_Form = ({ handleCloseNewForm }) => {
  const [userId, setUserId] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [status, setStatus] = React.useState("active");
  const [showPassword, setShowPassword] = React.useState(false);

  const roleInit = {
    admin: false,
    staff: false,
    trade: false,
    user: false,
    ecommerce: false,
  };

  const [currentRole, setCurrentRole] = React.useState(roleInit);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "status":
        setStatus(value);
        break;
      default:
        break;
    }
  };
  const handleChangeCheckbox = (e) => {
    const { name, checked } = e.target;
    setCurrentRole((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = () => {
    let submitData = {
      id: userId,
      name: username,
      email: email,
      password: password,
      role: currentRole,
      status,
    };

    axiosInstance
      .post(`/admin/user`, submitData)
      .then((response) => {
        const newUser = {
          ...response.data.user,
          status: response.data.user?.status || status,
          role: Object.keys(response.data.role)
            .filter((key) => response.data.role[key])
            .join(", "),
        };

        handleCloseNewForm({ close: true, newUser });
      })
      .catch((error) => {
        console.error(error.getMessage);
      })
      .finally();
  };

  const handleGeneratePassword = (length = 12) => {
    const allChars = R_NUMBER + R_LOWERCASE + R_UPPERCASE + R_SPECIALCHARS;
    let password = [
      R_LOWERCASE[Math.floor(Math.random() * R_LOWERCASE.length)],
      R_NUMBER[Math.floor(Math.random() * R_NUMBER.length)],
      R_UPPERCASE[Math.floor(Math.random() * R_UPPERCASE.length)],
      R_SPECIALCHARS[Math.floor(Math.random() * R_SPECIALCHARS.length)],
    ].join("");

    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    setPassword(
      password
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("")
    );
  };

  return (
    <Fragment>
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={username}
              name="username"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={email}
              name="email"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-2 items-end">
          <div className="w-[27%]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {["active", "inactive", "suspended", "pending"].map((option) => (
                <option key={option} value={option}>
                  {_.capitalize(option)}
                </option>
              ))}
            </select>
          </div>

          <div className="w-[45%]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                name="password"
                onChange={handleChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1">
            <button
              type="button"
              onClick={() => handleGeneratePassword()}
              className="w-full px-3 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-50"
            >
              Generate Password
            </button>
          </div>
        </div>

        <hr className="my-4" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
          <div className="flex gap-4">
            {ROLES.map((role) => (
              <label key={role} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={currentRole[role]}
                  onChange={handleChangeCheckbox}
                  name={role}
                />
                <span className="text-sm">{_.capitalize(role)}</span>
              </label>
            ))}
          </div>
        </div>

        <hr className="my-4" />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => handleCloseNewForm({ close: true })}
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

export default Edit_User_Form;

