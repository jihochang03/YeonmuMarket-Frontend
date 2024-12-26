import React, { useState, useEffect } from "react";
import kakaoIcon from "../../../assets/icons/kakao_icon.svg";

export const KakaoButton = ({ isLogin, redirectUrl }) => {
  // 기본 리디렉트 URL 설정
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
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // 카카오톡 인앱 브라우저 확인
    if (/KAKAOTALK/i.test(userAgent)) {
      // 외부 브라우저 열기 (Android용 intent 스킴)
      const intentLink = `intent://${link.replace(
        /^https?:\/\//,
        ""
      )}#Intent;scheme=https;package=com.android.chrome;end;`;

      // iOS: Safari로 열기 (카카오톡 인앱 브라우저가 아닌 경우)
      if (/iPhone|iPad|iPod/i.test(userAgent)) {
        window.open(link, "_blank");
      } else {
        // Android 인앱 브라우저
        window.location.href = intentLink;
      }
    } else {
      // 기본 브라우저에서 열기
      window.location.href = link;
    }
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
