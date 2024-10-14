import React from "react";
import kakaoIcon from "../../../assets/icons/kakao_icon.svg";

export const KakaoButton = ({ isLogin }) => {
  // Fixed URL to redirect to after login

  // Create the Kakao login URL with the state parameter set to the main page
  const link = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_SECRET_KEY}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}&response_type=code`;


  const loginHandler = () => {
    window.location.href = link; // Redirect to the Kakao OAuth authorization page
  };

  return (
    <button
      className="w-[380px] h-[58px] px-10 py-[13px] bg-[#fee502] rounded-xl justify-center items-center gap-[7px] inline-flex text-xl font-bold"
      onClick={loginHandler}
    >
      <img src={kakaoIcon} alt="Kakao Icon" className="h-[24px] w-[24px]" />
      {isLogin ? "카카오로 로그인하기" : "카카오로 시작하기"}{" "}
    </button>
  );
};
