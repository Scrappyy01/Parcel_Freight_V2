'use client';

import { Fragment } from "react";
import Sidenav from "../Sidenav";
import ExpressContent from "./Express_Content";

const PF_Admin_Express = () => {
  return (
    <Fragment>
      <div className="flex h-screen">
        <Sidenav />
        <ExpressContent />
      </div>
    </Fragment>
  );
};

export default PF_Admin_Express;

