'use client';

import { Fragment } from "react";
import Sidenav from "../Sidenav";
import DashContent from "./Dashboard_Content";

const PF_Dashboard = () => {
  return (
    <Fragment>
      <div className="flex h-screen">
        <Sidenav />
        <DashContent />
      </div>
    </Fragment>
  );
};

export default PF_Dashboard;

