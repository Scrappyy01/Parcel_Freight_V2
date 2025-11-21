'use client';

import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { startCase } from "lodash";
import { formatToAUDate } from "../../utils/helpers";

// Component for each row of Data in the Parcel Freight details - we can add or remove multiple rows of data if needed.
const Parcel_Freight_Pricing_Row = ({
  index,
  rowData,
  isDisable = false,
  onChange,
  flashRed,
  selectServiceQuoteId,
  hasPaid = false,
}) => {
  const { pf_user, setPf_User } = useContext(UserContext);

  const handleRadioChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <div className="lg:col-span-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center" style={{ marginTop: "0px" }}>
          <div className="lg:col-span-3">
            <strong>{startCase(rowData["service_type"])}</strong>
          </div>
          <div className="lg:col-span-3">
            {rowData?.service_estimated_delivery_datetime
              ? formatToAUDate(
                  rowData["service_estimated_delivery_datetime"],
                  true
                )
              : "No Delivery date"}
          </div>
          {pf_user.role === "Admin" && (
            <div className="lg:col-span-3">
              <div className="flex mb-3">
                <span className="pfs-input-label-inline" id="basic-addon-2">Our Price</span>
                <input
                  type="text"
                  step="0.5"
                  className="pfs-input flex-1"
                  title="Kilograms must be in a valid numeric format"
                  value={rowData["service_quote"] || 0.0}
                  placeholder={`Row ${index + 1} Kgs`}
                  aria-describedby="basic-addon-2"
                  disabled
                />
              </div>
            </div>
          )}
          <div className="lg:col-span-4">
            <div className="flex mb-3">
              <span className="pfs-input-label-inline" id="basic-addon-3">Price</span>
              <input
                type="text"
                step="0.5"
                className="pfs-input flex-1"
                title="This is a read-only field."
                value={rowData["service_user_price"] || 0.0}
                disabled
                style={{
                  backgroundColor:
                    "light-dark(rgba(239, 239, 239, 0.3), rgba(59, 59, 59, 0.3))",
                }}
                aria-describedby="basic-addon-3"
              />
            </div>
          </div>
          <div className="lg:col-span-1">
            <input
              type="radio"
              name="service_code"
              className={flashRed ? "radio-flash" : ""}
              disabled={!rowData["service_name"] || hasPaid}
              value={rowData["service_quote_id"] || ""}
              data-index={index}
              onChange={handleRadioChange}
              id={`quote-${rowData["service_quote_id"]}`}
              checked={
                Number(rowData["service_quote_id"]) ===
                Number(selectServiceQuoteId)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parcel_Freight_Pricing_Row;



