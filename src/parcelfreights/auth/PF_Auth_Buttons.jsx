'use client';

import React, { Fragment, useState, useContext } from "react";
import { Modal } from "@/components/ui/ui";
import loadlink from "@/assets/Loadlink-Logo.svg";

import PFGoogleButton from "./PF_GoogleLoginButton";
import PFFacebookButton from "./PF_FacebookLoginButton";
import { UserContext } from "../../contexts/UserContext";

import PFLoginForm from "./PF_LoginForm";

const PF_Auth_Buttons = ({ show, handleClose, handleData }) => {
  const [agreed, setAgreed] = useState(false);
  const [disableButton, setDiableButton] = useState(true);
  const { pf_user, setPf_User } = useContext(UserContext);

  const handleSuccess = (response) => {
    const token = response.token;
    const user = response.user;

    localStorage.setItem("authToken", token);
    localStorage.setItem("pf_user", JSON.stringify(user));
    setPf_User({ ...pf_user, ...user, isAuthenticated: true });
    handleClose(true);
  };

  const handleFailure = (response) => {
    console.error("Login failed:", response);
  };

  const clickRegister = (event) => {
    event.preventDefault();
    return handleData({
      pfbutton: false,
      pfform: true,
    });
  };

  const handleCheckbox = (e) => {
    setAgreed(e.target.checked);
    setDiableButton(!e.target.checked);
  };

  return (
    <Fragment>
      <Modal isOpen={show.pfbutton} onClose={handleClose}>
        <div className="relative w-full flex flex-col md:flex-row gap-6 items-stretch min-h-[800px]">
          {/* Botão de fechar no canto superior direito */}

          {/* Login content */}
          <div className="w-full md:w-12/12 flex flex-col justify-center px-6">
            <img
              src={loadlink.src}
              alt="Loadlink Logo"
              className="mt-0 mb-6 mx-auto max-w-[400px]"
            />

            <p className="text-gray-600 text-sm mb-8 text-center">
              Choose your preferred sign in method to continue
            </p>

            <div className="space-y-3 mb-6">
              <PFGoogleButton
                handleSuccess={handleSuccess}
                handleFailure={handleFailure}
                handleClose={handleClose}
                disable={disableButton}
              />

              <PFFacebookButton
                handleSuccess={handleSuccess}
                handleFailure={handleFailure}
                handleClose={handleClose}
                disable={disableButton}
              />
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-medium">or</span>
              </div>
            </div>

            <div className="mb-6">
              <PFLoginForm
                handleSuccess={handleSuccess}
                handleFailure={handleFailure}
                handleClose={handleClose}
              />
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            <div className="text-center mb-6">
              <p className="text-gray-600 text-sm mb-3">Don't have an account?</p>
<button
  onClick={clickRegister}
  className="w-full bg-[#193D5A] hover:bg-[#162f45] text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg cursor-pointer"
>
  Create a new account
</button>
            </div>

            <label className="flex items-start gap-3 cursor-pointer p-3 bg-blue-50 rounded-lg border border-blue-100">
              <input
                type="checkbox"
                checked={agreed}
                onChange={handleCheckbox}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer"
              />
              <span className="text-xs text-gray-700">
                I agree to the <a href="/terms" className="text-blue-600 hover:text-blue-700 font-semibold">Terms and Conditions</a>
              </span>
            </label>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default PF_Auth_Buttons;