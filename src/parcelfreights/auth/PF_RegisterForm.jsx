'use client';

import { Fragment, useState, useContext } from "react";
import Modal from "@/components/ui/ui/Modal";
import loadlink from "@/assets/Loadlink-Logo.svg";

import { validateEmail } from "../../utils/helpers";
import { UserContext } from "../../contexts/UserContext";
import axios from "axios";
import { baseUrl } from "@/utils/constant";

const PF_RegisterForm = ({ registerShow, handleClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);
  const { pf_user, setPf_User } = useContext(UserContext);

  const onChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    switch (name) {
      case "loginName":
        setName(value);
        break;
      case "loginEmail":
        if (!validateEmail(value)) {
          setHasError(true);
          return;
        }
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        console.warn("Unknown input name:", name);
        return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasError(false);
    const userRole = "user"; // Default user role, can be changed based on requirements

    if (!name || !email || !password) {
      setHasError(true);
      return;
    }
    try {
      const response = await axios.post(`${baseUrl}/api/v1/register`, {
        name,
        email,
        password,
        userRole,
      });

      if (response.status === 201) {
        const { token, user } = response.data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("pf_user", JSON.stringify(user));
        setPf_User({ ...pf_user, ...user, isAuthenticated: true });
        handleClose(true);
      } else {
        console.error("Registration failed:", response.data);
        setHasError(true);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setHasError(true);
    }
  };

 return (
  <Fragment>
    {registerShow.pfform && (
      <Modal isOpen={registerShow.pfform} onClose={handleClose} title="Create a new account">
        <div className="w-full max-w-md mx-auto px-6 py-8">
          <form
            onSubmit={handleSubmit}
            id="page-three-address"
            className="space-y-6"
            noValidate
          >
            {/* Name */}
<div className="space-y-6">
  {/* Logo acima do formulário */}
  <img
    src={loadlink.src}
    alt="Loadlink Logo"
    className="mt-0 mb-6 mx-auto max-w-[400px]"
  />

  {/* Campo Name */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Name *
      {hasError && !name && (
        <span className="text-xs text-red-600 font-light ml-2">
          name cannot be empty
        </span>
      )}
    </label>
    <input
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      name="loginName"
      onChange={onChange}
    />
  </div>
</div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
                {hasError && !validateEmail(email) && (
                  <span className="text-xs text-red-600 font-light ml-2">
                    invalid email
                  </span>
                )}
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                name="loginEmail"
                onChange={onChange}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
                {hasError && !password && (
                  <span className="text-xs text-red-600 font-light ml-2">
                    password cannot be empty
                  </span>
                )}
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                name="password"
                type="password"
                onChange={onChange}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              form="page-three-address"
              className={`w-full text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md ${
                hasError && (!name || !email || !password)
                  ? 'bg-[#A0A0A0] shadow-none cursor-not-allowed'
                  : 'bg-[#193D5A] hover:bg-[#162f45] hover:shadow-lg'
              }`}
              disabled={hasError && (!name || !email || !password)}
            >
              Sign Up
            </button>
          </form>
        </div>
      </Modal>
    )}
  </Fragment>
);
};

export default PF_RegisterForm;



