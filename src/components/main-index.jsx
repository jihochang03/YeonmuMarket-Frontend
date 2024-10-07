import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const MainIndex = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className='w-full flex justify-around items-center pt-3 px-5'>
      <button 
        onClick={() => navigate('/main/new')} 
        className={`button ${isActive('/main/new') ? 'bg-selected-menu' : ''}`}
      >
        양도글 작성
      </button>
      <button 
        onClick={() => navigate('/main/sold')} 
        className={`button ${isActive('/main/sold') ? 'bg-selected-menu' : ''}`}
      >
        판매한 티켓
      </button>
      <button 
        onClick={() => navigate('/main/purchased')} 
        className={`button ${isActive('/main/purchased') ? 'bg-selected-menu' : ''}`}
      >
        구매한 티켓
      </button>
      <button 
        onClick={() => navigate('/main/settings')} 
        className={`button ${isActive('/main/settings') ? 'bg-selected-menu' : ''}`}
      >
        설정
      </button>
    </div>
  )
};