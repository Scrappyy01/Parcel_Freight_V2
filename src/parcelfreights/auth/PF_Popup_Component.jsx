'use client';

import React, { Fragment, useState, useEffect } from "react";
import PFRegisterForm from "./PF_RegisterForm";
import PFAuthButtons from "./PF_Auth_Buttons";

const PF_Popup_Component = ({ show, handleClose, handleUpload }) => {
  const handleRegister = (data) => {
    setShowRegister(data);
  };

  const [showRegister, setShowRegister] = useState({
    pfbutton: false,
    pfform: false,
  });

  useEffect(() => {
    setShowRegister(show);
  }, [show]);

  return (
    <Fragment>
      <PFAuthButtons
        show={showRegister}
        handleClose={handleClose}
        handleData={handleRegister}
      />
      <PFRegisterForm registerShow={showRegister} handleClose={handleClose} />
    </Fragment>
  );
};

export default PF_Popup_Component;



