import React, { useState, useEffect } from "react";
import { fetchPurchasedTickets, downloadImage } from "../../../../apis/api";
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
  const fixRegionInUrl = (url) => {
    if (!url) return null;
    const regex = /s3\.ap-northeast-2\.amazonaws\.com/;
    return url.replace(regex, "s3.ap-southeast-2.amazonaws.com");
  };

  const fixedSeatImageUrl = selectedTicket
    ? fixRegionInUrl(selectedTicket.uploaded_seat_image_url)
    : null;
  const fixedFileImageUrl = selectedTicket
    ? fixRegionInUrl(selectedTicket.uploaded_file_url)
    : null;

  const handleDownloadSeatImage = async () => {
    if (!selectedTicket.uploaded_seat_image_url) return;

    try {
      await downloadImage(selectedTicket.uploaded_seat_image_url);
      console.log("Image download triggered successfully");
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  const handleDownloadFileImage = async () => {
    if (!selectedTicket.uploaded_file_url) return;

    try {
      await downloadImage(selectedTicket.uploaded_file_url);
      console.log("Image download triggered successfully");
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  return (
    <div className="border-2 border-gray-300 min-h-main-menu-height rounded-md mt-4 mx-6 flex flex-col">
      {selectedTicket ? (
        <div
          key={selectedTicket.id}
          className="max-w-lg border-2 border-gray-300 rounded-md mx-2 mt-2"
        >
          <form
            className="flex flex-col w-full p-4 overflow-y-auto max-h-main-menu-height"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex items-center justify-between mb-4">
              <h1>양수표</h1>
              <button
                type="button"
                className="text-gray-500 text-xl hover:text-black"
                onClick={() => setSelectedTicket(null)}
              >
                ×
              </button>
            </div>

            <div
              className={`status-label status-${selectedTicket.status} mt-3`}
            >
              상태: {statusMapping[selectedTicket.status]}
            </div>
            <label className="block my-2 font-bold">공연 이름</label>
            {/* 예매내역서 사진 이미지 */}
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
                    onClick={handleDownloadFileImage}
                    className="bg-gray-300 px-3 py-1 rounded-md text-sm"
                  >
                    예매내역서 다운로드
                  </button>
                </div>
              ) : (
                <span>이미지가 없습니다.</span>
              )}
            </div>
            {/* 좌석 사진 이미지 */}
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
                    onClick={handleDownloadSeatImage}
                    className="bg-gray-300 px-3 py-1 rounded-md text-sm"
                  >
                    좌석사진 다운로드
                  </button>
                </div>
              ) : (
                <span>이미지가 없습니다.</span>
              )}
            </div>
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
            <label className="block mb-2 font-bold">
              예매자 전화번호 마지막 4자리
            </label>
            <label className="border p-2 mb-4 rounded-md">
              {selectedTicket.phone_last_digits}
            </label>
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
                  {ticket.status !== "transfer_pending" && (
                    <button
                      className="ticket-button"
                      onClick={() => handleDetailClick(ticket.id)}
                    >
                      상세보기
                    </button>
                  )}
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
