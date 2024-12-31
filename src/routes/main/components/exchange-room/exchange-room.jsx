import React, { useState, useEffect, useRef } from "react";
import Modal from "../../../../components/modal";
import { MainIndex } from "../../../../components/main-index";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  exchangeTickets,
  confirmTransferIntent,
  markPaymentCompleted,
  confirmReceipt,
  leaveChatRoom,
} from "../../../../apis/api";

const ExchangeRoom = () => {
  const [exchangeData, setExchangeData] = useState(null);
  const [ticketBuyerPostData, setTicketBuyerPostData] = useState(null);
  const [ticketSellerPostData, setTicketSellerPostData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const { ticket_id } = useParams();
  const [differenceAmount, setDifferenceAmount] = useState(0);
  const [payDirection, setPayDirection] = useState("none");

  const refreshIntervalRef = useRef(null);

  const fetchExchangeData = async (isSilent = false) => {
    try {
      const response = await exchangeTickets(ticket_id);

      // 새 데이터와 기존 exchangeData를 비교해서 달라졌을 때만 상태 업데이트
      setExchangeData((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(response.exchange_data)) {
          return response.exchange_data;
        }
        return prev;
      });

      setTicketSellerPostData((prev) => {
        if (
          JSON.stringify(prev) !==
          JSON.stringify(response.ticket_post_data_seller)
        ) {
          return response.ticket_post_data_seller;
        }
        return prev;
      });

      setTicketBuyerPostData((prev) => {
        if (
          JSON.stringify(prev) !==
          JSON.stringify(response.ticket_post_data_buyer)
        ) {
          return response.ticket_post_data_buyer;
        }
        return prev;
      });

      // 메시지 업데이트: transaction_step 사용
      if (!isSilent) {
        // 첫 렌더링 시에만 messages를 한 번 생성
        const initialMessages = [];
        if (response.exchange_data.transaction_step == 1) {
          initialMessages.push(
            `교환 의사가 확정되었습니다.`
          );
        }
        if (response.exchange_data.transaction_step == 2) {
          initialMessages.push(
            `차액 지불 금액을 입력해주세요`
          );
        }
        if (response.exchange_data.transaction_step == 3) {
          initialMessages.push(
            `입금을 완료했습니다. 입금을 확인해주세요`
          );
        }
        if (response.exchange_data.transaction_step == 4) {
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
  //     10초마다 fetchExchangeData를 호출
  // --------------------------------------------------
  useEffect(() => {
    // 처음 한 번은 메시지 세팅을 해야 하므로 isSilent=false
    fetchExchangeData(false);

    // 60초마다 조용히 재갱신
    refreshIntervalRef.current = setInterval(() => {
      fetchExchangeData(true);
    }, 60000);

    // 언마운트 시 interval 제거
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [ticket_id]);

  useEffect(() => {
    if (
      ticketBuyerPostData &&
      ticketBuyerPostData.ticket &&
      ticketSellerPostData &&
      ticketSellerPostData.ticket
    ) {
      const buyerPrice = Number(ticketBuyerPostData.ticket.price || 0);
      const sellerPrice = Number(ticketSellerPostData.ticket.price || 0);
      const diff = sellerPrice - buyerPrice;

      if (diff > 0) {
        // seller 티켓이 더 비쌈 → buyer → seller 차액 지불
        setPayDirection("buyerToSeller");
        setDifferenceAmount(diff);
      } else if (diff < 0) {
        // buyer 티켓이 더 비쌈 → seller → buyer 차액 지불
        setPayDirection("sellerToBuyer");
        setDifferenceAmount(Math.abs(diff));
      } else {
        // diff = 0 → 동일 가격
        setPayDirection("none");
        setDifferenceAmount(0);
      }
    }
  }, [ticketBuyerPostData, ticketSellerPostData]);

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

   // ----------------------------------------------
  // (6) 모달에서 '확인' 버튼 클릭 시 동작
  //     - transaction_step 순서에 맞춰 분기 처리
  // ----------------------------------------------
  const handleConfirm = async () => {
    setIsModalOpen(false);

    if (!exchangeData) return;

    const { transaction_step, user_role } = exchangeData;

    try {
      // step=0: 교환 의사(양쪽) 확정 → transaction_step=1
      if (transaction_step === 0) {
        // 예: 각자 교환 의사 요청을 보내면, 서버가 "양쪽 모두 동의" 시점에 step=1로
        await confirmTransferIntent(ticket_id, user_role);

        setMessages((prev) => [
          ...prev,
          `${user_role === "buyer" ? "구매자" : "판매자"}가 교환 의사를 확정했습니다.`,
        ]);

        fetchExchangeData(true);
        return;
      }

      // step=1: 차액 확정 → transaction_step=2
      //   (서버에서 가격 차이, 누가 낼지/받을지를 저장해두고 step=2로 변경)
      if (transaction_step === 1) {
        // 서버에 차액 정보, 누가 내야 하는지 등을 전달 → step=2
        // 예) await confirmDifference(ticket_id, differenceAmount, payDirection);
        setMessages((prev) => [
          ...prev,
          `차액 ${differenceAmount}원( ${
            payDirection === "buyerToSeller" ? "구매자→판매자" : "판매자→구매자"
          } ) 확정 완료`,
        ]);

        fetchExchangeData(true);
        return;
      }

      // step=2: 돈 내는 쪽의 "입금 완료" → transaction_step=3
      if (transaction_step === 2) {
        await markExchangePaymentCompleted(ticket_id);
        setMessages((prev) => [
          ...prev,
          `입금을 완료했습니다. 상대방이 확인할 때까지 대기해주세요.`,
        ]);
        fetchExchangeData(true);
        return;
      }

      // step=3: 돈 받는 쪽의 "입금 확인" → transaction_step=4
      if (transaction_step === 3) {
        await confirmExchangeReceipt(ticket_id);
        setMessages((prev) => [
          ...prev,
          `입금 확인이 완료되었습니다. 거래가 종료됩니다.`,
        ]);
        fetchExchangeData(true);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  // URL 리전 변경 로직
  const fixRegionInUrl = (url) => {
    if (!url) return null;
    const regex = /s3\.ap-northeast-2\.amazonaws\.com/;
    return url.replace(regex, "s3.ap-southeast-2.amazonaws.com");
  };
  const fixedBuyerSeatImageUrl = ticketBuyerPostData
    ? fixRegionInUrl(ticketBuyerPostData.ticket.uploaded_seat_image_url)
    : null;
  const fixedBuyerSeatMaskedFileUrl = ticketBuyerPostData
    ? fixRegionInUrl(ticketBuyerPostData.ticket.uploaded_masked_file_url)
    : null;

  const fixedBuyerSeatFileUrl = ticketBuyerPostData
    ? fixRegionInUrl(ticketBuyerPostData.ticket.uploaded_file_url)
    : null;
  const fixedSellerSeatImageUrl = ticketSellerPostData
    ? fixRegionInUrl(ticketSellerPostData.ticket.uploaded_seat_image_url)
    : null;
  const fixedSellerSeatMaskedFileUrl = ticketSellerPostData
    ? fixRegionInUrl(ticketSellerPostData.ticket.uploaded_masked_file_url)
    : null;

  const fixedSellerSeatFileUrl = ticketSellerPostData
    ? fixRegionInUrl(ticketSellerPostData.ticket.uploaded_file_url)
    : null;

    const transaction_step = exchangeData?.transaction_step ?? 0;
    const user_role = exchangeData?.user_role ?? "";
  
    const renderOpponentTicketInfo = () => {
      if (!ticketBuyerPostData || !ticketSellerPostData || !exchangeData) return null;
  
      // buyer → seller의 티켓 표시
      if (user_role === "buyer") {
        const { ticket } = ticketSellerPostData;
        return (
          <div className="p-4 border rounded space-y-4">
            <h2 className="font-semibold text-lg">상대방(판매자)의 티켓 정보</h2>
            <p>공연명: {ticket.title}</p>
            <p>좌석: {ticket.seat}</p>
            <p>가격: {ticket.price}</p>
            <div className="max-h-60 overflow-y-auto">
              {transaction_step < 4 ? (
                fixedSellerSeatImageUrl && (
                  <img
                    src={fixedSellerSeatImageUrl}
                    alt="seller seat"
                    className="w-full object-cover border mb-2"
                  />
                )
              ) : (
                fixedSellerSeatFileUrl && (
                  <img
                    src={fixedSellerSeatFileUrl}
                    alt="seller unmasked"
                    className="w-full object-cover border mb-2"
                  />
                )
              )}
            </div>
  
            {/* step >=4일 때 판매자 휴대폰 뒷자리 노출 */}
            {transaction_step >= 4 && (
              <p>판매자 전화번호 뒷자리: {ticket.phone_last_digits}</p>
            )}
          </div>
        );
      }
      // seller → buyer의 티켓 표시
      else {
        const { ticket } = ticketBuyerPostData;
        return (
          <div className="p-4 border rounded space-y-4">
            <h2 className="font-semibold text-lg">상대방(구매자)의 티켓 정보</h2>
            <p>공연명: {ticket.title}</p>
            <p>좌석: {ticket.seat}</p>
            <p>가격: {ticket.price}</p>
            <div className="max-h-60 overflow-y-auto">
              {transaction_step < 4 ? (
                fixedBuyerSeatImageUrl && (
                  <img
                    src={fixedBuyerSeatImageUrl}
                    alt="buyer seat"
                    className="w-full object-cover border mb-2"
                  />
                )
              ) : (
                fixedBuyerSeatFileUrl && (
                  <img
                    src={fixedBuyerSeatFileUrl}
                    alt="buyer unmasked"
                    className="w-full object-cover border mb-2"
                  />
                )
              )}
            </div>
  
            {/* step >=4일 때 구매자 휴대폰 뒷자리 노출 */}
            {transaction_step >= 4 && (
              <p>구매자 전화번호 뒷자리: {ticket.phone_last_digits}</p>
            )}
          </div>
        );
      }
    };
  
    // ----------------------------------------------
    // (9) JSX 리턴
    // ----------------------------------------------
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="w-main-frame h-screen flex flex-col fixed">
          <MainIndex />
          <div className="flex-1 overflow-y-auto px-3 pt-1">
            {/* 메인 컨테이너 */}
            <div className="border-2 border-gray-300 min-h-main-menu-height rounded-md mt-4 mx-6 flex flex-col">
              {/* 상단: 타이틀 */}
              <div className="p-4 flex items-center justify-between border-b border-gray-300 relative">
                <h1 className="text-xl font-semibold text-center flex-1">
                  {exchangeData?.title} 거래방
                </h1>
                <Link
                  to="/main/sold"
                  className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
                  title="돌아가기"
                >
                  ×
                </Link>
              </div>
  
              {/* 중간: 스크롤 영역 (메시지, 티켓 정보, 버튼 등) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
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
  
                {/* 상대방 티켓 정보 */}
                {renderOpponentTicketInfo()}
  
                {/* 현재 단계(transaction_step)에 따른 버튼/안내 */}
                <div className="space-y-4">
                  {/* step=0: 교환 의사 버튼 (buyer/seller 둘 다) */}
                  {transaction_step === 0 && (
                    <button
                      className="bg-black text-white px-4 py-2 rounded-md"
                      onClick={() =>
                        handleModalOpen("교환 의사를 확정하시겠습니까?")
                      }
                    >
                      교환 의사 확정
                    </button>
                  )}
  
                  {/* step=1: 자동 계산된 차액 표시 + 차액 확정 버튼 */}
                  {transaction_step === 1 && (
                    <div className="p-4 border rounded space-y-3">
                      {/* 가격이 동일하면 차액=0, 아니면 누가 내야/받아야 하는지 표시 */}
                      {payDirection === "none" ? (
                        <p>두 티켓 가격이 동일하므로 차액이 없습니다.</p>
                      ) : (
                        <div>
                          <p>
                            차액: <strong>{differenceAmount}원</strong>
                          </p>
                          <p>
                            {payDirection === "buyerToSeller"
                              ? "구매자 → 판매자에게 차액 지불"
                              : "판매자 → 구매자에게 차액 지불"}
                          </p>
                        </div>
                      )}
                      <button
                        className="bg-black text-white px-4 py-2 rounded-md w-full"
                        onClick={() =>
                          handleModalOpen("차액을 확정하시겠습니까?")
                        }
                      >
                        차액 확정
                      </button>
                    </div>
                  )}
  
                  {/* step=2: 돈 내는 쪽 → '입금 완료' 버튼 */}
                  {transaction_step === 2 && (
                    <button
                      className="bg-black text-white px-4 py-2 rounded-md"
                      onClick={() => handleModalOpen("입금을 완료하셨습니까?")}
                    >
                      입금 완료
                    </button>
                  )}
  
                  {/* step=3: 돈 받는 쪽 → '입금 확인' 버튼 */}
                  {transaction_step === 3 && (
                    <button
                      className="bg-black text-white px-4 py-2 rounded-md"
                      onClick={() => handleModalOpen("입금을 확인하시겠습니까?")}
                    >
                      입금 확인
                    </button>
                  )}
  
                  {/* step=4 이상: 거래 완료 안내 */}
                  {transaction_step >= 4 && (
                    <div className="p-4 border rounded space-y-3">
                      <p>거래가 완료되었습니다. 아래 티켓 정보(가려지지 않은) 등을 확인하세요.</p>
                    </div>
                  )}
                </div>
              </div>
  
              {/* 하단: 대화방 나가기 버튼 */}
              <div className="p-4 border-t border-gray-300">
                {transaction_step < 4 && (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md w-full"
                    onClick={handleLeaveChatRoom}
                  >
                    대화방 나가기
                  </button>
                )}
              </div>
            </div>
          </div>
  
          {/* 모달 */}
          {isModalOpen && (
            <Modal
              message={modalMessage}
              onClose={handleModalClose}
              onConfirm={handleConfirm}
            />
          )}
        </div>
      </div>
    );
  };
  
  export default ExchangeRoom;