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
  const redirectUrl =
    !rawRedirectUrl || rawRedirectUrl === "null"
      ? "/main/sold"
      : rawRedirectUrl;

  // 디버깅: redirectUrl 값 확인
  useEffect(() => {
    console.log("Redirect URL:", redirectUrl);
  }, [redirectUrl]);

  return (
    <div className="w-full sm:w-main-frame h-main-height flex justify-center items-center">
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
