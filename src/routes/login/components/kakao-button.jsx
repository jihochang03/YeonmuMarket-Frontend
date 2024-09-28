import React from 'react';

export const KakaoButton = ({ isLogin }) => {
  const link = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.REACT_APP_KAKAO_SECRET_KEY}&redirect_uri=${import.meta.env.REACT_APP_KAKAO_REDIRECT_URI}&response_type=code`;

  const loginHandler = () => {
    window.location.href = link;
  };
  return (
    <button
      className="w-[450px] h-[58px] px-10 py-[13px] bg-[#fee502] rounded-xl justify-center items-center gap-[7px] inline-flex text-xl font-bold"
      onClick={loginHandler}
    >
      {isLogin ? '카카오로 로그인하기' : '카카오로 시작하기'}{' '}
    </button>
  );
};
