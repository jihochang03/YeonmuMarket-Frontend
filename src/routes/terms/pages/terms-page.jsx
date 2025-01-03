import React, { useState } from 'react';
import { TermsForm } from '../components/terms-form';
import { useNavigate } from 'react-router-dom';

const TermsPage = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/main/new');
  };

  return (
    <div className="w-full h-screen flex-col flex justify-between pt-header-height">
      <TermsForm/>
      <button onClick={handleNavigate} className="bg-black text-white px-10 rounded-md mx-auto flex mb-10">확인</button>
    </div>
  );
};

export default TermsPage;