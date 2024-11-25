// src/routes/login/components/login/login-form.jsx

import React from "react";
import { KakaoButton } from "../kakao-button";

export const LoginForm = () => {
  return (
    <div className="w-full flex flex-col justify-start items-center gap-5">
      <KakaoButton isLogin={true} />
    </div>
  );
};
