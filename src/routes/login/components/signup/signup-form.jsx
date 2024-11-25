// src/routes/login/components/signup/signup-form.jsx

import React from "react";
import { KakaoButton } from "../kakao-button";

export const SignUpForm = () => {
  return (
    <div className="w-full flex flex-col justify-start items-center gap-5">
      <KakaoButton isLogin={false} />
    </div>
  );
};
