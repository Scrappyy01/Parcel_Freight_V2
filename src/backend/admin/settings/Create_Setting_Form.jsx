'use client';

import React, { Fragment } from "react";
import axiosInstance from "../../../utils/axiosInstance";

const Create_Setting_Form = ({ handleCloseNewForm }) => {
  const [key, setKey] = React.useState("");
  const [value, setValue] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "key":
        setKey(value);
        break;
      case "value":
        setValue(value);
        break;
      case "description":
        setDescription(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    let submitData = {
      key: key,
      value: value,
      description: description,
    };

    axiosInstance
      .post(`/admin/settings`, submitData)
      .then((response) => {
        const newSetting = {
          id: response.data.id,
          key: response.data.key,
          value: response.data.value,
          description: response.data.description,
        };

        handleCloseNewForm({ close: true, newSetting });
      })
      .catch((error) => {
        console.error("Error creating setting: ", error);
      });
  };

  return (
    <Fragment>
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="w-[30%]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Key *</label>
            <input
              type="text"
              value={key}
              name="key"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="w-[30%]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
            <input
              type="text"
              value={value}
              name="value"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="w-[35%]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={description}
              name="description"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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

export default Create_Setting_Form;

