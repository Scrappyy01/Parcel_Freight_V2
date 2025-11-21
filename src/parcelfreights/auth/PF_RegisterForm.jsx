'use client';

import { Fragment, useState, useContext } from "react";
import Modal from "@/components/ui/ui/Modal";

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
        <Modal
          isOpen={registerShow.pfform}
          onClose={handleClose}
          title="Create a new account"
        >
          <div style={{ padding: "25px" }}>
            <form
              onSubmit={handleSubmit}
              id="page-three-address"
              className="XXcontainer form-background"
              noValidate
            >
              <label className="pfs-input-label">
                Name *{" "}
                {hasError && !name && (
                  <span className="text-xs text-red-600 font-light ml-2">
                    name cannot be empty
                  </span>
                )}
              </label>
              <input
                className="pfs-input"
                name="loginName"
                onChange={onChange}
              />

              <label className="pfs-input-label">
                Email *{" "}
                {hasError && !validateEmail(email) && (
                  <span className="text-xs text-red-600 font-light ml-2">
                    invalid email
                  </span>
                )}
              </label>
              <input
                className="pfs-input"
                name="loginEmail"
                onChange={onChange}
              />

              <label className="pfs-input-label">
                Password *{" "}
                {hasError && !password && (
                  <span className="text-xs text-red-600 font-light ml-2">
                    password cannot be empty
                  </span>
                )}
              </label>
              <input
                className="pfs-input"
                name="password"
                type="password"
                onChange={onChange}
              />
              <button
                type="submit"
                form="page-three-address"
                className="snf5_oauth_button btn btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
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



