import React from 'react';
import { KakaoButton } from '../kakao-button';

export const LoginForm = () => {
  return (
    <div className="w-full max-w-md flex flex-col gap-5 items-start">
      <KakaoButton isLogin={true} />
    </div>
  );
};
