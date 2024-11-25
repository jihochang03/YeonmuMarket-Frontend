import React, { useState, useEffect } from "react";
import { fetchPurchasedTickets } from "../../../../apis/api";
import { useNavigate } from "react-router-dom";

const statusMapping = {
  waiting: "양수자 대기",
  transfer_pending: "양도중 - 입금 대기",
  transfer_complete: "양도 완료",
};

export const PurchasedTickets = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await fetchPurchasedTickets();
        setTickets(data);
      } catch (error) {
        console.error("Error loading tickets:", error);
      }
    };
    loadTickets();
  }, []);

  const handleChatRoomOpen = (ticket) => {
    navigate(`/chat/${ticket.conversation_id}`);
  };

  return (
    <div>
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
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PurchasedTickets;
