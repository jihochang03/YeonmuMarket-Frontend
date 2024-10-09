import React, { useEffect, useState } from 'react';
import { LoginForm } from '../components/login/login-form';
import { SignUpForm } from '../components/signup/signup-form';
import { Introducement } from '../../../components/introduce-section';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-full h-main-height flex justify-center items-center">
      <div className="w-main-frame h-main-height flex flex-col justify-center items-start gap-12">
        <Introducement/>
        {isLogin ? <LoginForm /> : <SignUpForm />}
      </div>
    </div>
  );
};

export default LoginPage;