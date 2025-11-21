'use client';

import { Fragment } from "react";
import Sidenav from "../Sidenav";
import PFList from "./PF_All_List";

const PF_Parcel_Freight_List = () => {
  return (
    <Fragment>
      <div className="flex h-screen">
        <Sidenav />
        <PFList />
      </div>
    </Fragment>
  );
};

export default PF_Parcel_Freight_List;

