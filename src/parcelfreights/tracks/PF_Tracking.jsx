'use client';

import { Fragment, useEffect } from "react";
import { useParams } from "next/navigation";

import { useSelector } from "react-redux";

import CouriersTrackingRecord from "./Couriers_Tracking_Record";
import FedexTrackingRecord from "./Fedex_Tracking_Record";

const PF_Tracking = ({ onSubmitParcelFreightTracking, onBack }) => {
  const { data: collection } = useSelector((state) => state.collection);
  const { status } = useSelector((state) => state.tracking);

  const { freight_id } = useParams();

  useEffect(() => {
    if (status === "succeeded") {
      onSubmitParcelFreightTracking();
    }

    if (status === "failed") {
      console.log("error");
    }
  }, [status, onSubmitParcelFreightTracking]);

  return (
    <Fragment>
      <h2>Tracking</h2>
      {collection.service_type === "Couriers Please" ||
      collection.service_name === "Couriers Please" ? (
        <div>
          <CouriersTrackingRecord
            freight_id={freight_id}
            order_code={collection.order_code}
          />
        </div>
      ) : collection.service_type === "Fed Ex" ||
        collection.service_name === "Fed Ex" ? (
        <FedexTrackingRecord
          freight_id={freight_id}
          consignment_number={collection.consignment_number}
        />
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default PF_Tracking;



