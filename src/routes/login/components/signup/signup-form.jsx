import React from 'react';
import { KakaoButton } from '../kakao-button';

export const SignUpForm = () => {
  return (
    <div className="self-stretch w-[450px] flex flex-col justify-start items-center gap-5">
      <KakaoButton isLogin={false} />
    </div>
  );
};
