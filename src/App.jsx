import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/header.jsx';
import LoginPage from './routes/login/pages/login-page.jsx';
import MainPage from './routes/main/pages/main-page.jsx';
import TermsPage from './routes/terms/pages/terms-page.jsx';
import Auth from './routes/login/pages/auth.jsx';
import AccountAuthPage from './routes/account-auth/pages/account-auth-page.jsx';
import { useSelector } from 'react-redux';

function App() {
  const isLogin = useSelector((state) => state.user.isLogin);

  return (
    <div className='min-h-screen bg-darker flex flex-col items-center'>
      <BrowserRouter>
      <div className='w-main-frame bg-white'>
        <Header isLogin={isLogin} /> 
        <body>
          <div className='flex flex-col'>
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/main/*" element={<MainPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/account-auth" element={<AccountAuthPage />} />
              </Routes>
            </div>
          </div>
        </body>
      </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
