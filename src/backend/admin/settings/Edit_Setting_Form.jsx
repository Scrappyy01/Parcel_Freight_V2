'use client';

import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";

const EditSettingForm = ({ setting, handleCloseForm }) => {
  const [formData, setFormData] = useState({
    id: "",
    key: "",
    value: "",
    description: "",
  });

  useEffect(() => {
    if (setting) {
      setFormData(setting);
    }
  }, [setting]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .put(`/admin/settings/${formData.id}`, formData)
      .then((response) => {
        handleCloseForm({ submitData: formData, close: true });
      })
      .catch((error) => {
        console.error("Error updating setting: ", error);
      });
  };

  const handleCancel = () => {
    handleCloseForm({ close: true });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="id" value={formData.id} />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Key *</label>
        <input
          type="text"
          name="key"
          value={formData.key}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
        <input
          type="text"
          name="value"
          value={formData.value}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white rounded"
          style={{ background: 'linear-gradient(195deg, #49a3f1, #1A73E8)' }}
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EditSettingForm;

