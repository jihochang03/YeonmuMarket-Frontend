// ChatRoom.js

import React, { useState, useEffect } from "react";
import Modal from "../../../../components/modal";
import { MainIndex } from "../../../../components/main-index";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  chatTickets,
  confirmTransferIntent,
  markPaymentCompleted,
  confirmReceipt,
} from "../../../../apis/api";

const ChatRoom = () => {
  const [conversationData, setConversationData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const { ticket_id } = useParams();

  useEffect(() => {
    const fetchConversationData = async () => {
      try {
        const response = await chatTickets(ticket_id);
        setConversationData(response);

        // transaction_step에 따른 메시지 설정
        const initialMessages = [];
        if (response.transaction_step >= 1) {
          initialMessages.push(
            `${response.buyer_name}님이 양수 의사를 전했습니다.`
          );
        }
        if (response.transaction_step >= 2) {
          initialMessages.push(
            `${response.seller_name}님이 양도 의사를 확정했습니다.`
          );
        }
        if (response.transaction_step >= 3) {
          initialMessages.push(
            `${response.buyer_name}님이 입금을 완료했습니다. 입금을 확인해주세요.`
          );
        }
        if (response.transaction_step >= 4) {
          initialMessages.push(`양수가 완료되었습니다.`);
        }
        setMessages(initialMessages);
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 403) {
          alert("이미 다른 사용자가 대화방에 참여 중입니다.");
          navigate(-1); // 이전 페이지로 이동
        }
        // 다른 에러 처리
      }
    };
    fetchConversationData();
  }, [ticket_id]);

  const handleModalOpen = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);

    if (conversationData.user_role === "buyer") {
      if (conversationData.transaction_step === 0) {
        // 양수자가 양수 의사 확정
        confirmTransferIntent(ticket_id)
          .then((response) => {
            setMessages((prev) => [
              ...prev,
              `${conversationData.buyer_name}님이 양수 의사를 전했습니다.`,
            ]);
            setConversationData((prev) => ({
              ...prev,
              transaction_step: 1,
            }));
          })
          .catch((error) => {
            console.error(error);
          });
      } else if (conversationData.transaction_step === 2) {
        // 양수자가 입금 완료 확인
        markPaymentCompleted(ticket_id)
          .then((response) => {
            setMessages((prev) => [
              ...prev,
              `${conversationData.buyer_name}님이 입금을 완료했습니다. 입금을 확인해주세요.`,
            ]);
            setConversationData((prev) => ({
              ...prev,
              transaction_step: 3,
            }));
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } else if (conversationData.user_role === "seller") {
      if (conversationData.transaction_step === 1) {
        // 양도자가 양도 의사 확정
        confirmTransferIntent(ticket_id)
          .then((response) => {
            setMessages((prev) => [
              ...prev,
              `${conversationData.seller_name}님이 양도 의사를 확정했습니다.`,
            ]);
            setConversationData((prev) => ({
              ...prev,
              transaction_step: 2,
            }));
            // 필요한 경우 은행 계좌 정보를 업데이트
            if (response.bank_account) {
              setConversationData((prev) => ({
                ...prev,
                bank_account: response.bank_account,
                bank_name: response.bank_name,
                account_holder: response.account_holder,
              }));
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else if (conversationData.transaction_step === 3) {
        // 양도자가 입금 확인 및 거래 완료
        confirmReceipt(ticket_id)
          .then((response) => {
            setMessages((prev) => [...prev, `양수가 완료되었습니다.`]);
            setConversationData((prev) => ({
              ...prev,
              transaction_step: 4,
              ticket_file_url: response.ticket_file_url,
              phone_last_digits: response.phone_last_digits,
            }));
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  };

  return (
    <div className="min-h-main-height">
      <MainIndex />
      <div className="border-2 border-gray-300 min-h-main-menu-height rounded-md mt-4 mx-6">
        <div className="chat-room-container">
          <h1 className="text-center">{conversationData?.title} 거래방</h1>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className="chat-message">
                {message}
              </div>
            ))}
          </div>
          {/* Conditional rendering based on transaction_step and user_role */}
          {conversationData &&
            conversationData.user_role === "buyer" &&
            conversationData.transaction_step === 0 && (
              <>
                {/* Display masked ticket and seat images */}
                {conversationData.masked_file_url && (
                  <img
                    src={conversationData.masked_file_url}
                    alt="Masked Ticket"
                  />
                )}
                {conversationData.processed_seat_image_url && (
                  <img
                    src={conversationData.processed_seat_image_url}
                    alt="Seat Image"
                  />
                )}
                {/* Only the buyer sees this button at transaction_step === 0 */}
                <button
                  className="bg-black text-white px-4 py-2 rounded-md"
                  onClick={() =>
                    handleModalOpen(
                      "양수 의사를 확정하고 양도자에게 알리겠습니까?"
                    )
                  }
                >
                  양수 의사 확정
                </button>
              </>
            )}
          {/* Other conditional renderings... */}
          {conversationData &&
            conversationData.user_role === "seller" &&
            conversationData.transaction_step === 1 && (
              <button
                className="bg-black text-white px-4 py-2 rounded-md"
                onClick={() =>
                  handleModalOpen(
                    "양도 의사를 확정하고 계좌 정보를 전달하겠습니까?"
                  )
                }
              >
                양도 의사 확정
              </button>
            )}
          {conversationData &&
            conversationData.user_role === "buyer" &&
            conversationData.transaction_step === 0 && (
              <>
                {conversationData.seat_image_url && (
                  <img src={conversationData.seat_image_url} alt="Seat Image" />
                )}
                <button
                  className="bg-black text-white px-4 py-2 rounded-md"
                  onClick={() =>
                    handleModalOpen(
                      "양수 의사를 확정하고 양도자에게 알리겠습니까?"
                    )
                  }
                >
                  양수 의사 확정
                </button>
              </>
            )}
          {conversationData &&
            conversationData.user_role === "buyer" &&
            conversationData.transaction_step >= 2 &&
            conversationData.transaction_step < 4 && (
              <>
                {conversationData.masked_file_url && (
                  <img
                    src={conversationData.masked_file_url}
                    alt="Masked Booking Confirmation"
                  />
                )}
                <p>은행: {conversationData.bank_name}</p>
                <p>계좌번호: {conversationData.bank_account}</p>
                <p>예금주: {conversationData.account_holder}</p>
                {conversationData.transaction_step === 2 && (
                  <button
                    className="bg-black text-white px-4 py-2 rounded-md"
                    onClick={() => handleModalOpen("입금을 완료하셨습니까?")}
                  >
                    입금 완료
                  </button>
                )}
              </>
            )}
          {conversationData &&
            conversationData.transaction_step >= 4 &&
            conversationData.user_role === "buyer" && (
              <>
                {conversationData.ticket_file_url && (
                  <img
                    src={conversationData.ticket_file_url}
                    alt="Ticket File"
                  />
                )}
                {conversationData.seat_image_url && (
                  <img src={conversationData.seat_image_url} alt="Seat Image" />
                )}
                <p>
                  양도자 전화번호 뒷자리: {conversationData.phone_last_digits}
                </p>
                <button
                  className="bg-black text-white px-4 py-2 rounded-md"
                  onClick={() => navigate(`/main/purchased/${ticket_id}`)}
                >
                  티켓 정보 보러 가기
                </button>
              </>
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
