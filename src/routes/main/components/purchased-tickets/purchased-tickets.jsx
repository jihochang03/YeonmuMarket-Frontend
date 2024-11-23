import React, { useState, useEffect } from "react";
import { fetchPurchasedTickets } from "../../../../apis/api"; // 백엔드 API 함수 호출

const statusMapping = {
  waiting: "양수자 대기",
  transfer_pending: "양도중 - 입금 대기",
  transfer_complete: "양도 완료",
};

export const PurchasedTickets = () => {
  const [tickets, setTickets] = useState([]); // 백엔드에서 가져온 티켓 데이터 저장
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // 백엔드에서 티켓 목록을 가져오는 함수
  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await fetchPurchasedTickets();
        setTickets(data); // 백엔드에서 받은 티켓 데이터를 상태로 설정
      } catch (error) {
        console.error("Error loading tickets:", error);
      }
    };

    loadTickets();
  }, []);

  const handleDetailClick = (ticketId) => {
    const ticket = tickets.find((item) => item.id === ticketId);
    setSelectedTicket(ticket);
  };

  const handleModalOpen = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
  }

  const handleConfirm = () => {
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === selectedTicket.id
      ? { ...ticket, status: 'transfer_complete' }
      : ticket
    );
    setTickets(updatedTickets);
    setIsModalOpen(false);
  };

  return (
    <div>
      {selectedTicket ? (
        <div className="max-w-lg p-4 border-2 border-gray-300 rounded-md mx-5 mt-4">
          <form className="flex flex-col w-full p-4 overflow-y-auto max-h-list-height">
            <h1>작성한 양도글</h1>
            <div className={`status-label status-${selectedTicket.status}`}>
              상태: {statusMapping[selectedTicket.status]}
            </div>
            <label className="block mb-2 font-bold">공연 이름</label>
            <label className="border p-2 mb-4 rounded-md">
              {selectedTicket.title}
            </label>
            <div className="mb-4">
              <label className="block mb-2 font-bold">예매내역서</label>
              {selectedTicket.uploaded_file ? (
                <img
                  src={selectedTicket.uploaded_file}
                  alt="예매내역서"
                  className="max-h-[230px] max-w-[230px] object-cover upload-container"
                />
              ) : (
                <span>이미지가 없습니다.</span>
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-bold">좌석 사진</label>
              {selectedTicket.uploaded_seat_image ? (
                <img
                  src={selectedTicket.uploaded_seat_image}
                  alt="좌석 사진"
                  className="max-h-[230px] max-w-[230px] object-cover upload-container"
                />
              ) : (
                <span>이미지가 없습니다.</span>
              )}
            </div>
            <label className="block mb-2 font-bold">공연 날짜</label>
            <label className="border p-2 mb-4 rounded-md">
              {selectedTicket.date}
            </label>
            <label className="block mb-2 font-bold">좌석 정보</label>
            <label className="border p-2 mb-4 rounded-md">
              {selectedTicket.seat}
            </label>
            <label className="block mb-2 font-bold">예매처</label>
            <label className="border p-2 mb-4 rounded-md">
              {selectedTicket.keyword}
            </label>
            <label className="block mb-2 font-bold">캐스팅 정보</label>
            <label className="border p-2 mb-4 rounded-md">
              {selectedTicket.casting}
            </label>
            <label className="block mb-2 font-bold">가격</label>
            <label className="border p-2 mb-4 rounded-md">
              {selectedTicket.price}원
            </label>
            <label className="block mb-2 font-bold">
              예매자 전화번호 마지막 4자리
            </label>
            <label className="border p-2 mb-4 rounded-md">
              {selectedTicket.phone_last_digits}
            </label>
            <button
              className="mx-24 bg-slate-300 px-4 py-2 rounded-md"
              onClick={() => setSelectedTicket(null)}
            >
              뒤로 가기
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col w-full p-4 overflow-y-auto max-h-main-menu-height">
          {tickets.length === 0 ? (
            <div>양수한 티켓이 없습니다.</div>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className={`ticket-card`}>
                <div className={`status-label status-${ticket.status}`}>
                  상태: {statusMapping[ticket.status] || ticket.status}
                </div>
                <div className="ticket-view gap-1">
                  <div className="ticket-title">{ticket.title}</div>
                  <div>/</div>
                  <div className="ticket-date">{ticket.date}</div>
                  <div>/</div>
                  <div className="ticket-place">{ticket.seat}</div>
                </div>
                {ticket.status === 'waiting' && (
                  <div className='ticket-button-container'>
                    <button className="ticket-button" onClick={() => handleDetailClick(ticket.id)}>상세보기</button>
                  </div>
                )}
                {ticket.status === 'transfer_pending' && (
                  <div className='ticket-button-container'>
                    <div className="ticket-button" onClick={() => handleModalOpen('입금을 완료하셨나요?')}>입금 완료</div>
                    <button className="ticket-button" onClick={() => handleDetailClick(ticket.id)}>상세보기</button>
                  </div>
                )}
                {ticket.status === 'transfer_complete' && (
                  <div className='ticket-button-container'>
                    <button className="ticket-button" onClick={() => handleDetailClick(ticket.id)}>상세보기</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
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
