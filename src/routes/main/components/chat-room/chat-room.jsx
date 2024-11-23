import React, { useState } from "react";
import Modal from '../../../../components/modal';
import { MainIndex } from "../../../../components/main-index";
import { useLocation, useNavigate } from "react-router-dom";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [step, setStep] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const ticketData = location.state?.ticketData;

  const buyerName = ticketData?.transferee;
  const sellerName = ticketData?.owner;

  let activeTab = '';
  if (location.state && location.state.from) {
    if (location.state.from === '/main/sold') {
      activeTab = '/main/sold';
    } else if (location.state.from === '/main/purchased') {
      activeTab = '/main/purchased';
    }
  }

  const handleModalOpen = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    if (step === 0) {
      setMessages((prevMessages) => [
        ...prevMessages,
        `${buyerName}님이 양도 의사를 전했습니다.`,
      ]);
      setStep(1);
    } else if (step === 1) {
      setMessages((prevMessages) => [
        ...prevMessages,
        `${sellerName}님이 양도 의사를 확정했습니다.`,
      ]);
      setStep(2);
    } else if (step === 2) {
      setMessages((prevMessages) => [
        ...prevMessages,
        `${buyerName}님이 입금을 완료했습니다. 입금을 확인해주세요.`,
      ]);
      setStep(3);
    } else if (step === 3) {
      setMessages((prevMessages) => [
        ...prevMessages,
        `양수가 완료되었습니다.`,
      ]);
      setStep(4);
    }
  };

  return (
    <div className="min-h-main-height">
      <MainIndex activeTab={activeTab} />
      <div className="border-2 border-gray-300 min-h-main-menu-height rounded-md mt-4 mx-6">
        <div className="chat-room-container">
          <h1 className="text-center">{ticketData?.title} 거래방</h1>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className="chat-message">
                {message}
              </div>
            ))}
          </div>
          {step === 0 && (
            <button
              className="bg-black text-white px-4 py-2 rounded-md"
              onClick={() => handleModalOpen('양수 의사를 확정하고 \n양도자에게 알리겠습니까?')}
            >
              양수 의사 확정
            </button>
          )}
          {step === 1 && (
            <button
              className="bg-black text-white px-4 py-2 rounded-md"
              onClick={() => handleModalOpen('양도 의사를 확정하고 \n계좌 정보를 전달하겠습니까?')}
            >
              양도 의사 확정
            </button>
          )}
          {step === 2 && (
            <button
              className="bg-black text-white px-4 py-2 rounded-md"
              onClick={() => handleModalOpen('입금을 완료하셨습니까?')}
            >
              입금 완료
            </button>
          )}
          {step === 3 && (
            <button
              className="bg-black text-white px-4 py-2 rounded-md"
              onClick={() => handleModalOpen('입금 내역을 확인하셨나요? \n양수자에게 예매 정보가 전달되며, \n이는 취소할 수 없습니다.')}
            >
              입금 확인
            </button>
          )}
          {step === 4 && (
            <button
              className="bg-black text-white px-4 py-2 rounded-md"
              onClick={() => alert('티켓 상세화면으로 이동합니다.')}
            >
              티켓 정보 보러 가기
            </button>
          )}
      </div>
      </div>
      {isModalOpen && (
        <Modal
          message={modalMessage}
          onClose={handleModalClose}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default ChatRoom;
