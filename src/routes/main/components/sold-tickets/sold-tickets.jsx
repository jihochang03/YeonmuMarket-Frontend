import React, { useState, useEffect } from "react";
import {
  fetchTransferredTickets,
  updateTicketPost,
} from "../../../../apis/api"; // 백엔드 API 함수 호출
import Modal from "../../../../components/modal";
import EditTicketForm from "./edit-ticket";
import { useNavigate } from "react-router-dom";

const statusMapping = {
  waiting: "양수자 대기",
  transfer_pending: "양도중 - 입금 대기",
  transfer_complete: "양도 완료",
};

export const SoldTickets = () => {
  const [tickets, setTickets] = useState([]); // 백엔드에서 가져온 티켓 데이터 저장
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  // 백엔드에서 티켓 목록을 가져오는 함수
  useEffect(() => {
    const loadTickets = async () => {
      try {
        console.log("Fetching tickets..."); // Debugging
        const data = await fetchTransferredTickets();

        console.log("Fetched tickets:", data); // Debugging

        // Sort tickets by id in descending order
        const sortedData = data.sort((a, b) => b.id - a.id);
        console.log("Sorted tickets:", sortedData); // Debugging

        setTickets(sortedData); // Set sorted tickets in state
      } catch (error) {
        console.error("Error loading tickets:", error);
      }
    };
    loadTickets();
  }, []);

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

  const handleSave = (updatedTicket) => {
    console.log("Saving updated ticket:", updatedTicket); // Debugging
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === updatedTicket.id ? updatedTicket : ticket
    );
    console.log("Updated tickets list:", updatedTickets); // Debugging
    setTickets(updatedTickets);
    setSelectedTicket(null);
    setTimeout(() => {
      setSelectedTicket(updatedTicket);
      console.log("Selected ticket after save:", updatedTicket); // Debugging
    }, 0);
    setIsEditMode(false);
  };

  const handleModalOpen = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === selectedTicket.id
        ? { ...ticket, status: "transfer_complete" }
        : ticket
    );
    setTickets(updatedTickets);
    setIsModalOpen(false);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };
  const handleChatRoomOpen = (ticketId) => {
    navigate(`/chat/${ticketId}`);
  };

  // const handleChatRoomOpen = (ticketId) => {
  //   const ticket = tickets.find((item) => item.id === ticketId);

  //   if (ticket) {
  //     navigate('/chat/', {
  //       state: { from: '/main/sold', ticketData: ticket },
  //     }, console.log(ticket));
  //   } else {
  //     console.error("Ticket not found");
  //   }
  // };

  return (
    <div>
      {selectedTicket ? (
        <div
          key={selectedTicket.id}
          className="max-w-lg border-2 border-gray-300 rounded-md mx-5 mt-4"
        >
          {isEditMode ? (
            <EditTicketForm
              ticket={selectedTicket}
              onSave={handleSave}
              onCancel={handleCancelEdit}
            />
          ) : (
            <form
              className="flex flex-col w-full p-4 overflow-y-auto max-h-main-menu-height"
              onSubmit={(e) => e.preventDefault()}
            >
              <h1>작성한 양도글</h1>
              <div
                className={`status-label status-${selectedTicket.status} mt-3`}
              >
                상태: {statusMapping[selectedTicket.status]}
              </div>
              <label className="block my-2 font-bold">공연 이름</label>
              <label className="border p-2 mb-4 rounded-md">
                {selectedTicket.title}
              </label>
              <div className="mb-4">
                <label className="block mb-2 font-bold">예매내역서</label>
                {selectedTicket.uploaded_file_url ? (
                  <img
                    src={selectedTicket.uploaded_file_url}
                    alt="예매내역서"
                    className="max-h-[230px] max-w-[230px] object-cover upload-container"
                  />
                ) : (
                  <span>이미지가 없습니다.</span>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-bold">좌석 사진</label>
                {selectedTicket.uploaded_seat_image_url ? (
                  <img
                    src={selectedTicket.uploaded_seat_image_url}
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
              <div className="w-full flex items-center justify-center gap-10 mt-4">
                {selectedTicket.status === "waiting" && (
                  <>
                    <button
                      className="bg-black text-white px-8 py-2 rounded-md"
                      onClick={() =>
                        handleModalOpen("판매를 취소하시겠습니까?")
                      }
                    >
                      판매 취소
                    </button>
                    <button
                      className="bg-black text-white px-8 py-2 rounded-md"
                      onClick={handleEdit}
                    >
                      수정하기
                    </button>
                  </>
                )}
                {selectedTicket.status === "transfer_pending" && (
                  <>
                    <button
                      className="bg-black text-white px-8 py-2 rounded-md"
                      onClick={() =>
                        handleModalOpen("판매를 취소하시겠습니까?")
                      }
                    >
                      판매 취소
                    </button>
                    <button
                      className="bg-black text-white px-8 py-2 rounded-md"
                      onClick={handleEdit}
                    >
                      수정하기
                    </button>
                  </>
                )}
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="flex flex-col w-full p-4 overflow-y-auto max-h-list-height">
          {tickets.length === 0 ? (
            <div>양도한 티켓이 없습니다.</div>
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
                {ticket.status === "waiting" && (
                  <div className="ticket-button-container">
                    <button
                      className="ticket-button"
                      onClick={() => handleDetailClick(ticket.id)}
                    >
                      상세보기
                    </button>
                  </div>
                )}
                {ticket.status === "transfer_pending" && (
                  <div className="ticket-button-container">
                    <button
                      className="ticket-button"
                      onClick={() => handleChatRoomOpen(ticket.id)}
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
                )}
                {ticket.status === "transfer_complete" && (
                  <div className="ticket-button-container">
                    <button
                      className="ticket-button"
                      onClick={() => handleDetailClick(ticket.id)}
                    >
                      상세보기
                    </button>
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

export default SoldTickets;
