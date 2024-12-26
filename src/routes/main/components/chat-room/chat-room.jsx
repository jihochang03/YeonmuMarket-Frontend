import React, { useState, useEffect, useRef } from "react";
import Modal from "../../../../components/modal";
import { MainIndex } from "../../../../components/main-index";
import { useNavigate, useParams, Link } from "react-router-dom";
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

  const refreshIntervalRef = useRef(null);

  const fetchConversationData = async (isSilent = false) => {
    try {
      const response = await chatTickets(ticket_id);

      // 새 데이터와 기존 conversationData를 비교해서 달라졌을 때만 상태 업데이트
      setConversationData((prev) => {
        if (
          JSON.stringify(prev) !== JSON.stringify(response.conversation_data)
        ) {
          return response.conversation_data;
        }
        return prev;
      });

      setTicketPostData((prev) => {
        if (
          JSON.stringify(prev) !== JSON.stringify(response.ticket_post_data)
        ) {
          return response.ticket_post_data;
        }
        return prev;
      });

      // 메시지 업데이트: transaction_step 사용
      if (!isSilent) {
        // 첫 렌더링 시에만 messages를 한 번 생성
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
      } else {
        // silent 갱신 시 transaction_step 변화를 감지해 추가 메시지를 보낼 수도 있음.
        // 여기서는 간단히 생략.
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 403) {
        alert("이미 다른 사용자가 대화방에 참여 중입니다.");
        navigate(-1);
      }
    }
  };

  // --------------------------------------------------
  // (3) 마운트 시 처음 데이터를 불러오고,
  //     10초마다 fetchConversationData를 호출
  // --------------------------------------------------
  useEffect(() => {
    // 처음 한 번은 메시지 세팅을 해야 하므로 isSilent=false
    fetchConversationData(false);

    // 10초마다 조용히 재갱신
    refreshIntervalRef.current = setInterval(() => {
      fetchConversationData(true);
    }, 60000);

    // 언마운트 시 interval 제거
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
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

  // URL 리전 변경 로직
  const fixRegionInUrl = (url) => {
    if (!url) return null;
    const regex = /s3\.ap-northeast-2\.amazonaws\.com/;
    return url.replace(regex, "s3.ap-southeast-2.amazonaws.com");
  };
  const fixedSeatImageUrl = ticketPostData
    ? fixRegionInUrl(ticketPostData.ticket.uploaded_seat_image_url)
    : null;
  const fixedSeatMaskedFileUrl = ticketPostData
    ? fixRegionInUrl(ticketPostData.ticket.uploaded_masked_file_url)
    : null;

  const fixedSeatFileUrl = ticketPostData
    ? fixRegionInUrl(ticketPostData.ticket.uploaded_file_url)
    : null;

  return (
    <div className="min-h-main-height flex flex-col">
      {/* MainIndex: 고정된 상단 메뉴 */}
      <MainIndex />
  
      {/* Main 컨테이너 */}
      <div className="flex-1 flex flex-col items-center mx-6">
        {/* Border 컨테이너: 높이 고정 및 내부 스크롤 */}
        <div className="border-2 border-gray-300 rounded-md mt-4 h-main-menu-height flex flex-col w-full">
          {/* 상단: 타이틀 */}
          <div className="p-4 flex items-center justify-between border-b border-gray-300">
            <h1 className="text-xl font-semibold text-center flex-1">
              {conversationData?.title} 거래방
            </h1>
            <Link
              to="/main/sold"
              className="absolute top-2 right-4 text-gray-500 hover:text-black text-2xl"
              title="돌아가기"
            >
              ×
            </Link>
          </div>
  
          {/* 중간: 스크롤 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* 메시지 목록 */}
            <div className="space-y-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className="chat-message text-sm p-2 bg-gray-100 rounded"
                >
                  {message}
                </div>
              ))}
            </div>
  
            {/* 티켓 정보 + 이미지 */}
            {ticketPostData && (
              <div className="p-4 border rounded space-y-2">
                <h2 className="font-semibold text-lg">티켓 정보</h2>
                <p>공연명: {ticketPostData.ticket.title}</p>
                <p>좌석: {ticketPostData.ticket.seat}</p>
                <p>가격: {ticketPostData.ticket.price}</p>
  
                {/* 좌석 이미지 */}
                <div className="max-h-60 overflow-y-auto">
                  {fixedSeatImageUrl && (
                    <img
                      src={fixedSeatImageUrl}
                      alt="좌석사진"
                      className="w-full object-cover border mb-2"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
  
          {/* 하단: 고정된 버튼 */}
          <div className="p-4 border-t border-gray-300">
            {(conversationData?.user_role === "buyer" &&
              conversationData?.transaction_step <= 2) ||
            (conversationData?.user_role === "seller" &&
              conversationData?.transaction_step <= 2) ? (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md w-full"
                onClick={handleLeaveChatRoom}
              >
                대화방 나가기
              </button>
            ) : null}
          </div>
        </div>
      </div>
  
      {/* Modal */}
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
