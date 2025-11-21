'use client';

import { Fragment, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useRouter, usePathname } from "next/navigation";

import { Button, Card, Spinner } from "@/components/ui/ui";

import PickupSuburbField from "./PF_PickupSuburbField.jsx";
import DeliverySuburbField from "./PF_DeliverySuburbField.jsx";
import PFDataRow from "./PF_DataRow.jsx";

import { UserContext } from "@/contexts/UserContext";
import PopupModal from "@/components/PopupModal/PopupModal/PopupModal.jsx";
import axiosInstance from "@/utils/axiosInstance.js";
import { ApplicationMode } from "@/contexts/ApplicationMode.js";
import PFPopupComponent from "../auth/PF_Popup_Component";
import {
  WEIGHT_LIMITATION,
  QUANTITY_LIMITATION,
  LENGTH_LIMITATION,
  WIDTH_LIMITATION,
  HEIGHT_LIMITATION,
} from "@/utils/constant";

import { validateField } from "@/utils/helpers";

const PF_SingleListing = () => {
  const { data } = useSelector((state) => state.collection);

  const currentPF_User = localStorage.getItem(`pf_user`);
  const { pf_user } = useContext(UserContext);

  const [showPriceButton, setShowPriceButton] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isDanger, setIsDanger] = useState(false);

  const router = useRouter();
  const location = usePathname();

  const [showModal, setShowModal] = useState({
    pfbutton: false,
    pfform: false,
  });
  const handleOpenModal = (e) => {
    e.preventDefault();
    setApplicationMode("Parcel Freight");
    setShowModal({ pfbutton: true, pfform: false });
  };
  const handleCloseModal = () => {
    setShowModal({ pfbutton: false, pfform: false });
    router.push("/parcel-freight/"); // Navigate to the default Parcel Freight route
  };
  const { applicationMode, setApplicationMode } = useContext(ApplicationMode);

  const [pickupSuburb, setPickupSuburb] = useState(data?.pickup_suburb || "");
  const [deliverySuburb, setDeliverySuburb] = useState(
    data?.delivery_suburb || ""
  );
  const [selectedPickupOption, setSelectedPickupOption] = useState(
    data?.pickup_building_type || null
  );
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(
    data?.delivery_building_type || null
  );
  const [totalQty, setTotalQty] = useState(0);
  const [totalKgs, setTotalKgs] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0); // the default length, width and height value is 40, 20 and 1
  const [modalShow, setModalShow] = useState(false);

  const fixedValues = {
    qty: 0,
    kgs: 0,
    length: 0,
    width: 0,
    height: 0,
    weight: 0.0,
    volume: 0,
    packagingType: null,
  };

  const [dataRows, setDataRows] = useState([]);

  useEffect(() => {
    setDataRows([{ ...fixedValues }]);
  }, []);

  const [errors, setErrors] = useState(null);

  const addRow = () => {
    const emptyPackagingType = dataRows.some((row) => {
      return !row?.packagingType || !row?.packagingType.trim();
    });

    const hasInvalidQty = dataRows.some((row) => {
      return (
        !row?.qty ||
        isNaN(row?.qty) ||
        Number(row?.qty) <= 0 ||
        row?.qty > QUANTITY_LIMITATION
      );
    });

    const hasInvalidKgs = dataRows.some(
      (row) =>
        !row?.kgs ||
        isNaN(row?.kgs) ||
        Number(row?.kgs) <= 0 ||
        row?.kgs > WEIGHT_LIMITATION
    );

    const hasInvalidLength = dataRows.some(
      (row) =>
        !row?.length ||
        isNaN(row?.length) ||
        Number(row?.length) <= 0 ||
        row?.length > LENGTH_LIMITATION
    );

    const hasInvalidWidth = dataRows.some(
      (row) =>
        !row?.width ||
        isNaN(row?.width) ||
        Number(row?.width) <= 0 ||
        row?.width > WIDTH_LIMITATION
    );

    const hasInvalidHeight = dataRows.some((row) => {
      return (
        !row?.height ||
        isNaN(row?.height) ||
        Number(row?.height) <= 0 ||
        row?.height > HEIGHT_LIMITATION
      );
    });

    setErrors((prev) => {
      const newErrors = { ...prev };
      validateField(
        emptyPackagingType,
        "packagingType",
        "Packaging Type must be selected to add another Package",
        newErrors
      );
      validateField(
        hasInvalidQty,
        "qty",
        "Qty value must be greater than 0 and a valid number to add another Package",
        newErrors
      );
      validateField(
        hasInvalidKgs,
        "kgs",
        "Kgs value must be greater than 0 and a valid number to add another Package",
        newErrors
      );
      validateField(
        hasInvalidLength,
        "length",
        "Length value must be greater than 0 and a valid number to add another Package",
        newErrors
      );
      validateField(
        hasInvalidWidth,
        "width",
        "Width value must be greater than 0 and a valid number to add another Package",
        newErrors
      );
      validateField(
        hasInvalidHeight,
        "height",
        "Height value must be greater than 0 and a valid number to add another Package",
        newErrors
      );
      return newErrors;
    });

    if (
      !emptyPackagingType &&
      !hasInvalidQty &&
      !hasInvalidKgs &&
      !hasInvalidLength &&
      !hasInvalidWidth &&
      !hasInvalidHeight
    ) {
      setDataRows([...dataRows, { ...fixedValues }]);
    }
  };

  // Function to remove a row
  const removeRow = (index) => {
    if (index < 0 || index >= dataRows.length) return; // Safeguard invalid indices

    const updatedRows = dataRows.filter((_, i) => i !== index);
    setDataRows(updatedRows);

    const sumKgs = parseFloat(
      updatedRows
        .reduce(
          (acc, row) => acc + Number(row.kgs || 0) * Number(row.qty || 0),
          0
        )
        .toFixed(2)
    );
    const sumQty = updatedRows.reduce(
      (acc, row) => acc + Number(row["qty"]),
      0
    );
    const sumVolume = updatedRows.reduce(
      (acc, row) =>
        acc +
        Number(row["length"]) * Number(row["width"]) * Number(row["height"]),
      0
    );

    setTotalKgs(sumKgs);
    setTotalQty(sumQty);
    setTotalVolume(sumVolume);
  };

  // Function to update a specific field in a specific row
  const updateRow = (rowIndex, key, value) => {
    setDataRows((prevRows) => {
      const updatedRows = [...prevRows];
      const updatedRow = { ...updatedRows[rowIndex], [key]: value };

      if (key === "qty" || key === "kgs") {
        updatedRow.weight = parseFloat(
          (Number(updatedRow.qty || 0) * Number(updatedRow.kgs || 0.0)).toFixed(
            2
          )
        );
      }

      if (["length", "width", "height"].includes(key)) {
        updatedRow.volume =
          Number(updatedRow.length || 0) *
          Number(updatedRow.width || 0) *
          Number(updatedRow.height || 0);
      }

      updatedRows[rowIndex] = updatedRow;

      // Recalculate totals
      const currentTotalQty = updatedRows.reduce(
        (acc, r) => acc + Number(r.qty || 0),
        0
      );
      const currentTotalKgs = parseFloat(
        updatedRows
          .reduce((acc, r) => acc + Number(r.weight || 0), 0)
          .toFixed(2)
      );

      const currentTotalVolume = updatedRows.reduce(
        (acc, r) => acc + Number(r.volume || 0),
        0
      );

      setErrors((prev) => {
        if (currentTotalKgs > WEIGHT_LIMITATION) {
          return {
            ...prev,
            weight: `Weight no more than ${WEIGHT_LIMITATION}kgs`,
          };
        } else {
          const { weight, ...rest } = prev || {};
          return rest;
        }
      });

      setTotalQty(currentTotalQty);
      setTotalKgs(currentTotalKgs);
      setTotalVolume(currentTotalVolume);

      return updatedRows;
    });
  };

  const [error, setError] = useState(false);
  const [ajaxError, setAjaxError] = useState("");

  // Handle form submission and prevent default behavior
  const handleSubmit = (event) => {
    event.preventDefault();
    if (currentPF_User == null || currentPF_User == "{}") {
      setModalShow(true);
      return;
    }
    const isPickupSuburbEmpty = !pickupSuburb?.trim();
    const isDeliverySuburbEmpty = !deliverySuburb?.trim();
    const isPickupOptionEmpty = !selectedPickupOption?.trim();
    const isDeliveryOptionEmpty = !selectedDeliveryOption?.trim();

    setErrors((prev) => {
      let newErrors = { ...prev };

      validateField(
        isPickupSuburbEmpty,
        "pickupSuburb",
        "Pickup Suburb cannot be empty",
        newErrors
      );
      validateField(
        isDeliverySuburbEmpty,
        "deliverySuburb",
        "Delivery Suburb cannot be empty",
        newErrors
      );
      validateField(
        isPickupOptionEmpty,
        "pickupOption",
        "Pickup Building Type must be selected",
        newErrors
      );
      validateField(
        isDeliveryOptionEmpty,
        "deliveryOption",
        "Dropoff Building Type must be Selected",
        newErrors
      );

      return newErrors;
    });

    const newRows = [...dataRows];

    const isPackagingTypeEmpty = [];
    const isQtyInvalid = [];
    const isKgsInvalid = [];
    const isLengthInvalid = [];
    const isWidthInvalid = [];
    const isHeightInvalid = [];

    dataRows.forEach((row, index) => {
      isPackagingTypeEmpty[index] =
        !row?.packagingType || !row?.packagingType.trim();
      isQtyInvalid[index] =
        !row?.qty ||
        isNaN(row?.qty) ||
        Number(row?.qty) <= 0 ||
        row?.qty > QUANTITY_LIMITATION;
      isKgsInvalid[index] =
        !row?.kgs ||
        isNaN(row?.kgs) ||
        Number(row?.kgs) <= 0 ||
        row?.kgs > WEIGHT_LIMITATION;
      isLengthInvalid[index] =
        !row?.length ||
        isNaN(row?.length) ||
        Number(row?.length) <= 0 ||
        row?.length > LENGTH_LIMITATION;
      isWidthInvalid[index] =
        !row?.width ||
        isNaN(row?.width) ||
        Number(row?.width) <= 0 ||
        row?.width > WIDTH_LIMITATION;
      isHeightInvalid[index] =
        !row?.height ||
        isNaN(row?.height) ||
        Number(row?.height) <= 0 ||
        row?.height > HEIGHT_LIMITATION;
      setErrors((prev) => {
        let newErrors = { ...prev };

        validateField(
          isPackagingTypeEmpty[index],
          "packagingType",
          "Packaging Type Required",
          newErrors
        );
        validateField(
          isQtyInvalid[index],
          "qty",
          `Invalid Quantity value(1 ~ ${QUANTITY_LIMITATION})`,
          newErrors
        );
        validateField(
          isKgsInvalid[index],
          "kgs",
          `Invalid Kgs value(1 ~ ${WEIGHT_LIMITATION})`,
          newErrors
        );
        validateField(
          isLengthInvalid[index],
          "length",
          `Invalid Length value(1 ~ ${LENGTH_LIMITATION})`,
          newErrors
        );
        validateField(
          isWidthInvalid[index],
          "width",
          `Invalid Width value(1 ~ ${WIDTH_LIMITATION})`,
          newErrors
        );
        validateField(
          isHeightInvalid[index],
          "height",
          `Invalid Height value(1 ~ ${HEIGHT_LIMITATION})`,
          newErrors
        );

        return newErrors;
      });
    });

    if (
      isPickupSuburbEmpty ||
      isDeliverySuburbEmpty ||
      isPickupOptionEmpty ||
      isDeliveryOptionEmpty ||
      isPackagingTypeEmpty.some((v) => v === true) ||
      isQtyInvalid.some((v) => v === true) ||
      isKgsInvalid.some((v) => v === true) ||
      isLengthInvalid.some((v) => v === true) ||
      isWidthInvalid.some((v) => v === true) ||
      isHeightInvalid.some((v) => v === true)
    ) {
      console.warn("Submission stopped - validation failed");
      setIsSubmitLoading(false);
      return;
    }

    setIsSubmitLoading(true);
    setDataRows(newRows);

    axiosInstance
      .post(
        `/freight/get_price`,
        {
          pickup_suburb: pickupSuburb,
          delivery_suburb: deliverySuburb,
          delivery_building_type: selectedDeliveryOption,
          pickup_building_type: selectedPickupOption,
          dataRows: dataRows,
          is_danger: isDanger,
          user_id: pf_user?.id || "",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((data) => {
        if (data.data.freight_id) {
          const stateData = {
            ...data.data,
            pickup_suburb: pickupSuburb,
            delivery_suburb: deliverySuburb,
            delivery_building_type: selectedDeliveryOption,
            pickup_building_type: selectedPickupOption,
            dataRows: dataRows,
            totalQty: totalQty,
            totalKgs: totalKgs,
            totalVolume: totalVolume,
            is_danger: isDanger,
          };
          setResponseData(stateData);
          setIsSubmitLoading(false);
          const newJobData = {
            pickup_suburb: pickupSuburb,
            delivery_suburb: deliverySuburb,
            delivery_building_type: selectedDeliveryOption,
            pickup_building_type: selectedPickupOption,
            dataRows: dataRows, // Save full dataRows array
            totalQty: totalQty,
            totalKgs: totalKgs,
            totalVolume: totalVolume,
            is_danger: isDanger,
          };
          const newSavedPackages = [];
          for (let i = 0; i < newJobData.dataRows.length; i++) {
            const row = newJobData.dataRows[i];
            newSavedPackages.push({
              id: i,
              quantity: row["qty"],
              weight: row["kgs"],
              width: row["width"],
              length: row["length"],
              height: row["height"],
            });
          }

          router.push(`/parcel-freight/${data.data.freight_id}`, {
            state: {
              ...stateData,
              isNew: true,
              freight_package: newSavedPackages,
            },
          });
        } else {
          setError(true);
          setAjaxError("No result has been returned");
          setIsSubmitLoading(false);
        }
      })
      .catch((error) => {
        setError(true);
        setAjaxError("No result has been returned");
        setIsSubmitLoading(false);
      });
  };

  const handleClick_Pickup = (building_type) => {
    setErrors((prev) => {
      const { pickupOption, ...rest } = prev || {};
      return rest;
    });
    setSelectedPickupOption(building_type);
  };
  const handleClick_Delivery = (building_type) => {
    setErrors((prev) => {
      const { deliveryOption, ...rest } = prev || {};
      return rest;
    });
    setSelectedDeliveryOption(building_type);
  };

  let pickupResidentialCSS = "btn btn-light";
  let pickupCommercialCSS = "btn btn-light";

  let deliveryResidentialCSS = "btn btn-light";
  let deliveryCommercialCSS = "btn btn-light";

  if (selectedPickupOption === "Residential") {
    pickupResidentialCSS = "btn btn-primary";
  }

  if (selectedPickupOption === "Commercial") {
    pickupCommercialCSS = "btn btn-primary";
  }

  if (selectedDeliveryOption === "Residential") {
    deliveryResidentialCSS = "btn btn-primary";
  }

  if (selectedDeliveryOption === "Commercial") {
    deliveryCommercialCSS = "btn btn-primary";
  }

  useEffect(() => {
    if (
      !data ||
      !Array.isArray(data.freight_package) ||
      data.freight_package.length === 0
    )
      return;

    const dr = data.freight_package.map((pkg) => ({
      packagingType: pkg.packaging_code || null,
      qty: pkg.quantity || 0,
      kgs: pkg.weight || 0,
      length: pkg.length || 0,
      width: pkg.width || 0,
      height: pkg.height || 0,
      weight: parseFloat(
        (Number(pkg.quantity || 0) * Number(pkg.weight || 0)).toFixed(2)
      ),
      volume:
        Number(pkg.length || 0) *
        Number(pkg.width || 0) *
        Number(pkg.height || 0),
    }));

    setDataRows(dr.length ? dr : [{ ...fixedValues }]);
    setTotalQty(dr.reduce((acc, r) => acc + Number(r.qty || 0), 0));
    setTotalKgs(
      parseFloat(
        dr.reduce((acc, r) => acc + Number(r.weight || 0), 0).toFixed(2)
      )
    );
    setTotalVolume(dr.reduce((acc, r) => acc + Number(r.volume || 0), 0));
  }, [data, location.key]);

  useEffect(() => {
    if (pf_user && typeof pf_user === "object" && pf_user.isAuthenticated) {
      setShowPriceButton(true);
    } else {
      setShowPriceButton(false);
    }
  }, [pf_user]);

  // Component's return JSX
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-[#132B43] mb-2">LoadLink Parcel Freights</h1>
          <p className="text-2xl text-[#FF7D44] font-semibold">Book Now</p>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          <form
            onSubmit={handleSubmit}
            id="shipment-details"
          >
            {/* Step 1: Pickup & Delivery Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#132B43] border-b-2 border-[#FF7D44] pb-2">
                Step 1: Pickup & Delivery Details
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Pickup Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#132B43] mb-2">
                      Pickup Suburb
                    </label>
                    <PickupSuburbField
                      setPickupSuburb={setPickupSuburb}
                      errors={errors}
                      pickupSuburb={pickupSuburb}
                    />
                    {errors?.pickupSuburb && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors?.pickupSuburb}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-[#132B43] mb-2">
                      Pickup Building Type
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                          pickupResidentialCSS.includes('primary')
                            ? 'bg-[#FF7D44] text-white shadow-lg scale-105'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        style={{ border: 'none' }}
                        onClick={() => handleClick_Pickup("Residential")}
                      >
                        Residential
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                          pickupCommercialCSS.includes('primary')
                            ? 'bg-[#FF7D44] text-white shadow-lg scale-105'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        style={{ border: 'none' }}
                        onClick={() => handleClick_Pickup("Commercial")}
                      >
                        Commercial
                      </button>
                    </div>
                    {errors?.pickupOption && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors?.pickupOption}
                      </p>
                    )}
                  </div>
                </div>

                {/* Delivery Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#132B43] mb-2">
                      Delivery Suburb
                    </label>
                    <DeliverySuburbField
                      setDeliverySuburb={setDeliverySuburb}
                      deliverySuburb={deliverySuburb}
                      errors={errors}
                    />
                    {errors?.deliverySuburb && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors?.deliverySuburb}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-[#132B43] mb-2">
                      Dropoff Building Type
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                          deliveryResidentialCSS.includes('primary')
                            ? 'bg-[#FF7D44] text-white shadow-lg scale-105'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        style={{ border: 'none' }}
                        onClick={() => handleClick_Delivery("Residential")}
                      >
                        Residential
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                          deliveryCommercialCSS.includes('primary')
                            ? 'bg-[#FF7D44] text-white shadow-lg scale-105'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        style={{ border: 'none' }}
                        onClick={() => handleClick_Delivery("Commercial")}
                      >
                        Commercial
                      </button>
                    </div>
                    {errors?.deliveryOption && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors?.deliveryOption}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Parcel Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#132B43] border-b-2 border-[#FF7D44] pb-2">
                Step 2: Parcel Details
              </h2>
              <p className="text-sm text-gray-600">
                Enter quantity, weight and dimensions. Please Note: Dimensions must be in centimeters (cm)
              </p>

                {dataRows.map((row_of_data, index) => {
                  return (
                    <PFDataRow
                      key={index}
                      index={index}
                      rowData={row_of_data}
                      updateRow={updateRow}
                      onRemove={removeRow}
                      errors={errors}
                    />
                  );
                })}

                <div className="mt-4">
                  <h3 className="text-base font-medium text-[#132B43] mb-2">
                    Step 3: Add any additional packages you require
                  </h3>
                  <button
                    type="button"
                    onClick={addRow}
                    className="w-full py-4 bg-gradient-to-r from-[#132B43] to-[#1a3a56] text-white font-semibold rounded-lg hover:shadow-xl transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-105"
                    style={{ border: 'none' }}
                  >
                    <span className="text-2xl">+</span>
                    Add Another Package
                  </button>
                </div>
              </div>

              {/* Step 4: Summary */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#132B43] border-b-2 border-[#FF7D44] pb-2">
                  Step 4: Summary
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-[#1e3d5a] to-[#132B43] rounded-xl p-6 text-white shadow-lg">
                    <p className="text-sm opacity-80 mb-1">Total Quantity</p>
                    <p className="text-3xl font-bold">{totalQty}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#1e3d5a] to-[#132B43] rounded-xl p-6 text-white shadow-lg">
                    <p className="text-sm opacity-80 mb-1">Total Weight</p>
                    <p className="text-3xl font-bold">{totalKgs} kg</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#1e3d5a] to-[#132B43] rounded-xl p-6 text-white shadow-lg">
                    <p className="text-sm opacity-80 mb-1">Total Volume</p>
                    <p className="text-3xl font-bold">{totalVolume} cm³</p>
                  </div>
                </div>

                {/* Dangerous Goods Declaration */}
                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      id="is_danger_yes"
                      name="is_danger"
                      checked={isDanger === true}
                      onChange={() => setIsDanger(true)}
                      className="w-5 h-5 accent-[#FF7D44] cursor-pointer"
                    />
                    <span className="text-base font-semibold text-[#132B43]">Yes</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer mt-2">
                    <input
                      type="radio"
                      id="is_danger_no"
                      name="is_danger"
                      checked={isDanger === false}
                      onChange={() => setIsDanger(false)}
                      className="w-5 h-5 accent-[#FF7D44] cursor-pointer"
                    />
                    <span className="text-base font-semibold text-[#132B43]">No</span>
                  </label>
                  <p className="text-sm text-[#132B43] mt-3">
                    Do any of the shipped goods contain dangerous materials?
                  </p>
                </div>

                {/* Important Notice */}
                <div className="bg-red-50 border-l-4 border-[#FF7D44] p-5 rounded-lg shadow-md">
                  <p className="text-sm font-bold text-[#132B43] flex items-start gap-2">
                    <svg className="w-5 h-5 text-[#FF7D44] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>
                      IMPORTANT! EXTRA CHARGES will apply for incorrect weights and/or dimensions - Please ensure these are accurate.
                    </span>
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  {showPriceButton ? (
                    <Button
                      type="submit"
                      disabled={isSubmitLoading}
                      form="shipment-details"
                      className="w-full py-5 text-white font-bold text-xl rounded-lg hover:shadow-2xl hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: isSubmitLoading 
                          ? '#cbd5e0' 
                          : 'linear-gradient(to right, #FF7D44, #ff9066)',
                        border: 'none'
                      }}
                    >
                      {isSubmitLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Spinner variant="border" size="sm" />
                          Loading...
                        </span>
                      ) : (
                        "Get Pricing"
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleOpenModal}
                      className="w-full py-5 text-white font-bold text-xl rounded-lg hover:shadow-2xl hover:scale-105 transition-all shadow-lg"
                      style={{
                        background: 'linear-gradient(to right, #132B43, #1e3d5a)',
                        border: 'none'
                      }}
                    >
                      Login
                    </Button>
                  )}
                </div>
              </div>
            </form>
            <PopupModal
              show={isSubmitLoading && !error}
              message={isSubmitLoading ? "Loading, please wait..." : ajaxError}
              error={error}
              onClose={() => {
                setError(false); // Reset error state
              }}
            />
            <PFPopupComponent
              show={showModal.pfbutton}
              handleClose={handleCloseModal}
            />
          </div>
        </div>
      </main>
  );
};

export default PF_SingleListing;
// What this code exports when it is imported in other files export default PF_SingleListing;



