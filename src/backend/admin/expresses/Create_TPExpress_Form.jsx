'use client';

import { Fragment, useContext, useEffect, useState } from "react";
import _ from "lodash";

import axiosInstance from "../../../utils/axiosInstance";
import { Checkbox } from "@mui/material";

import { UserContext } from "../../../contexts/UserContext";

const Edit_TPExpress_Form = ({ tp_express, handleCloseForm }) => {
  const tp_express = {
    name: "",
    description: "",
    express_code: "",
    service_name: "",
    category: "",
  };
  const [express, setExpress] = useState(tp_express);
  const [id, setId] = useState(tp_express.id);
  const [name, setName] = useState(tp_express.name);
  const [description, setDescription] = useState(tp_express.description);
  const [expressCode, setExpressCode] = useState(tp_express.express_code);
  const [serviceName, setServiceName] = useState(tp_express.service_name);
  const [category, setCategory] = useState([]);

  const [currentCategory, setCurrentCategory] = useState([]);
  const { pf_user, setPf_User } = useContext(UserContext);
  const [userId, setUserId] = useState(pf_user?.id || null);

  useEffect(() => {
    let categories = express.category;
    let categoriesArr = [];
    if (categories && categories.length > 0) {
      categoriesArr = categories.toLowerCase().split(", ");
    }

    const updatedCategory = {};
    axiosInstance
      .get(`/admin/freightexpress`)
      .then((response) => {
        if (response.data) {
          setCategory(response.data.map((express) => express.name));

          response.data.forEach((c) => {
            updatedCategory[c.name] = categoriesArr.includes(
              c.name.toLowerCase()
            );
            setCurrentCategory((prev) => ({
              ...prev,
              ...updatedCategory,
            }));
          });
        }
      })
      .catch((error) => {
        console.error(error.getMessage);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "tp_express_name":
        setName(value);
        break;
      case "tp_express_description":
        setDescription(value);
        break;
      case "tp_express_code":
        setExpressCode(value);
        break;
      case "tp_express_service_name":
        setServiceName(value);
        break;
      case "tp_express_category":
        setCategory(value);
        break;
      default:
        break;
    }
  };

  const handleChangeCheckbox = (e) => {
    const { name, checked } = e.target;

    const currentCategories = express.category
      .split(", ")
      .map((cat) => cat.trim())
      .filter(Boolean);

    let updatedCategories;

    if (checked) {
      updatedCategories = [...currentCategories, _.startCase(name)];
    } else {
      updatedCategories = currentCategories.filter(
        (cat) => cat.toLowerCase() !== name.toLowerCase()
      );
    }

    setExpress({
      ...express,
      category: updatedCategories.join(", "),
    });
    setCurrentCategory((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = () => {
    let submitData = {
      id: id,
      name: name,
      description: description,
      express_code: expressCode,
      service_name: serviceName,
      category: currentCategory,
      user_id: userId,
    };

    axiosInstance
      .post(`/admin/freight_tp_expresses`, submitData)
      .then((response) => {
        if (submitData.category !== "") {
          submitData = {
            ...submitData,
            category: Object.keys(submitData.category)
              .filter((key) => submitData.category[key])
              .join(", "),
          };
        }
        handleCloseForm({ close: true, submitData });
      })
      .catch((error) => {
        console.error(error.getMessage);
      });
    return;
  };

  return (
    <Fragment>
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="w-[10%]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Express Id</label>
            <input
              disabled
              type="text"
              value={id}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
              readOnly
            />
          </div>
          <div className="w-[30%]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={name}
              name="tp_express_name"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="w-[50%]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={description}
              name="tp_express_description"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="w-[41%]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Express Code *</label>
            <input
              type="text"
              value={expressCode}
              name="tp_express_code"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="w-[50%]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
            <input
              type="text"
              value={serviceName}
              name="tp_express_service_name"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <hr className="my-4" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <div className="flex flex-wrap gap-4">
            {category.map((item) => {
              const selectedCategories = express.category
                .split(", ")
                .map((cat) => cat.trim().toLowerCase());
              const isChecked = selectedCategories.includes(item.toLowerCase());
              return (
                <label key={item} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={isChecked}
                    onChange={handleChangeCheckbox}
                    name={item}
                  />
                  <span className="text-sm">{_.startCase(item)}</span>
                </label>
              );
            })}
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

export default Edit_TPExpress_Form;

