import React from 'react';
import { useNavigate } from 'react-router-dom';

const BankSelectionPage = ({ banks, onSelectBank, redirectTo }) => {
  const navigate = useNavigate();

  const handleBankSelect = (bank) => {
    onSelectBank(bank);
    navigate(redirectTo);
  };

  return (
    <div className='w-full h-screen pt-header-height p-5 mx-auto'>
      <div className='mt-10 mb-12 flex justify-center font-bold text-lg'>송금 받을 계좌의 은행을 선택하세요.</div>
      <div className='grid grid-cols-3 gap-4'>
        {banks.map((bank) => (
          <button
            key={bank.name}
            onClick={() => handleBankSelect(bank)}
            className='border p-3 rounded-md flex flex-col justify-center items-center bg-gray-100'
          >
            <img src={bank.logo} alt={`${bank.name} 로고`} className='w-14 h-14' />
            <div>{bank.name}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default BankSelectionPage;