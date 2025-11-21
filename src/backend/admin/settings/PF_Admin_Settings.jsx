'use client';

import { Fragment } from "react";
import Sidenav from "../Sidenav";
import SettingsContent from "./Settings_Content";

const PF_Admin_Settings = () => {
  return (
    <Fragment>
      <div className="flex h-screen">
        <Sidenav />
        <SettingsContent />
      </div>
    </Fragment>
  );
};

export default PF_Admin_Settings;

