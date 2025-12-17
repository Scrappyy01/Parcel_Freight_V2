'use client';

import { useContext, useState, useEffect } from "react";

import { AuthContext } from "../../contexts/index.js";
import { UserContext } from "../../contexts/UserContext.js";

// Google OAuth2
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance.js";
import { OAUTH_METHOD_GOOGLE } from "../../utils/constant.js";

export default function PF_GoogleButton({
  handleSuccess,
  handleFailure,
  handleClose,
  disable,
}) {
  const [errors, setErrors] = useState({
    emailError: false,
    passwordError: false,
    credentialsErros: false,
    textError: "",
  });
  const { pf_user, setPf_User } = useContext(UserContext);
  const authContext = useContext(AuthContext);
  const [googleUser, setGoogleUser] = useState([]);
  const [googleProfile, setGoogleProfile] = useState([]);
  const [loginResponse, setLoginResponse] = useState([]);
  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setGoogleUser(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (googleUser.access_token !== undefined) {
      axios
        .get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
          headers: {
            Authorization: `Bearer ${googleUser.access_token}`,
          },
        })
        .then((res) => {
          setGoogleProfile(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [googleUser]);

  useEffect(() => {
    if (googleProfile.email !== undefined) {
      handleClose();

      async function fetchMyLogin() {
        await axiosInstance
          .post(
            `/auth/google/callback`,
            {
              email: googleProfile.email,
              password: googleProfile.sub,
              name: googleProfile.name,
              picture: googleProfile.picture,
              username: googleProfile.email,
              token: googleUser.access_token,
              method: OAUTH_METHOD_GOOGLE,
              google_id: googleProfile.sub,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
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
            handleSuccess(response.data);
            return response;
          })
          .catch((error) => {
            console.log("error:", error);
            handleFailure(error);
            return error;
          });
      }
      fetchMyLogin();
    }
  }, [googleProfile]);

  useEffect(() => {
    if (
      loginResponse.access_token !== undefined &&
      loginResponse.refresh_token !== undefined
    ) {
      async function completeMyLogin() {
        try {
          authContext.login(
            loginResponse.access_token,
            loginResponse.refresh_token
          );
        } catch (res) {
          if (res.hasOwnProperty("message")) {
            console.log(
              "completeMyLogin() We have login errors: " + res.message
            );
            setErrors({
              ...errors,
              credentialsErros: true,
              textError: res.message,
            });
          } else {
            console.log(
              "completeMyLogin() We have login errors: " + res.errors[0].detail
            );
            setErrors({
              ...errors,
              credentialsErros: true,
              textError: res.errors[0].detail,
            });
          }
        }
      }
      completeMyLogin();
    }
  }, [loginResponse]);

  return (
    <button
      disabled={disable}
      className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-lg border border-gray-300 transition duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        localStorage.removeItem("pf_user");
        googleLogin();
      }}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#1F2937" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Sign in with Google
    </button>
  );
}



