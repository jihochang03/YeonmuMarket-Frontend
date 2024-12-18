// src/routes/login/pages/auth.jsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { kakaoSignIn } from "../../../apis/api";
import {
  setLoginState,
  setUserProfile,
  setAccessToken,
} from "../../../redux/user-slice";
import { getCookie } from "../../../utils/cookie";

function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getToken = async () => {
      try {
        const urlParams = new URL(window.location.href).searchParams;
        const code = urlParams.get("code");
        const state = urlParams.get("state"); // Retrieve state parameter if it exists

        console.log("Received authorization code:", code);
        console.log("State parameter:", state);

        const res = await kakaoSignIn({ code });
        // debugger;
        if (res === null) {
          console.error("Failed to get token from backend, response is null");
          navigate("/");

          return;
        }

        console.log("Response from backend:", res);

        // Save the access token in Redux and localStorage
        const accessToken = getCookie("access_token");
        dispatch(setAccessToken(accessToken));
        localStorage.setItem("access_token", accessToken);

        // Update login state
        dispatch(setLoginState(true));

        // Save user profile info
        dispatch(
          setUserProfile({
            nickname: res.nickname,
            kakao_email: res.kakao_email,
          })
        );

        // Redirect based on state or payment verification
        if (state) {
          // Redirect to the path specified in the state parameter
          navigate(state);
        } else if (!res.is_payment_verified) {
          // Redirect to account authentication if payment not verified
          navigate("/account-auth");
        } else {
          // Default redirect for logged-in users
          navigate("/main/sold");
        }
      } catch (err) {
        console.error("Error during authentication:", err);
        navigate("/");
        debugger;
      }
    };

    getToken();
  }, [dispatch, navigate]);

  return null; // No UI content for this page
}

export default Auth;
