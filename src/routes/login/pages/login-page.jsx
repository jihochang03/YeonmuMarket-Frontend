import React, { useState } from 'react';
import { LoginForm } from '../components/login/login-form';
import { SignUpForm } from '../components/signup/signup-form';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div
      className={`w-screen h-[calc(100vh-80px)] flex justify-center items-center`}
    >
      <div className="w-[450px] h-[590px] flex flex-col justify-center items-center gap-12">
        <h3 className="text-4xl font-extrabold text-neutral-800 nanum-extra-bold">
          {isLogin ? '로그인' : '회원가입'}
        </h3>
        {isLogin ? <LoginForm /> : <SignUpForm />}
      </div>
    </div>
  );
};

export default LoginPage;