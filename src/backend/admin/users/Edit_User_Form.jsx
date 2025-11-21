'use client';

import React, { useState, Fragment, useEffect } from "react";
import _ from "lodash";
import axiosInstance from "../../../utils/axiosInstance";
import { Checkbox } from "@mui/material";
import "./edit_user_form.css";

import {
  ROLES,
  R_NUMBER,
  R_UPPERCASE,
  R_LOWERCASE,
  R_SPECIALCHARS,
} from "../../../utils/constant";

const Edit_User_Form = ({ user, handleCloseForm }) => {
  const [userId] = useState(user.id);
  const [username, setUsername] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(
    user.status || user.account_status || "active"
  );
  // Start empty to avoid sticky placeholder/default-value issues
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const roleInit = {
    admin: false,
    staff: false,
    trade: false,
    user: false,
    ecommerce: false,
  };
  const [currentRole, setCurrentRole] = useState(roleInit);

  useEffect(() => {
    const roles = user.role;
    if (roles && roles !== "No Role Assigned") {
      roles.split(", ").forEach((r) => {
        if (roleInit.hasOwnProperty(r)) {
          setCurrentRole((prev) => ({ ...prev, [r]: true }));
        }
      });
    }
  }, [role]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    else if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
    else if (name === "status") setStatus(value);
  };

  const handleChangeCheckbox = (e) => {
    const { name, checked } = e.target;
    setCurrentRole((prev) => ({ ...prev, [name]: checked }));
  };

  const handleGeneratePassword = (length = 12) => {
    const allChars = R_NUMBER + R_LOWERCASE + R_UPPERCASE + R_SPECIALCHARS;
    let next = [
      R_LOWERCASE[Math.floor(Math.random() * R_LOWERCASE.length)],
      R_NUMBER[Math.floor(Math.random() * R_NUMBER.length)],
      R_UPPERCASE[Math.floor(Math.random() * R_UPPERCASE.length)],
      R_SPECIALCHARS[Math.floor(Math.random() * R_SPECIALCHARS.length)],
    ].join("");

    for (let i = next.length; i < length; i++) {
      next += allChars[Math.floor(Math.random() * allChars.length)];
    }

    next = next
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
    setPassword(next);
    setShowPassword(true); // reveal so the admin can copy
  };

  const handleSubmit = () => {
    let submitData = {
      id: userId,
      name: username,
      email: email,
      role: currentRole,
      status: status,
      // Only include password if set; avoids overwriting with empty/placeholder
      ...(password ? { password } : {}),
    };

    axiosInstance
      .patch(`/admin/user/${userId}`, submitData)
      .then(() => {
        submitData = {
          ...submitData,
          role: Object.keys(submitData.role)
            .filter((key) => submitData.role[key])
            .join(", "),
        };
        handleCloseForm({ close: true, submitData });
      })
      .catch((error) => {
        console.error(error?.getMessage || error);
      });
  };

  return (
    <Fragment>
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="w-[10%]">
            <label className="block text-sm font-medium text-gray-700 mb-1">User Id</label>
            <input
              disabled
              type="text"
              value={userId}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
              readOnly
            />
          </div>

          <div className="w-[40%]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={username}
              name="username"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="w-[40%]">
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

        <div className="flex gap-2">
          <div className="w-[40%]">
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

          <div className="w-[40%]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                name="password"
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                autoComplete="new-password"
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

          <div className="w-[13%] flex items-end">
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
                  checked={currentRole[role] || false}
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
            onClick={() => handleCloseForm({ close: true })}
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

