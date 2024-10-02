import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/header.jsx';
import LoginPage from './routes/login/pages/login-page.jsx';
import MainPage from './routes/main/pages/main-page.jsx';
import TermsPage from './routes/terms/pages/terms-page.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState('');

  return (
    <div className='min-h-screen bg-darker flex flex-col items-center'>
      <BrowserRouter>
      <div className='w-main-frame bg-white'>
        <Header isLoggedIn={isLoggedIn} setSelectedMenu={setSelectedMenu}/> 
        <body>
          <div className='flex flex-col'>
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/main" element={<MainPage selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu}/>} />
                <Route path="/terms" element={<TermsPage />} />
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
