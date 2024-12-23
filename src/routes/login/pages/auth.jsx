// src/routes/login/pages/auth.jsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { kakaoSignIn } from "../../../apis/api";
import { setLoginState, setUserProfile } from "../../../redux/user-slice";

function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getToken = async () => {
      try {
        // code, state 파라미터 모두 꺼내기
        const urlParams = new URL(window.location.href).searchParams;
        const code = urlParams.get("code");
        const state = urlParams.get("state");

        let decodedState = null;
        try {
          decodedState = JSON.parse(decodeURIComponent(state));
        } catch (e) {
          decodedState = decodeURIComponent(state);
        }
        console.log("Decoded state:", decodedState);

        console.log("Received authorization code:", code);
        console.log("Received state:", state); // 우리가 넘긴 redirect 정보가 들어있음

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

        const redirectUrl =
          typeof decodedState === "string"
            ? decodedState
            : decodedState?.redirectUrl || "/main/sold";
        console.log("Redirecting to:", redirectUrl);

        // 로그인 후 이동할 URL
        // 1) 우선 백엔드 응답의 상태(결제 인증 여부 등)에 따라 분기
        if (!res.is_payment_verified) {
          navigate("/account-auth");
        } else {
          navigate(redirectUrl);
        }
      } catch (err) {
        console.error("Error during authentication:", err);
        navigate("/");
      }
    };

    getToken();
  }, [dispatch, navigate]);

  return null; // 화면에 아무것도 표시 안 함
}

export default Auth;
