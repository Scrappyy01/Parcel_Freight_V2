'use client';

import React, { useState, useContext, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { UserContext } from "../../contexts/UserContext";

import { validateEmail } from "@/utils/helpers";

const PF_LoginForm = ({ handleClose }) => {
  const { pf_user, setPf_User } = useContext(UserContext);
  const [hasError, setHasError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasLoginError, setHasLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setHasError(true);
      return;
    }
    setHasError(false);
    setHasLoginError(false);
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        `/login`,
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { user, token } = response.data;
      localStorage.setItem("pf_user", JSON.stringify(user));
      localStorage.setItem("authToken", token);

      const user_roles = {
        admin: false,
        staff: false,
        trade: false,
        user: false,
        ecommerce: false,
      };

      user?.roles?.forEach((role) => {
        switch (role?.name) {
          case "admin":
            user_roles.admin = true;
            break;
          case "staff":
            user_roles.staff = true;
            break;
          case "trade":
            user_roles.trade = true;
            break;
          case "user":
            user_roles.user = true;
            break;
          case "ecommerce":
            user_roles.ecommerce = true;
            break;
          default:
            // Optionally handle unknown roles here
            break;
        }
      });

      setPf_User({
        ...pf_user,
        ...user,
        isAuthenticated: true,
        user_roles,
      });
      setHasError(false);
      setHasLoginError(false);

      handleClose(true);
    } catch (error) {
      console.error("Login error:", error);
      setHasLoginError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    switch (name) {
      case "loginEmail":
        setEmail(value);
        if (hasError && value) {
          setHasError(false);
        }
        break;
      case "password":
        setPassword(value);
        if (hasError && value) {
          setHasError(false);
        }
        break;
      default:
        console.warn("Unknown input name:", name);
        return;
    }
  };

  useEffect(() => {
    localStorage.setItem("pf_user", JSON.stringify(pf_user));
  }, [pf_user]);

  return (
    <div className="space-y-4">
      {hasLoginError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">
            Login failed. Please check your email and password.
          </p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="loginEmail"
          placeholder="you@example.com"
          onChange={onChange}
          value={email}
          className={`w-full px-4 py-3 border rounded-lg font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
            hasError && !email ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          required
        />
        {hasError && !email && (
          <p className="mt-1 text-sm text-red-600 font-medium">Email is required</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="••••••••"
          onChange={onChange}
          value={password}
          className={`w-full px-4 py-3 border rounded-lg font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
            hasError && !password ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          required
        />
        {hasError && !password && (
          <p className="mt-1 text-sm text-red-600 font-medium">Password is required</p>
        )}
      </div>

<button
  type="submit"
  onClick={handleClick}
  disabled={isLoading}
  className={`w-full text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md ${
    isLoading
      ? 'bg-[#A0A0A0] shadow-none cursor-not-allowed'
      : 'bg-[#193D5A] hover:bg-[#162f45] hover:shadow-lg'
  }`}
>
  {isLoading ? 'Signing in...' : 'Sign in with Email'}
</button>
    </div>
  );
};

export default PF_LoginForm;



