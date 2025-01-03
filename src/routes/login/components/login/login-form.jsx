import React from "react";
import { KakaoButton } from "../kakao-button";

export const LoginForm = ({ redirectUrl }) => {
  return (
    <div className="w-full sm:w-main-frame flex flex-col justify-start items-center gap-5">
      <KakaoButton isLogin={true} redirectUrl={redirectUrl} />
    </div>
  );
};
