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
import { getCookie, setCookie, removeCookie } from "../../../utils/cookie";

function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getToken = async () => {
      try {
        const urlParams = new URL(window.location.href).searchParams;
        const code = urlParams.get("code");

        console.log("Received authorization code:", code);

        const res = await kakaoSignIn({ code });
        if (res === null) {
          console.error("Failed to get token from backend, response is null");
          navigate("/");
          return;
        }

        console.log("Response from backend:", res);

        // 로그인 상태 업데이트
        dispatch(setLoginState(true));

        // 사용자 프로필 저장
        dispatch(
          setUserProfile({
            nickname: res.nickname,
            kakao_email: res.kakao_email,
          })
        );

        // 인증 후 리다이렉트
        if (!res.is_payment_verified) {
          navigate("/account-auth");
        } else {
          navigate("/main/sold");
        }
      } catch (err) {
        console.error("Error during authentication:", err);
        navigate("/");
      }
    };

    getToken();
  }, [dispatch, navigate]);

  return null; // No UI content for this page
}

export default Auth;
