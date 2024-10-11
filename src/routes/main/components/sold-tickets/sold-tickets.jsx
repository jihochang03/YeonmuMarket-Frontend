import React, { useState } from 'react';
import { soldTickets } from './sold-tickets-dummy';

const statusMapping = {
  waiting: '양수자 대기',
  transfer_intent: '양도중 - 양도 의사 확인',
  transfer_payment: '양도중 - 입금 대기',
  transfer_complete: '양도 완료',
};

export const SoldTickets = () => {

  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleDetailClick = (ticketId) => {
    const ticket = soldTickets.find((item) => item.id === ticketId);
    setSelectedTicket(ticket);
  };

  return (
    <div>
      {selectedTicket ? (
        <div className="max-w-lg p-1 border-2 border-gray-300 rounded-md mx-5 mt-4">
          <form className="flex flex-col w-full p-4 overflow-y-auto max-h-main-menu-height">
            <h1>작성한 양도글</h1>
            <div className={`status-label status-${selectedTicket.status}`}>
              상태: {statusMapping[selectedTicket.status]}
            </div>
            <label className="block mb-2 font-bold">공연 이름</label>
            <label className="border p-2 mb-4 rounded-md">{selectedTicket.ticketDetails.performanceName}</label>
            <div className="mb-4">
              <label className="block mb-2 font-bold">예매내역서</label>
              <img src={selectedTicket.ticketDetails.reservationImage} alt="예매내역서" className="max-h-[230px] max-w-[230px] object-cover upload-container" />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-bold">예매내역서</label>
              <img src={selectedTicket.ticketDetails.seatImage} alt="예매내역서" className="max-h-[230px] max-w-[230px] object-cover upload-container" />
            </div>
            <label className="block mb-2 font-bold">공연 장소</label>
            <label className="border p-2 mb-4 rounded-md">{selectedTicket.ticketDetails.location}</label>
            <label className="block mb-2 font-bold">예매처</label>
            <label className="border p-2 mb-4 rounded-md">{selectedTicket.ticketDetails.ticketingPlatform}</label>
            <label className="block mb-2 font-bold">공연 이름</label>
            <label className="border p-2 mb-4 rounded-md">{selectedTicket.ticketDetails.performanceDate} {selectedTicket.ticketDetails.performanceTime}</label>
            <label className="block mb-2 font-bold">예매번호</label>
            <label className="border p-2 mb-4 rounded-md">{selectedTicket.ticketDetails.reservationNumber}</label>
            <label className="block mb-2 font-bold">좌석 정보</label>
            <label className="border p-2 mb-4 rounded-md">{selectedTicket.ticketDetails.seatInfo}</label>
            <label className="block mb-2 font-bold">캐스팅 정보</label>
            <label className="border p-2 mb-4 rounded-md">{selectedTicket.ticketDetails.castingInfo}</label>
            <label className="block mb-2 font-bold">가격</label>
            <label className="border p-2 mb-4 rounded-md">{selectedTicket.ticketDetails.originalPrice}원</label>
            <label className="block mb-2 font-bold">할인 정보</label>
            <label className="border p-2 mb-4 rounded-md">{selectedTicket.ticketDetails.discountInfo}</label>
            <label className="block mb-2 font-bold">예매자 전화번호 마지막 4자리</label>
            <label className="border p-2 mb-4 rounded-md">{selectedTicket.ticketDetails.buyerPhoneLastDigits}</label>
            <button className="mx-24 bg-slate-300" onClick={() => setSelectedTicket(null)}>뒤로 가기</button>
          </form>
        </div>
      ) : (
      <div className="flex flex-col w-full p-4 overflow-y-auto max-h-main-menu-height">
        {soldTickets.map((ticket) => (
          <div key={ticket.id} className={`ticket-card`}>
            <div className={`status-label status-${ticket.status}`}>
              상태: {statusMapping[ticket.status] || ticket.status}
            </div>
            <div className='ticket-view gap-1'>
              <div className="ticket-title">
                {ticket.title}
              </div>
              <div>/</div>
              <div className="ticket-date">
                {ticket.date}
              </div>
              <div>/</div>
              <div className="ticket-place">
                {ticket.place}
              </div>
            </div>
            {ticket.status === 'waiting' && (
              <div className='ticket-button-container'>
                <button className="ticket-button" onClick={() => handleDetailClick(ticket.id)}>상세보기</button>
              </div>
            )}
            {ticket.status === 'transfer_intent' && (
              <div className='ticket-button-container'>
                <button className="ticket-button">양도 확정</button>
                <button className="ticket-button" onClick={() => handleDetailClick(ticket.id)}>상세보기</button>
              </div>
            )}
            {ticket.status === 'transfer_payment' && (
              <div className='ticket-button-container'>
                <button className="ticket-button">입금 확인</button>
                <button className="ticket-button" onClick={() => handleDetailClick(ticket.id)}>상세보기</button>
              </div>
            )}
            {ticket.status === 'transfer_complete' && (
              <div className='ticket-button-container'>
                <button className="ticket-button" onClick={() => handleDetailClick(ticket.id)}>상세보기</button>
              </div>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
}