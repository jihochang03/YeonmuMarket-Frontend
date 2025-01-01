import React, { useState, useEffect } from "react";
import {
  fetchExchangeTickets, // 백엔드에서 { exchanges, available_tickets } 형태로 반환한다고 가정
  deleteTicketPost,
  downloadImage,
} from "../../../../apis/api";
import Modal from "../../../../components/modal";
import EditTicketForm from "./edit-tickets";
import PromoForm from "./promo-form";
import { useNavigate } from "react-router-dom";

// 교환 단계를 한글로 표시하기 위한 매핑 (예: transaction_step)
const statusMapping = {
  1: "교환 중",
  2: "교환 중",
  3: "교환 중",
  4: "교환 중",
  5: "교환 완료",
};

export const ExchangeTickets = () => {
  const [exchanges, setExchanges] = useState([]); // 교환 내역
  const [availableTickets, setAvailableTickets] = useState([]); // transferee가 없는 티켓 목록
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPromoMode, setIsPromoMode] = useState(false);

  // 사용하신다면 세팅, 안 쓰신다면 제거
  // const [currentUserId, setCurrentUserId] = useState(null);

  const [activeTicket, setActiveTicket] = useState({}); // 어떤 교환에서 ticket_1/ticket_2를 볼지 저장
  const [isDetailVisible, setIsDetailVisible] = useState(false); // Track ticket detail visibility

  const navigate = useNavigate();

  // 교환 목록( + 교환 가능 티켓) 가져오기
  useEffect(() => {
    const loadExchanges = async () => {
      try {
        console.log("Fetching exchange data...");
        const data = await fetchExchangeTickets();
        console.log("Fetched exchanges:", data);

        // 필요시 정렬
        const sortedExchanges =
          data.exchanges?.sort((a, b) => b.id - a.id) || [];
        const sortedTickets =
          data.available_tickets?.sort((a, b) => b.id - a.id) || [];

        setExchanges(sortedExchanges);
        setAvailableTickets(sortedTickets);
      } catch (error) {
        console.error("Error loading exchanges:", error);
      }
    };

    loadExchanges();
  }, []);

  // 모달(삭제 확인 등) 열기 / 닫기
  const handleModalOpen = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // 교환 삭제 (실제로는 Exchange 삭제 API가 필요할 수 있음)
  const handleDelete = async () => {
    try {
      if (!selectedExchange) return;
      // 예시로 ticket을 삭제하는 API를 호출했지만, 실제론 exchange 삭제 로직 필요
      await deleteTicketPost(selectedExchange.id);
      setExchanges((prev) =>
        prev.filter((ex) => ex.id !== selectedExchange.id)
      );
      setSelectedExchange(null);
      setIsModalOpen(false);
      alert("교환이 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting exchange:", error);
      alert("교환 삭제 중 문제가 발생했습니다.");
    }
  };

  // 상세보기 버튼 클릭 시
  const handleDetailClick = (exchangeId) => {
    const found = exchanges.find((ex) => ex.id === exchangeId);
    if (!found) {
      console.error("Exchange not found for id:", exchangeId);
      return;
    }
    setSelectedExchange(found);
  };

  // 교환 가능 티켓 상세보기 버튼
  const handleDetailTicketClick = (ticketId) => {
    const ticket = availableTickets.find((item) => item.id === ticketId);
    if (!ticket) {
      console.error("Ticket not found for id:", ticketId);
      return;
    }
    setSelectedTicket(ticket);
  };

  // 티켓 내용 저장(수정/홍보) 시 상위 state 업데이트 (현재는 예시로만 존재)
  const handleSave = (updatedTicket) => {
    // 예: setSelectedTicket(updatedTicket);
    setIsEditMode(false);
    setIsPromoMode(false);
  };

  // 뒤로가기(상세보기창 닫기)
  const handleBack = () => {
    setSelectedExchange(null);
    setIsEditMode(false);
    setIsPromoMode(false);
  };

  // 수정하기 (예: 내 티켓만 수정 가능하다고 가정)
  const handleEdit = () => {
    setIsEditMode(true);
  };

  // 이미지 경로(region) 교정
  const fixRegionInUrl = (url) => {
    if (!url) return null;
    const regex = /s3\.ap-northeast-2\.amazonaws\.com/;
    return url.replace(regex, "s3.ap-southeast-2.amazonaws.com");
  };

  // 다운로드 함수
  const handleDownloadImage = async (url) => {
    if (!url) return;
    try {
      await downloadImage(url);
      console.log(`Image download triggered: ${url}`);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  // 홍보글 생성
  const handlePromo = (ticketId) => {
    const ticket = availableTickets.find((item) => item.id === ticketId);
    if (!ticket) {
      console.error("Ticket not found for id:", ticketId);
      return;
    }
    setSelectedTicket(ticket);
    setIsPromoMode(true);
  };

  // PromoForm에서 취소하기
  const handleCancelPromo = () => {
    setIsPromoMode(false);
    setSelectedExchange(null);
  };

  // EditTicketForm에서 취소하기
  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  // 대화방 열기
  const handleChatRoomOpen = (exchangeId) => {
    navigate(`/exchange/${exchangeId}`);
  };

  // 교환 상태별 버튼 렌더링
  const renderButtons = (exchange) => {
    const { owner, transferee, transaction_step } = exchange;

    // user_info 체크 (없을 경우 대비)
    const loggedInUserId = exchange.user_info?.id;
    if (!loggedInUserId) return null;

    const isOwner = owner === loggedInUserId;
    const isTransferee = transferee === loggedInUserId;

    // owner인 경우
    if (isOwner) {
      return (
        <>
          <button
            className="ticket-button"
            onClick={() => handleDetailClick(exchange.id)}
          >
            상세보기
          </button>
          <button
            className="ticket-button"
            onClick={() => handleChatRoomOpen(exchange.ticket_1.id)}
          >
            대화방
          </button>
        </>
      );
    }

    // transferee인 경우
    if (isTransferee) {
      return (
        <>
          <button
            className="ticket-button"
            onClick={() => handleDetailClick(exchange.id)}
          >
            상세보기
          </button>
          <button
            className="ticket-button"
            onClick={() => handleChatRoomOpen(exchange.id)}
          >
            대화방
          </button>
        </>
      );
    }

    // 그 외(로그인 유저와 무관)
    return null;
  };

  // 상세보기 ON/OFF
  const toggleDetailVisibility = () => {
    setIsDetailVisible((prev) => !prev);
  };

  // 티켓 전환 버튼 핸들러 (교환 상세보기에서 "내 티켓" ↔ "상대 티켓" 전환)
  const toggleTicket = (exchangeId) => {
    setActiveTicket((prev) => ({
      ...prev,
      [exchangeId]: prev[exchangeId] === "ticket_1" ? "ticket_2" : "ticket_1",
    }));
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 1) "티켓 단독 상세보기" (교환 가능 티켓)
  // ─────────────────────────────────────────────────────────────────────────────
  const renderTicketDetail = (ticket) => {
    if (!ticket) return null;

    const fixedFileImageUrl = fixRegionInUrl(ticket.uploaded_file_url);
    const fixedSeatImageUrl = fixRegionInUrl(ticket.uploaded_seat_image_url);
    const fixedMaskedFileImageUrl = fixRegionInUrl(ticket.masked_file_url);
    const fixedMaskedSeatImageUrl = fixRegionInUrl(
      ticket.processed_seat_image_url
    );

    return (
      <div className="flex flex-col w-full p-4 overflow-y-auto max-h-main-menu-height">
        {/* 타이틀 & 닫기 버튼 */}
        <div className="flex items-center justify-between mb-4">
          <h1>티켓 상세 정보</h1>
          <button
            type="button"
            className="text-gray-500 text-xl hover:text-black"
            onClick={() => setSelectedTicket(null)}
          >
            ×
          </button>
        </div>

        {/* 공연 이름 */}
        <label className="block my-2 font-bold">공연 이름</label>
        <label className="border p-2 mb-4 rounded-md">{ticket.title}</label>

        {/* 예매내역서 (원본) */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">예매내역서</label>
          {fixedFileImageUrl ? (
            <div>
              <img
                src={fixedFileImageUrl}
                alt="예매내역서"
                className="max-h-[230px] max-w-[230px] object-cover border mb-2"
              />
              <button
                type="button"
                onClick={() => handleDownloadImage(ticket.uploaded_file_url)}
                className="bg-gray-300 px-3 py-1 rounded-md text-sm"
              >
                예매내역서 다운로드
              </button>
            </div>
          ) : (
            <span>이미지가 없습니다.</span>
          )}
        </div>

        {/* 좌석 사진 (원본) */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">좌석 사진</label>
          {fixedSeatImageUrl ? (
            <div>
              <img
                src={fixedSeatImageUrl}
                alt="좌석 사진"
                className="max-h-[230px] max-w-[230px] object-cover border mb-2"
              />
              <button
                type="button"
                onClick={() =>
                  handleDownloadImage(ticket.uploaded_seat_image_url)
                }
                className="bg-gray-300 px-3 py-1 rounded-md text-sm"
              >
                좌석사진 다운로드
              </button>
            </div>
          ) : (
            <span>이미지가 없습니다.</span>
          )}
        </div>

        {/* 예매내역서 (가려진) */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">가려진 예매내역서</label>
          {fixedMaskedFileImageUrl ? (
            <div>
              <img
                src={fixedMaskedFileImageUrl}
                alt="가려진 예매내역서"
                className="max-h-[230px] max-w-[230px] object-cover border mb-2"
              />
              <button
                type="button"
                onClick={() => handleDownloadImage(ticket.masked_file_url)}
                className="bg-gray-300 px-3 py-1 rounded-md text-sm"
              >
                가려진 예매내역서 다운로드
              </button>
            </div>
          ) : (
            <span>이미지가 없습니다.</span>
          )}
        </div>

        {/* 좌석 사진 (가려진) */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">가려진 좌석 사진</label>
          {fixedMaskedSeatImageUrl ? (
            <div>
              <img
                src={fixedMaskedSeatImageUrl}
                alt="가려진 좌석 사진"
                className="max-h-[230px] max-w-[230px] object-cover border mb-2"
              />
              <button
                type="button"
                onClick={() =>
                  handleDownloadImage(ticket.processed_seat_image_url)
                }
                className="bg-gray-300 px-3 py-1 rounded-md text-sm"
              >
                가려진 좌석사진 다운로드
              </button>
            </div>
          ) : (
            <span>이미지가 없습니다.</span>
          )}
        </div>

        {/* 공연 날짜 */}
        <label className="block mb-2 font-bold">공연 날짜</label>
        <label className="border p-2 mb-4 rounded-md">{ticket.date}</label>

        {/* 좌석 정보 */}
        <label className="block mb-2 font-bold">좌석 정보</label>
        <label className="border p-2 mb-4 rounded-md">{ticket.seat}</label>

        {/* 예매처 */}
        <label className="block mb-2 font-bold">예매처</label>
        <label className="border p-2 mb-4 rounded-md">
          {ticket.booking_page}
        </label>

        {/* 캐스팅 정보 */}
        <label className="block mb-2 font-bold">캐스팅 정보</label>
        <label className="border p-2 mb-4 rounded-md">{ticket.casting}</label>

        {/* 가격 */}
        <label className="block mb-2 font-bold">가격</label>
        <label className="border p-2 mb-4 rounded-md">{ticket.price}원</label>

        {/* 전화번호 마지막 4자리 */}
        <label className="block mb-2 font-bold">
          예매자 전화번호 마지막 4자리
        </label>
        <label className="border p-2 mb-4 rounded-md">
          {ticket.phone_last_digits}
        </label>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 2) "교환 상세보기" (교환 내역에서 열 때)
  // ─────────────────────────────────────────────────────────────────────────────
  const renderDetailForm = () => {
    if (!selectedExchange) return null;

    const {
      id,
      owner,
      transferee,
      ticket_1,
      ticket_2,
      transaction_step,
      user_info,
    } = selectedExchange;

    if (!user_info || !ticket_1 || !ticket_2) {
      console.error("Incomplete selectedExchange data:", selectedExchange);
      return (
        <div className="p-4">
          <p>교환 데이터를 불러오는데 문제가 발생했습니다.</p>
        </div>
      );
    }

    const loggedInUserId = user_info.id;
    const isOwner = owner === loggedInUserId;
    const isTransferee = transferee === loggedInUserId;

    // 내 티켓 vs 상대방 티켓
    const myTicket = isOwner ? ticket_1 : ticket_2;
    const otherTicket = isOwner ? ticket_2 : ticket_1;

    // 현재 어떤 티켓을 보고 있는지 판단
    const detailActiveKey =
      activeTicket[id] === "ticket_2" ? "ticket_2" : "ticket_1";
    const detailTicket =
      detailActiveKey === "ticket_2" ? otherTicket : myTicket;

    return (
      <div className="max-w-lg border-2 border-gray-300 rounded-md mx-2 mt-2">
        {/* 티켓 수정 or 홍보글 모드 */}
        {isEditMode ? (
          <EditTicketForm
            ticket={myTicket} // 내 티켓만 수정한다고 가정
            onSave={(updatedTicket) => {
              console.log("Updated my ticket:", updatedTicket);
              // TODO: 실제로는 API 호출 후, selectedExchange 다시 갱신
              setIsEditMode(false);
            }}
            onCancel={handleCancelEdit}
          />
        ) : isPromoMode ? (
          <PromoForm
            ticket={myTicket} // 내 티켓에 대한 홍보글
            onSave={(updatedTicket) => {
              console.log("Promo updated ticket:", updatedTicket);
              setIsPromoMode(false);
            }}
            onCancel={handleCancelPromo}
          />
        ) : (
          // 상세 보기
          <div className="flex flex-col w-full p-4 overflow-y-auto max-h-main-menu-height">
            <div className="flex items-center justify-between mb-4">
              <h1>교환 상세 정보</h1>
              <button
                type="button"
                className="text-gray-500 text-xl hover:text-black"
                onClick={handleBack}
              >
                ×
              </button>
            </div>

            <div className={`status-label status-${transaction_step} mt-3`}>
              상태: {statusMapping[transaction_step] || transaction_step}
            </div>

            {/**
             * - transaction_step이 4 이하라면: 내 티켓만 확인
             * - transaction_step이 5 이상이라면: 양쪽 티켓 토글 가능
             */}
            {transaction_step <= 4 ? (
              <>
                <div className="ticket-detail">
                  {renderTicketDetail(myTicket)}
                </div>
              </>
            ) : (
              <>
                <div className="ticket-button-container my-2">
                  <button onClick={() => toggleTicket(id)}>
                    {detailActiveKey === "ticket_2"
                      ? "내 티켓 보기"
                      : "상대방 티켓 보기"}
                  </button>
                </div>

                <div className="ticket-detail">
                  {renderTicketDetail(detailTicket)}
                </div>
              </>
            )}

            {/* (예시) 교환 취소, 수정하기 버튼 */}
            <div className="w-full flex items-center justify-center gap-10 mt-4">
              {isOwner && transaction_step <= 3 && transaction_step >= 0 && (
                <>
                  <button
                    className="bg-black text-white px-8 py-2 rounded-md"
                    onClick={() => handleModalOpen("교환을 취소하시겠습니까?")}
                  >
                    교환 취소
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 메인 렌더
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-main-menu-height rounded-md mt-2 mx-2 flex flex-col">
      {/* 홍보글 모드 */}
      {isPromoMode && selectedTicket && (
        <PromoForm
          ticket={selectedTicket}
          onSave={() => {
            console.log("Promo created for:", selectedTicket);
            setIsPromoMode(false);
            setSelectedTicket(null);
          }}
          onCancel={handleCancelPromo}
        />
      )}

      {/* 교환 상세보기 */}
      {selectedExchange && !isPromoMode && renderDetailForm()}

      {/* 교환 가능 티켓 상세보기 (단독) */}
      {selectedTicket &&
        !isPromoMode &&
        !selectedExchange &&
        renderTicketDetail(selectedTicket)}

      {/* 기본 화면 (홍보글 모드, 교환 상세, 티켓 단독 상세가 아닐 때) */}
      {!isPromoMode && !selectedExchange && !selectedTicket && (
        <>
          {/* 교환 내역 */}
          <div className="flex flex-col w-full p-4 overflow-y-auto max-h-list-height">
            <h2 className="font-bold text-lg mb-2">교환 내역</h2>
            {exchanges.length === 0 ? (
              <div className="w-full h-main-frame justify-center items-center flex flex-col font-bold text-lg">
                아직 교환 내역이 없습니다.
              </div>
            ) : (
              exchanges.map((exchange) => {
                const { id, transaction_step, ticket_1, ticket_2 } = exchange;
                // ticket_1 ↔ ticket_2 전환 상태
                const currentTicket =
                  activeTicket[id] === "ticket_2" ? ticket_2 : ticket_1;

                return (
                  <div key={id} className="ticket-card">
                    <div className={`status-label status-${transaction_step}`}>
                      상태:{" "}
                      {statusMapping[transaction_step] || transaction_step}
                    </div>
                    <div className="ticket-view gap-1">
                      <div className="ticket-title">
                        {currentTicket?.title || "티켓 제목"}
                      </div>
                      <div>/</div>
                      <div className="ticket-date">
                        {currentTicket?.date || "날짜"}
                      </div>
                      <div>/</div>
                      <div className="ticket-place">
                        {currentTicket?.seat || "좌석"}
                      </div>
                    </div>
                    <div className="ticket-button-container">
                      {renderButtons(exchange)}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 교환 가능 티켓 목록 */}
          <div className="flex flex-col w-full p-4 overflow-y-auto max-h-list-height">
            <h2 className="font-bold text-lg mb-2">교환 가능 티켓</h2>
            {availableTickets.length === 0 ? (
              <div className="w-full h-main-frame justify-center items-center flex flex-col font-bold text-lg">
                교환 가능한 티켓이 없습니다.
              </div>
            ) : (
              availableTickets.map((ticket) => (
                <div key={ticket.id} className="ticket-card">
                  <div className="ticket-view gap-1">
                    <div className="ticket-title">
                      {ticket.title || "티켓 제목"}
                    </div>
                    <div>/</div>
                    <div className="ticket-date">{ticket.date || "날짜"}</div>
                    <div>/</div>
                    <div className="ticket-place">{ticket.seat || "좌석"}</div>
                  </div>
                  <div className="ticket-button-container">
                    <button
                      className="ticket-button"
                      onClick={() => handleDetailTicketClick(ticket.id)}
                    >
                      상세보기
                    </button>
                    <button
                      className="ticket-button"
                      onClick={() => handlePromo(ticket.id)}
                    >
                      홍보글 생성
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* 모달(교환 취소 확인 등) */}
      {isModalOpen && (
        <Modal
          message={modalMessage}
          onClose={handleModalClose}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default ExchangeTickets;
