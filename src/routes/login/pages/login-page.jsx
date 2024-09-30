import React, { useState } from 'react';
import { LoginForm } from '../components/login/login-form';
import { SignUpForm } from '../components/signup/signup-form';
import shakingIcon from "../../../assets/icons/emoji/shaking.png";
import maskIcon from "../../../assets/icons/emoji/mask.png";
import ticketIcon from "../../../assets/icons/emoji/ticket.png";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="w-full h-main-height flex justify-center items-center">
      <div className="w-main-frame h-main-height flex flex-col justify-center items-start gap-12">
        <div className="flex flex-col gap-4 px-10 text-left">
          <div className="flex items-center gap-2">
            <img src={shakingIcon} alt="shaking hands" className="w-8 h-8" />
            <span className="text-2xl font-bold">안전한</span>
          </div>
          <div className="flex items-center gap-2">
            <img src={maskIcon} alt="theater mask" className="w-8 h-8" />
            <span className="text-2xl font-bold">연극.뮤지컬 전용</span>
          </div>
          <div className="flex items-center gap-2">
            <img src={ticketIcon} alt="ticket" className="w-8 h-8" />
            <span className="text-2xl font-bold">티켓 양도 플랫폼</span>
          </div>
        </div>
        {isLogin ? <LoginForm /> : <SignUpForm />}
      </div>
    </div>
  );
};

export default LoginPage;