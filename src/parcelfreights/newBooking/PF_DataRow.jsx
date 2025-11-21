'use client';

import { useMemo, useState } from "react";

import { FEDEX_PACKAGE_CODE } from "../../utils/constant";

import { debounce } from "lodash";
const calculateWeight = (qty, kgs) => parseFloat(qty * kgs).toFixed(2);

const WeightField = ({ value }) => (
  <div className="flex">
    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
      Weight
    </span>
    <input
      type="number"
      value={value}
      readOnly
      className="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
    />
  </div>
);

const DataRow = ({
  index,
  rowData,
  updateRow,
  onRemove,
  isDisable = false,
  errors = null,
}) => {
  const [localRowData, setLocalRowData] = useState(rowData);
  const [focusedField, setFocusedField] = useState(null);

  const debouncedUpdate = useMemo(
    () =>
      debounce((key, value) => {
        if (value < 0) return;
        updateRow(index, key, value);
      }, 400),
    [index, updateRow]
  );

  const handleChange = (key) => {
    return (event) => {
      const value =
        key !== "packagingType"
          ? event.target.value === ""
            ? 0
            : parseFloat(event.target.value)
          : event.target.value;

      const updated = { ...localRowData, [key]: value };

      let volume = 0;
      let weight = 0.0;
      switch (key) {
        case "length":
          volume =
            value *
            Number(localRowData["width"]) *
            Number(localRowData["height"]);
          updated.volume = volume;
          delete errors?.length;
          break;
        case "width":
          volume =
            value *
            Number(localRowData["length"]) *
            Number(localRowData["height"]);
          updated.volume = volume;
          delete errors?.width;
          break;
        case "height":
          volume =
            value *
            Number(localRowData["length"]) *
            Number(localRowData["width"]);
          updated.volume = volume;
          delete errors?.height;
          break;
        case "qty":
          weight = calculateWeight(value, Number(localRowData["kgs"]));
          updated.weight = weight;
          delete errors?.qty;
          break;
        case "kgs":
          weight = calculateWeight(Number(localRowData["qty"]), value);
          updated.weight = weight;
          delete errors?.kgs;
          break;
        case "packagingType":
          delete errors?.packagingType;
          break;
        default:
          break;
      }
      setLocalRowData(updated);
      debouncedUpdate(key, value);
    };
  };

  const handleKeyDown = (e) => {
    if (e.key === "-") e.preventDefault();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text");
    if (parseFloat(pasted) < 0) e.preventDefault();
  };

  const handleFocus = (key) => () => {
    setFocusedField(key);
  };

  const handleBlur = (key) => (e) => {
    setFocusedField(null);
    if (e.target.value.trim() === "") {
      const fakeEvent = { target: { value: "0" } };
      handleChange(key)(fakeEvent);
    }
  };

  const displayValue = (key) =>
    focusedField === key && localRowData[key] === 0 ? "" : localRowData[key];

  return (
    <div className="mb-4 rounded-lg" style={{ backgroundColor: "rgb(249 249 249)" }}>
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4">
          {index > 0 && !isDisable && (
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium">Package {index + 1}</label>
              {onRemove && (
                <button
                  onClick={() => onRemove(index)}
                  disabled={isDisable}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete Row"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {/* Row 1: Quantity, Kgs, Length, Width, Height */}
            <div className="grid grid-cols-1 xl:grid-cols-12 lg:grid-cols-10 md:grid-cols-10 gap-4">
              <div className="xl:col-span-3 lg:col-span-5 md:col-span-5">
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                    Quantity
                  </span>
                  <input
                    type="number"
                    step={1}
                    min={0}
                    value={displayValue("qty")}
                    onChange={isDisable ? null : handleChange("qty")}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onFocus={handleFocus("qty")}
                    onBlur={handleBlur("qty")}
                    readOnly={isDisable}
                    className={`rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 ${
                      errors?.qty ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
              </div>
              <div className="xl:col-span-3 lg:col-span-5 md:col-span-5">
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                    Kgs
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={
                      localRowData.kgsRaw ?? localRowData.kgs?.toString() ?? ""
                    }
                    onChange={(e) => {
                      const input = e.target.value;

                      // ✅ Allow: empty, ".", "0.", or up to 2 decimals
                      if (/^\d*\.?\d{0,2}$/.test(input) || input === "") {
                        // Update local raw text for display
                        setLocalRowData((prev) => ({
                          ...prev,
                          kgsRaw: input,
                        }));

                        // Only update numeric value when valid and complete
                        if (input !== "" && input !== "." && input !== "0.") {
                          const parsed = parseFloat(input);
                          if (!isNaN(parsed)) {
                            // Update weight instantly for user feedback
                            const newWeight = calculateWeight(
                              Number(localRowData.qty),
                              parsed
                            );

                            setLocalRowData((prev) => ({
                              ...prev,
                              kgs: parsed,
                              weight: newWeight,
                            }));

                            // Then debounce parent update
                            debouncedUpdate("kgs", parsed);
                          }
                        }
                      }
                    }}
                    onBlur={(e) => {
                      const raw = e.target.value.trim();
                      let parsed = 0;

                      // Handle edge cases like "", ".", or "0."
                      if (raw === "" || raw === "." || raw === "0.") parsed = 0;
                      else parsed = parseFloat(raw).toFixed(2);

                      const newWeight = calculateWeight(
                        Number(localRowData.qty),
                        parsed
                      );

                      setFocusedField(null);
                      setLocalRowData((prev) => ({
                        ...prev,
                        kgsRaw: undefined,
                        kgs: parsed,
                        weight: newWeight,
                      }));

                      // Now trigger the full handleChange logic once finalized
                      handleChange("kgs")({ target: { value: parsed } });
                    }}
                    onFocus={() => setFocusedField("kgs")}
                    onKeyDown={(e) => {
                      if (["-", "e", "E", "+"].includes(e.key))
                        e.preventDefault();
                    }}
                    onPaste={(e) => {
                      const pasted = (
                        e.clipboardData || window.clipboardData
                      ).getData("text");
                      if (!/^\d*\.?\d{0,2}$/.test(pasted)) e.preventDefault();
                    }}
                    readOnly={isDisable}
                    className={`rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 ${
                      errors?.kgs ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
              </div>
              <div className="xl:col-span-2 lg:col-span-4 md:col-span-4">
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                    Length
                  </span>
                  <input
                    type="number"
                    step={1}
                    min={0}
                    value={displayValue("length")}
                    onChange={isDisable ? null : handleChange("length")}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onFocus={handleFocus("length")}
                    onBlur={handleBlur("length")}
                    readOnly={isDisable}
                    className={`rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 ${
                      errors?.length ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
              </div>
              <div className="xl:col-span-2 lg:col-span-4 md:col-span-4">
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                    Width
                  </span>
                  <input
                    type="number"
                    step={1}
                    min={0}
                    value={displayValue("width")}
                    onChange={isDisable ? null : handleChange("width")}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onFocus={handleFocus("width")}
                    onBlur={handleBlur("width")}
                    readOnly={isDisable}
                    className={`rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 ${
                      errors?.width ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
              </div>
              <div className="xl:col-span-2 lg:col-span-4 md:col-span-4">
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                    Height
                  </span>
                  <input
                    type="number"
                    step={1}
                    min={0}
                    value={displayValue("height")}
                    onChange={isDisable ? null : handleChange("height")}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onFocus={handleFocus("height")}
                    onBlur={handleBlur("height")}
                    readOnly={isDisable}
                    className={`rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 ${
                      errors?.height ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Packaging Type, Weight, Volume */}
            <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-1 gap-4">
              <div>
                <div className="flex gap-2 items-center">
                  <label className="text-sm font-medium text-gray-900 whitespace-nowrap">
                    Packaging Type*
                  </label>
                  <select
                    name="packaging_code"
                    onChange={handleChange("packagingType")}
                    value={localRowData["packagingType"] || ""}
                    className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                      errors?.packagingType ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Packaging Type</option>
                    {Object.entries(FEDEX_PACKAGE_CODE).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <WeightField value={localRowData["weight"]} />
              </div>
              <div>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                    Volume (cm<sup>3</sup>)
                  </span>
                  <input
                    type="text"
                    value={localRowData["volume"]}
                    readOnly={true}
                    className="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error Messages */}
          {errors && (
            <div className="grid grid-cols-1 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-2 gap-2 mt-2">
              {errors?.packagingType && (
                <div>
                  <p className="text-xs text-red-600">
                    {errors.packagingType}
                  </p>
                </div>
              )}
              {errors?.qty && (
                <div>
                  <p className="text-xs text-red-600">
                    {errors.qty}
                  </p>
                </div>
              )}
              {errors?.kgs && (
                <div>
                  <p className="text-xs text-red-600">
                    {errors.kgs}
                  </p>
                </div>
              )}
              {errors?.weight && (
                <div>
                  <p className="text-xs text-red-600">
                    {errors.weight}
                  </p>
                </div>
              )}
              {errors?.length && (
                <div>
                  <p className="text-xs text-red-600">
                    {errors.length}
                  </p>
                </div>
              )}
              {errors?.width && (
                <div>
                  <p className="text-xs text-red-600">
                    {errors.width}
                  </p>
                </div>
              )}
              {errors?.height && (
                <div>
                  <p className="text-xs text-red-600">
                    {errors.height}
                  </p>
                </div>
              )}
              {errors?.volume && (
                <div>
                  <p className="text-xs text-red-600">
                    {errors.volume}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataRow;



