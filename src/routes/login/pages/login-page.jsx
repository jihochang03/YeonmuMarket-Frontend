import React, { useState, useEffect } from "react";
import { LoginForm } from "../components/login/login-form";
import { SignUpForm } from "../components/signup/signup-form";
import { Introducement } from "../../../components/introduce-section";
import { useLocation } from "react-router-dom";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const location = useLocation();

  // URL에서 redirect 파라미터 추출
  const params = new URLSearchParams(location.search);
  const rawRedirectUrl = params.get("redirect");

  // 트위터의 t.co 링크 래퍼 문제를 해결하기 위해 URL을 인코딩
  const encodedRedirectUrl = rawRedirectUrl
    ? decodeURIComponent(rawRedirectUrl)
    : null;

  const redirectUrl =
    !encodedRedirectUrl || encodedRedirectUrl === "null"
      ? "/main/sold"
      : encodedRedirectUrl;

  // 디버깅: redirectUrl 값 확인
  useEffect(() => {
    console.log("Redirect URL:", redirectUrl);
  }, [redirectUrl]);

  // 페이지 진입 시 URL을 검사하고 필요시 상태를 변경
  useEffect(() => {
    console.log("Page loaded with URL:", location.href);
    if (!params.has("redirect")) {
      console.warn("Redirect parameter is missing, using default redirect.");
    }
  }, [location]);

  return (
    <div className="w-full sm:w-main-frame h-screen flex justify-center items-center">
      <div className="w-main-frame h-main-height flex flex-col justify-center items-start gap-12">
        <Introducement />
        {isLogin ? (
          <LoginForm redirectUrl={redirectUrl} />
        ) : (
          <SignUpForm redirectUrl={redirectUrl} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
