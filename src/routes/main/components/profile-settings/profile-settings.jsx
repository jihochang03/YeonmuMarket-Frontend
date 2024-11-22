import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../../../src/components/modal';

export const ProfileSettings = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(null);

  // 버튼 클릭 핸들러들
  const handleAccountEdit = () => {
    navigate('/account-edit');
  };

  const handleLogout = () => {
    setModalMessage('로그아웃할까요?');
    setOnConfirmAction(() => () => {
      alert('로그아웃 되었습니다.');
      navigate('/');
    });
    setIsModalVisible(true);
  };

  const handleAccountDelete = () => {
    setModalMessage('정말 계정을 탈퇴하시겠습니까?');
    setOnConfirmAction(() => () => {
      alert('계정이 탈퇴되었습니다.');
      navigate('/');
    });
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div className='px-6 py-3'>
      <div className="w-full flex flex-col border-2 border-gray-100 rounded-md justify-center items-center p-4">
        <h3 className="text-lg font-bold mb-6 w-full text-left px-2">설정</h3>
        <button
          onClick={handleAccountEdit}
          className="w-11/12 bg-gray-200 text-black font-medium py-2 mb-6 rounded-md"
        >
          계좌 정보 수정
        </button>
        <button
          onClick={handleLogout}
          className="w-11/12 bg-gray-200 text-black font-medium py-2 mb-6 rounded-md"
        >
          로그아웃
        </button>
        <button
          onClick={handleAccountDelete}
          className="w-11/12 bg-gray-200 text-black font-medium py-2 rounded-md"
        >
          계정 탈퇴
        </button>
      </div>
      {isModalVisible && (
        <Modal
          message={modalMessage}
          onClose={handleModalClose}
          onConfirm={() => {
            onConfirmAction();
            handleModalClose();
          }}
        />
      )}
    </div>
  );
};
