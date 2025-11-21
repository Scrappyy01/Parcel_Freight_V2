'use client';

import { useEffect, useState } from "react";

const calculateWeight = (qty, kgs) => (qty * kgs).toFixed(2);
const calculateUnit = (length, width, height) => length * width * height; // Default unit for measurement
const colGridSize = {
  weight: { xl: 3, lg: 5, md: 5, sm: 5, xs: 12 },
  volume: { xl: 2, lg: 4, md: 4, sm: 4, xs: 12 },
};

const WeightField = ({ value }) => (
  <div className="lg:col-span-4 mt-2">
    <div className="flex">
      <span className="pfs-input-label-inline">Weight (Kgs)</span>
      <input
        type="number"
        className="pfs-input flex-1"
        value={value || ""}
        disabled
      />
    </div>
  </div>
);

const Parcel_Freight_Package = ({ index, rowData, isDisable = false }) => {
  const [localRowData, setLocalRowData] = useState({});
  const [calculateMeaureUnit, setCalculateMeaureUnit] = useState(0);
  useEffect(() => {
    setLocalRowData(rowData);
    setCalculateMeaureUnit(
      calculateUnit(
        rowData["length"] || 0,
        rowData["width"] || 0,
        rowData["height"] || 0
      )
    );
  }, [rowData]);

  const renderInputField = (
    fieldIndex,
    label,
    gridSize,
    formType = "number",
    extraClassName = ""
  ) => (
    <div
      className={`lg:col-span-${gridSize.lg} xl:col-span-${gridSize.xl} ${extraClassName}`}
    >
      <div className="flex">
        <span className="pfs-input-label-inline">{label}</span>
        <input
          type={formType}
          className="pfs-input flex-1"
          value={localRowData[fieldIndex] || ""}
          disabled
        />
      </div>
    </div>
  );

  return (
    <div>
      <div>
        <label className="pfs-input-label">Package {index + 1}</label>
      </div>
      <div className="lg:col-span-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {renderInputField("quantity", "Quantity", colGridSize.weight)}
          {renderInputField("weight", "Kgs", colGridSize.weight)}
          {renderInputField("length", "Length", colGridSize.volume)}
          {renderInputField("width", "Width", colGridSize.volume)}
          {renderInputField("height", "Height", colGridSize.volume)}
          {renderInputField(
            "packaging_code",
            "Packaging Type",
            { xl: 4, lg: 4 },
            "text",
            "mt-2"
          )}

          <WeightField
            value={calculateWeight(
              localRowData["quantity"],
              localRowData["weight"]
            )}
          />
          <div className="lg:col-span-4 mt-2">
            <div className="flex">
              <span className="pfs-input-label-inline">
                Volume (cm<sup>3</sup>)
              </span>
              <input
                type="text"
                className="pfs-input flex-1"
                value={calculateMeaureUnit}
                readOnly={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parcel_Freight_Package;



