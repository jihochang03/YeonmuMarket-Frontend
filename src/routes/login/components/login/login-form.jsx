import React from "react";
import { KakaoButton } from "../kakao-button";
import { setLoginState, setUserProfile } from "../../../../redux/user-slice";

export const LoginForm = () => {
  return (
    <div className="w-[450px] flex flex-col justify-start items-center gap-5">
      <KakaoButton isLogin={true} />
    </div>
  );
};
