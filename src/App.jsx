import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/header.jsx';
import LoginPage from './routes/login/pages/login-page.jsx';
import MainPage from './routes/main/pages/main-page.jsx';

function App() {
  return (
    <BrowserRouter>
      <Header/> 
      <body>
        <div className='flex flex-col'>
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </div>
        </div>
      </body>
    </BrowserRouter>
  );
};

export default App;
