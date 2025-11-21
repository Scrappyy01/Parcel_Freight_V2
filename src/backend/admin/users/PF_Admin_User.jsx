'use client';

import { Fragment } from "react";
import Sidenav from "../Sidenav";
import UserContent from "./User_Content";

const PF_Admin_User = () => {
  return (
    <Fragment>
      <div className="flex h-screen">
        <Sidenav />
        <UserContent />
      </div>
    </Fragment>
  );
};

export default PF_Admin_User;

