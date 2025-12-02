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
    <div className="min-h-screen py-8">
      <div className="w-full">
        
        {/* Modern Header with Gradient */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-black bg-clip-text text-transparent mb-3">
              LOADLINK PARCEL FREIGHT 
            </h1>
           
          </div>
          <p className="text-gray-600 mt-4 text-lg">Your fast, reliable, and affordable parcel freight service</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <form onSubmit={handleSubmit} id="shipment-details" className="divide-y divide-gray-100">
            
            {/* STEP 1: Location Details */}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#FF7D44] to-[#ff9066] text-white font-bold text-lg shadow-lg">
                  1
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Location Details</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Pickup Column */}
                <div className="space-y-4 p-5 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-[#132B43]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="font-bold text-gray-800">Pickup Details</h3>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Suburb <span className="text-red-500">*</span>
                    </label>
                    <PickupSuburbField
                      setPickupSuburb={setPickupSuburb}
                      errors={errors}
                      pickupSuburb={pickupSuburb}
                    />
                    {errors?.pickupSuburb && (
                      <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.pickupSuburb}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Building Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleClick_Pickup("Residential")}
                        className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                          selectedPickupOption === "Residential"
                            ? 'bg-gradient-to-r from-[#132B43] to-[#1e4a6f] text-white shadow-lg scale-105'
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#132B43] hover:shadow-md'
                        }`}
                      >
                        🏠 Residential
                      </button>
                      <button
                        type="button"
                        onClick={() => handleClick_Pickup("Commercial")}
                        className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                          selectedPickupOption === "Commercial"
                            ? 'bg-gradient-to-r from-[#132B43] to-[#1e4a6f] text-white shadow-lg scale-105'
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#132B43] hover:shadow-md'
                        }`}
                      >
                        🏢 Commercial
                      </button>
                    </div>
                    {errors?.pickupOption && (
                      <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.pickupOption}
                      </p>
                    )}
                  </div>
                </div>

                {/* Delivery Column */}
                <div className="space-y-4 p-5 bg-gradient-to-br from-orange-50 to-slate-50 rounded-2xl border border-orange-100">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-[#FF7D44]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h3 className="font-bold text-gray-800">Delivery Details</h3>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Suburb <span className="text-red-500">*</span>
                    </label>
                    <DeliverySuburbField
                      setDeliverySuburb={setDeliverySuburb}
                      deliverySuburb={deliverySuburb}
                      errors={errors}
                    />
                    {errors?.deliverySuburb && (
                      <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.deliverySuburb}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Building Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleClick_Delivery("Residential")}
                        className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                          selectedDeliveryOption === "Residential"
                            ? 'bg-gradient-to-r from-[#FF7D44] to-[#ff9066] text-white shadow-lg scale-105'
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#FF7D44] hover:shadow-md'
                        }`}
                      >
                        🏠 Residential
                      </button>
                      <button
                        type="button"
                        onClick={() => handleClick_Delivery("Commercial")}
                        className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                          selectedDeliveryOption === "Commercial"
                            ? 'bg-gradient-to-r from-[#FF7D44] to-[#ff9066] text-white shadow-lg scale-105'
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#FF7D44] hover:shadow-md'
                        }`}
                      >
                        🏢 Commercial
                      </button>
                    </div>
                    {errors?.deliveryOption && (
                      <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.deliveryOption}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2: Package Information */}
            <div className="p-6 md:p-8 bg-gray-50">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#FF7D44] to-[#ff9066] text-white font-bold text-lg shadow-lg">
                  2
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800">Package Information</h2>
                  <p className="text-sm text-gray-600 mt-1">📏 All dimensions must be in centimeters (cm)</p>
                </div>
              </div>

              <div className="space-y-4">
                {dataRows.map((row_of_data, index) => (
                  <PFDataRow
                    key={index}
                    index={index}
                    rowData={row_of_data}
                    updateRow={updateRow}
                    onRemove={removeRow}
                    errors={errors}
                  />
                ))}

                <button
                  type="button"
                  onClick={addRow}
                  className="w-full py-4 px-6 bg-gradient-to-r from-[#132B43] to-[#1e4a6f] text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 group hover:scale-[1.02]"
                >
                  <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Another Package
                </button>
              </div>
            </div>

            {/* STEP 3: Summary & Dangerous Goods */}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#FF7D44] to-[#ff9066] text-white font-bold text-lg shadow-lg">
                  3
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Summary & Confirmation</h2>
              </div>
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#132B43] to-[#1e4a6f] rounded-2xl p-6 shadow-lg group hover:shadow-2xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative">
                    <p className="text-blue-200 text-sm font-medium mb-1">Total Quantity</p>
                    <p className="text-4xl font-bold text-white">{totalQty}</p>
                    <p className="text-blue-200 text-xs mt-1">packages</p>
                  </div>
                </div>
                
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-500 to-gray-700 rounded-2xl p-6 shadow-lg group hover:shadow-2xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative">
                    <p className="text-purple-200 text-sm font-medium mb-1">Total Weight</p>
                    <p className="text-4xl font-bold text-white">{totalKgs}</p>
                    <p className="text-purple-200 text-xs mt-1">kilograms</p>
                  </div>
                </div>
                
                <div className="relative overflow-hidden bg-gradient-to-br from-[#FF7D44] to-[#ff9066] rounded-2xl p-6 shadow-lg group hover:shadow-2xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative">
                    <p className="text-orange-100 text-sm font-medium mb-1">Total Volume</p>
                    <p className="text-4xl font-bold text-white">{totalVolume}</p>
                    <p className="text-orange-100 text-xs mt-1">cubic cm</p>
                  </div>
                </div>
              </div>

              {/* Dangerous Goods */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-6 mb-6 shadow-sm">
                <div className="flex items-start gap-3 mb-4">
                  <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg mb-1">Dangerous Goods Declaration</h3>
                    <p className="text-sm text-gray-600">Do any of the shipped goods contain dangerous materials?</p>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-4">
                  <label className="flex-1 cursor-pointer">
                    <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      isDanger === false 
                        ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="is_danger"
                          checked={isDanger === false}
                          onChange={() => setIsDanger(false)}
                          className="w-5 h-5 accent-emerald-500 cursor-pointer"
                        />
                        <span className="font-semibold text-gray-800">No, safe to ship</span>
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex-1 cursor-pointer">
                    <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      isDanger === true 
                        ? 'border-red-500 bg-red-50 shadow-md' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="is_danger"
                          checked={isDanger === true}
                          onChange={() => setIsDanger(true)}
                          className="w-5 h-5 accent-red-500 cursor-pointer"
                        />
                        <span className="font-semibold text-gray-800">Yes, contains dangerous goods</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-[#FF7D44] rounded-lg p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#FF7D44] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-bold text-gray-800 text-sm mb-1">⚠️ Important Notice</p>
                    <p className="text-sm text-gray-700">
                      Extra charges will apply for incorrect weights and/or dimensions. Please ensure all measurements are accurate to avoid additional fees.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-slate-50">
              {showPriceButton ? (
                <button
                  type="submit"
                  disabled={isSubmitLoading}
                  className="w-full py-5 px-8 bg-gradient-to-r from-[#FF7D44] to-[#ff9066] text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
                >
                  {isSubmitLoading ? (
                    <>
                      <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Get Instant Pricing
                      <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              ) : (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleOpenModal}
                    className="w-full py-5 px-8 bg-gradient-to-r from-[#132B43] to-[#1e4a6f] text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login to Get Pricing
                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                  <p className="text-sm text-gray-600 mt-4">
                    Already have an account? Login to view instant pricing and book your shipment.
                  </p>
                </div>
              )}
            </div>

          </form>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl mb-2">⚡</div>
            <p className="font-semibold text-gray-800">Instant Quotes</p>
            <p className="text-xs text-gray-600">Get pricing in seconds</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl mb-2">🚚</div>
            <p className="font-semibold text-gray-800">Reliable Service</p>
            <p className="text-xs text-gray-600">Track every shipment</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl mb-2">💰</div>
            <p className="font-semibold text-gray-800">Best Rates</p>
            <p className="text-xs text-gray-600">Competitive pricing</p>
          </div>
        </div>

      </div>

      {/* Modals */}
      <PopupModal
        show={isSubmitLoading && !error}
        message={isSubmitLoading ? "Loading, please wait..." : ajaxError}
        error={error}
        onClose={() => setError(false)}
      />
      <PFPopupComponent
        show={showModal.pfbutton}
        handleClose={handleCloseModal}
      />
    </div>
  );
};

export default PF_SingleListing;
// What this code exports when it is imported in other files export default PF_SingleListing;



