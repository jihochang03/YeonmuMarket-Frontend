// src/routes/account/pages/account-edit-page.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BankSelectionPage from './bank-selection-page';
import banks from '../components/bank';
import ErrorModal from '../../../components/errorModal';
import { updateAccount, fetchAccount } from '../../../apis/api';

const AccountEditPage = () => {
  const [name, setName] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [selectedBank, setSelectedBank] = useState(null);
  const [error, setError] = useState('');
  const [isBankSelection, setIsBankSelection] = useState(false);
  const [isAccountConfirmation, setIsAccountConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 기존 계좌 정보 불러오기
    const loadAccountInfo = async () => {
      try {
        const accountData = await fetchAccount();
        setName(accountData.account_holder || '');
        setAccountNum(accountData.bank_account || '');
        const bank = banks.find((b) => b.name === accountData.bank_name);
        setSelectedBank(bank || null);
      } catch (error) {
        console.error('Error fetching account info:', error);
        setError('계좌 정보를 불러오는데 실패했습니다.');
      }
    };

    loadAccountInfo();
  }, []);

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setIsBankSelection(false);
  };

  const handleRetry = () => {
    setError('');
  };

  const handleSubmit = async () => {
    if (!name || !accountNum || !selectedBank) {
      setError('모든 필드를 입력해 주세요.');
      return;
    }

    // 계좌 정보 업데이트 요청
    try {
      const accountData = {
        accountNum,
        bank: selectedBank.name,
        account_holder: name,
      };

      const response = await updateAccount(accountData);
      if (response) {
        alert('계좌 정보가 수정되었습니다.');
        navigate('/main/sold');
      } else {
        setError('계좌 정보 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating account:', error);
      setError('서버 연결에 실패했습니다.');
    }
  };

  if (isBankSelection) {
    return <BankSelectionPage banks={banks} onSelectBank={handleBankSelect} redirectTo={'/account-edit'} />;
  }

  return (
    <div className="max-w-lg h-main-height p-1 rounded-md mx-5">
      <h3 className="w-full flex justify-center mt-2 font-semibold">계좌 정보 수정</h3>
      <div className="w-full bg-gray-100 flex flex-col px-4 rounded-sm pb-2 mb-4">
        <label className="block mb-2 font-bold mt-4">이름</label>
        <input
          type="text"
          placeholder=""
          className="border p-2 mb-4 rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="block mb-2 font-bold mt-4">계좌번호</label>
        <input
          type="text"
          placeholder=""
          className="border p-2 mb-4 rounded-md"
          value={accountNum}
          onChange={(e) => setAccountNum(e.target.value)}
        />
        <label className="block mb-2 font-bold">은행 선택</label>
        <button
          onClick={() => setIsBankSelection(true)}
          className="border p-2 rounded-md mb-2 py-8"
        >
          {selectedBank ? (
            <div className="flex flex-col items-center">
              <img
                src={selectedBank.logo}
                alt={`${selectedBank.name} 로고`}
                className="w-12 h-12"
              />
              <div>{selectedBank.name}</div>
            </div>
          ) : (
            '은행 선택하기'
          )}
        </button>
      </div>
      {error && (
        <ErrorModal
          message={error}
          onClose={() => setError('')}
          onRetry={handleRetry}
        />
      )}
      <button
        className="w-full items-center bg-purple-200 flex justify-center py-3 mb-3 font-bold rounded-sm"
        onClick={handleSubmit}
      >
        수정 완료
      </button>
    </div>
  );
};

export default AccountEditPage;
