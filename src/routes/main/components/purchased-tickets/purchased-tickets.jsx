import React, { useState, useEffect } from "react";
import { fetchPurchasedTickets } from "../../../../apis/api";
import { useNavigate } from "react-router-dom";

const statusMapping = {
  transfer_pending: "양수중",
  transfer_completed: "양수 완료",
};

export const PurchasedTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTickets = async () => {
      try {
        // Fetch all tickets where the user is the transferee
        const data = await fetchPurchasedTickets();
        const sortedData = data.sort((a, b) => {
          if (
            a.status === "transfer_pending" &&
            b.status !== "transfer_pending"
          ) {
            return -1;
          }
          if (
            b.status === "transfer_pending" &&
            a.status !== "transfer_pending"
          ) {
            return 1;
          }
          return b.id - a.id;
        });
        setTickets(sortedData);
      } catch (error) {
        console.error("Error loading tickets:", error);
      }
    };
    loadTickets();
  }, []);

  const handleChatRoomOpen = (ticket) => {
    navigate(`/chat/${ticket.id}`);
  };

  const handleDetailClick = (ticketId) => {
    console.log("Detail clicked for ticketId:", ticketId); // Debugging
    const ticket = tickets.find((item) => item.id === ticketId);
    if (ticket) {
      console.log("Selected ticket:", ticket); // Debugging
    } else {
      console.error("Ticket not found for id:", ticketId); // Debugging
    }
    setSelectedTicket(ticket);
  };

  return (
    <div>
      {selectedTicket ? (
        <div
          key={selectedTicket.id}
          className="max-w-lg border-2 border-gray-300 rounded-md mx-5 mt-4"
        >
          <form
            className="flex flex-col w-full p-4 overflow-y-auto max-h-main-menu-height"
            onSubmit={(e) => e.preventDefault()}
          >
            <h1>양수표</h1>
            <div
              className={`status-label status-${selectedTicket.status} mt-3`}
            >
              상태: {statusMapping[selectedTicket.status]}
            </div>
            <label className="block my-2 font-bold">공연 이름</label>
            <label className="border p-2 mb-4 rounded-md">
              {selectedTicket.title}
            </label>
            <label className="block mb-2 font-bold">공연 날짜</label>
            <label className="border p-2 mb-4 rounded-md">
              {selectedTicket.date}
            </label>
            <label className="block mb-2 font-bold">좌석 정보</label>
            <label className="border p-2 mb-4 rounded-md">
              {selectedTicket.seat}
            </label>
            <label className="block mb-2 font-bold">가격</label>
            <label className="border p-2 mb-4 rounded-md">
              {selectedTicket.price}원
            </label>
            {selectedTicket.uploaded_seat_image_url && (
              <div className="mb-4">
                <label className="block mb-2 font-bold">좌석 사진</label>
                <img
                  src={selectedTicket.uploaded_seat_image_url}
                  alt="좌석 사진"
                  className="max-h-[230px] max-w-[230px] object-cover"
                />
              </div>
            )}
            <div className="w-full flex items-center justify-center gap-10 mt-4">
              <button
                className="bg-black text-white px-8 py-2 rounded-md"
                onClick={() => setSelectedTicket(null)}
              >
                뒤로 가기
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Render the list of tickets
        <div className="flex flex-col w-full p-4 overflow-y-auto max-h-list-height">
          {tickets.length === 0 ? (
            <div>양수한 티켓이 없습니다.</div>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
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
                <div className="ticket-button-container">
                  <button
                    className="ticket-button"
                    onClick={() => handleChatRoomOpen(ticket)}
                  >
                    대화방
                  </button>
                  <button
                    className="ticket-button"
                    onClick={() => handleDetailClick(ticket.id)}
                  >
                    상세보기
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PurchasedTickets;
