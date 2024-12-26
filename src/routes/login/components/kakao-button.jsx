import React, { useState, useEffect } from "react";
import kakaoIcon from "../../../assets/icons/kakao_icon.svg";

export const KakaoButton = ({ isLogin, redirectUrl }) => {
  // 만약 redirectUrl이 없다면, 기본적으로 /main/sold 같은 주소 지정
  const [finalRedirect, setFinalRedirect] = useState("/main/sold");

  useEffect(() => {
    if (redirectUrl) {
      setFinalRedirect(redirectUrl);
    }
  }, [redirectUrl]);
  const stateParam = encodeURIComponent(JSON.stringify(finalRedirect));

  const link = `https://kauth.kakao.com/oauth/authorize?client_id=${
    import.meta.env.VITE_KAKAO_SECRET_KEY
  }&redirect_uri=${encodeURIComponent(
    import.meta.env.VITE_KAKAO_REDIRECT_URI
  )}&response_type=code&state=${stateParam}`;
  console.log("Kakao authorization link:", link);

  const loginHandler = () => {
    // 카카오 인증 페이지로 이동
    window.location.href = link;
  };

  return (
    <button
      className="h-[58px] mx-4 px-16 py-[13px] bg-[#fee502] rounded-xl justify-center items-center gap-[7px] inline-flex text-xl font-bold"
      onClick={loginHandler}
    >
      <img src={kakaoIcon} alt="Kakao Icon" className="h-[24px] w-[24px]" />
      {isLogin ? "카카오로 로그인하기" : "카카오로 시작하기"}
    </button>
  );
};
