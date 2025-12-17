'use client';

import React, { useContext, useEffect, Fragment } from "react";
import { LoginSocialFacebook } from "reactjs-social-login";
import axiosInstance from "../../utils/axiosInstance";

import { UserContext } from "../../contexts/UserContext";

export default function PF_FacebookButton({
  handleSuccess,
  handleFailure,
  disable,
}) {
  const { pf_user, setPf_User } = useContext(UserContext);

  useEffect(() => {}, [pf_user]);

  const componentClicked = () => {
    console.log("facebook clicked");
  };

  const responseFacebook = async ({ provider, data }) => {
    try {
      await axiosInstance
        .post(
          `/auth/facebook`,
          {
            accessToken: data.accessToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          const { user, token } = res.data;
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
          handleSuccess(res.data);
          return res;
        })
        .catch((err) => {
          handleFailure(err);
          return err;
        });
    } catch (error) {
      console.error("Facebook login error:", error);
      handleFailure(error);
    }
  };

  const loginClass = `w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-lg border border-gray-300 transition duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${disable ? "opacity-50 cursor-not-allowed" : ""}`;

  return (
    <Fragment>
      <LoginSocialFacebook
        appId={process.env.NEXT_PUBLIC_FACEBOOK_ID || process.env.REACT_APP_FACEBOOK_ID}
        fields="name,email,picture"
        scope="public_profile,email"
        onResolve={responseFacebook}
        onLoginStart={componentClicked}
        className={loginClass}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Sign in with Facebook
      </LoginSocialFacebook>
    </Fragment>
  );
}



