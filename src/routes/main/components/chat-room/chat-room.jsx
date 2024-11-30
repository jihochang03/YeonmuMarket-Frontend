import React, { useState, useEffect } from "react";
import Modal from "../../../../components/modal";
import { MainIndex } from "../../../../components/main-index";
import { useNavigate, useParams } from "react-router-dom";
import {
  chatTickets,
  confirmTransferIntent,
  markPaymentCompleted,
  confirmReceipt,
  leaveChatRoom,
} from "../../../../apis/api";

const ChatRoom = () => {
  const [conversationData, setConversationData] = useState(null);
  const [ticketPostData, setTicketPostData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const { ticket_id } = useParams();

  useEffect(() => {
    const fetchConversationData = async () => {
      try {
        const response = await chatTickets(ticket_id);
        setConversationData(response.conversation_data);
        setTicketPostData(response.ticket_post_data);

        const initialMessages = [];
        if (response.conversation_data.transaction_step >= 1) {
          initialMessages.push(
            `${response.conversation_data.buyer_name}님이 양수 의사를 전했습니다.`
          );
        }
        if (response.conversation_data.transaction_step >= 2) {
          initialMessages.push(
            `${response.conversation_data.seller_name}님이 양도 의사를 확정했습니다.`
          );
        }
        if (response.conversation_data.transaction_step >= 3) {
          initialMessages.push(
            `${response.conversation_data.buyer_name}님이 입금을 완료했습니다. 입금을 확인해주세요.`
          );
        }
        if (response.conversation_data.transaction_step >= 4) {
          initialMessages.push(`양수가 완료되었습니다.`);
        }
        setMessages(initialMessages);
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 403) {
          alert("이미 다른 사용자가 대화방에 참여 중입니다.");
          navigate(-1);
        }
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
  const handleLeaveChatRoom = async () => {
    try {
      await leaveChatRoom(ticket_id); // Leave chat API 호출
      alert("대화방을 나갔습니다.");
      navigate("/main"); // 메인 페이지로 이동
    } catch (error) {
      console.error("Error leaving chat room:", error);
      alert("대화방 나가기 중 문제가 발생했습니다.");
    }
  };

  const handleConfirm = () => {
    setIsModalOpen(false);

    if (conversationData.user_role === "buyer") {
      if (conversationData.transaction_step === 0) {
        confirmTransferIntent(ticket_id)
          .then(() => {
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
        markPaymentCompleted(ticket_id)
          .then(() => {
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
        confirmTransferIntent(ticket_id)
          .then((response) => {
            setMessages((prev) => [
              ...prev,
              `${conversationData.seller_name}님이 양도 의사를 확정했습니다.`,
            ]);
            setConversationData((prev) => ({
              ...prev,
              transaction_step: 2,
              bank_account: response.bank_account,
              bank_name: response.bank_name,
              account_holder: response.account_holder,
            }));
          })
          .catch((error) => {
            console.error(error);
          });
      } else if (conversationData.transaction_step === 3) {
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

          {/* Display ticket post data */}
          {ticketPostData && (
            <div className="ticket-post-data">
              <h2>티켓 정보</h2>
              <p>공연명: {ticketPostData.ticket.title}</p>
              <p>좌석: {ticketPostData.ticket.seat}</p>
              <p>가격: {ticketPostData.ticket.price}</p>
              <img
                src={ticketPostData.ticket.uploaded_seat_image_url}
                alt="Seat Image"
                className="max-w-full"
              />
            </div>
          )}

          {/* Buyer-specific UI for step 1 */}
          {conversationData &&
            conversationData.user_role === "buyer" &&
            conversationData.transaction_step === 0 && (
              <button
                className="bg-black text-white px-4 py-2 rounded-md"
                onClick={() => handleModalOpen("양수 의사를 확정하시겠습니까?")}
              >
                양수 의사 확정
              </button>
            )}
          {conversationData &&
            conversationData.user_role === "buyer" &&
            conversationData.transaction_step <= 2 && (
              <button
                className="bg-black text-white px-4 py-2 rounded-md"
                onClick={handleLeaveChatRoom}
              >
                대화방 나가기
              </button>
            )}

          {conversationData &&
            conversationData.user_role === "seller" &&
            conversationData.transaction_step === 1 && (
              <button
                className="bg-black text-white px-4 py-2 rounded-md"
                onClick={() => handleModalOpen("양도 의사를 확정하시겠습니까?")}
              >
                양도 의사 확정
              </button>
            )}
          {conversationData &&
            conversationData.user_role === "seller" &&
            conversationData.transaction_step === 3 && (
              <button
                className="bg-black text-white px-4 py-2 rounded-md"
                onClick={() => handleModalOpen("입금이 확인되셨습니까?")}
              >
                입금 확인
              </button>
            )}

          {/* Buyer-specific UI for steps 2 to 3 */}
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

          {/* Buyer-specific UI for step 4 */}
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
                  onClick={() => {
                    window.location.href = `/main/purchased`; // 새로고침 후 이동
                  }}
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
