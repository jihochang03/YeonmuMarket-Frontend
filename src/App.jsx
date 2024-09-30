import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/header.jsx';
import LoginPage from './routes/login/pages/login-page.jsx';
import MainPage from './routes/main/pages/main-page.jsx';

function App() {
  return (
    <div className='min-h-screen bg-darker flex flex-col items-center'>
      <BrowserRouter>
      <div className='w-main-frame bg-white'>
        <Header/> 
        <body>
          <div className='flex flex-col'>
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/main" element={<MainPage />} />
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
