import React, { useState, useEffect } from "react";
import {
  fetchTransferredTickets,
  updateTicketPost,
  deleteTicketPost,
  downloadImage,
} from "../../../../apis/api"; // 백엔드 API 함수 호출
import Modal from "../../../../components/modal";
import EditTicketForm from "./edit-tickets";
import PromoForm from "./promo-form";
import { useNavigate } from "react-router-dom";

const statusMapping = {
  waiting: "양수자 대기",
  transfer_pending: "양도중",
  transfer_completed: "양도 완료",
};

export const SoldTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPromoMode, setIsPromoMode] = useState(false);
  const navigate = useNavigate();

  // 티켓 목록을 백엔드에서 가져옴
  useEffect(() => {
    const loadTickets = async () => {
      try {
        console.log("Fetching tickets...");
        const data = await fetchTransferredTickets();

        console.log("Fetched tickets:", data);
        // ID 내림차순 정렬
        const sortedData = data.sort((a, b) => b.id - a.id);
        console.log("Sorted tickets:", sortedData);

        setTickets(sortedData);
      } catch (error) {
        console.error("Error loading tickets:", error);
      }
    };
    loadTickets();
  }, []);

  // 티켓 내용 저장(수정/홍보) 시 상위 state 업데이트
  const handleSave = (updatedTicket) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
    setSelectedTicket(updatedTicket);
    setIsEditMode(false);
    setIsPromoMode(false);
  };

  // 티켓 상세 클릭 시
  const handleDetailClick = (ticketId) => {
    const ticket = tickets.find((item) => item.id === ticketId);
    if (!ticket) {
      console.error("Ticket not found for id:", ticketId);
      return;
    }
    setSelectedTicket(ticket);
  };

  // 모달 열기/닫기
  const handleModalOpen = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // 티켓 삭제
  const handleDelete = async () => {
    try {
      if (!selectedTicket) return;
      await deleteTicketPost(selectedTicket.id);
      setTickets((prev) => prev.filter((t) => t.id !== selectedTicket.id));
      setSelectedTicket(null);
      setIsModalOpen(false);
      alert("티켓이 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting ticket:", error);
      alert("티켓 삭제 중 문제가 발생했습니다.");
    }
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
  const fixedMaskedSeatImageUrl = selectedTicket
    ? fixRegionInUrl(selectedTicket.processed_seat_image_url)
    : null;
  const fixedMaskedFileImageUrl = selectedTicket
    ? fixRegionInUrl(selectedTicket.masked_file_url)
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
  const handleDownloadMaskedSeatImage = async () => {
    if (!selectedTicket.processed_seat_image_url) return;

    try {
      await downloadImage(selectedTicket.processed_seat_image_url);
      console.log("Image download triggered successfully");
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  const handleDownloadMaskedFileImage = async () => {
    if (!selectedTicket.masked_file_url) return;

    try {
      await downloadImage(selectedTicket.masked_file_url);
      console.log("Image download triggered successfully");
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };
  // 수정하기
  const handleEdit = () => {
    setIsEditMode(true);
  };

  // 홍보글 생성하기
  const handlePromo = (ticketId) => {
    const ticket = tickets.find((item) => item.id === ticketId);
    if (!ticket) {
      console.error("Ticket not found for id:", ticketId);
      return;
    }
    setSelectedTicket(ticket);
    setIsPromoMode(true);
  };

  // 뒤로가기(상세보기창 닫기)
  const handleBack = () => {
    setSelectedTicket(null);
  };

  // PromoForm에서 취소하기
  const handleCancelPromo = () => {
    setIsPromoMode(false);
    setSelectedTicket(null);
  };

  // EditTicketForm에서 취소하기
  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  // 대화방 열기
  const handleChatRoomOpen = (ticketId) => {
    navigate(`/chat/${ticketId}`);
  };

  return (
    <div className="w-full sm:w-main-frame border-2 border-gray-300 rounded-md mx-5 mt-4 overflow-y-auto max-h-main-menu-height">
      {selectedTicket ? (
        <div
          key={selectedTicket.id}
          className="max-w-lg border-2 border-gray-300 rounded-md mx-5 mt-4"
        >
          {/* 수정 모드 */}
          {isEditMode ? (
            <EditTicketForm
              ticket={selectedTicket}
              onSave={handleSave}
              onCancel={handleCancelEdit}
            />
          ) : /* 홍보글 모드 */
          isPromoMode ? (
            <PromoForm
              ticket={selectedTicket}
              onSave={handleSave}
              onCancel={handleCancelPromo}
            />
          ) : (
            // 상세 보기
            <form
              className="flex flex-col p-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex items-center justify-between mb-4">
                <h1>작성한 양도글</h1>
                <button
                  type="button"
                  className="text-gray-500 text-xl hover:text-black"
                  onClick={handleBack}
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
              <label className="border p-2 mb-4 rounded-md">
                {selectedTicket.title}
              </label>
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
              {/* 예매내역서 사진 이미지 */}
              <div className="mb-4">
                <label className="block font-semibold mb-2">예매내역서</label>
                {fixedMaskedFileImageUrl ? (
                  <div>
                    <img
                      src={fixedMaskedFileImageUrl}
                      alt="가려진 예매내역서"
                      className="max-h-[230px] max-w-[230px] object-cover border mb-2"
                    />
                    <button
                      type="button"
                      onClick={handleDownloadMaskedFileImage}
                      className="bg-gray-300 px-3 py-1 rounded-md text-sm"
                    >
                      가려진 예매내역서 다운로드
                    </button>
                  </div>
                ) : (
                  <span>이미지가 없습니다.</span>
                )}
              </div>
              {/* 좌석 사진 이미지 */}
              <div className="mb-4">
                <label className="block font-semibold mb-2">좌석 사진</label>
                {fixedMaskedSeatImageUrl ? (
                  <div>
                    <img
                      src={fixedMaskedSeatImageUrl}
                      alt="가려진 좌석 사진"
                      className="max-h-[230px] max-w-[230px] object-cover border mb-2"
                    />
                    <button
                      type="button"
                      onClick={handleDownloadMaskedSeatImage}
                      className="bg-gray-300 px-3 py-1 rounded-md text-sm"
                    >
                      가려진 좌석사진 다운로드
                    </button>
                  </div>
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
                {selectedTicket.booking_page}
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

              {/* 상태에 따라 버튼 보이기 */}
              <div className="w-full sm:w-main-frame flex items-center justify-center gap-10 mt-4">
                {(selectedTicket.status === "waiting" ||
                  selectedTicket.status === "transfer_pending") && (
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
        // 티켓 리스트
        <div className="flex flex-col w-full sm:w-main-frame p-4 overflow-y-auto max-h-list-height">
          {tickets.length === 0 ? (
            <div>양도한 티켓이 없습니다.</div>
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
                {/* 상태별 버튼 */}
                {ticket.status === "waiting" && (
                  <div className="ticket-button-container">
                    <button
                      className="ticket-button"
                      onClick={() => handleDetailClick(ticket.id)}
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
                )}
                {ticket.status === "transfer_pending" && (
                  <div className="ticket-button-container">
                    <button
                      className="ticket-button"
                      onClick={() => handleDetailClick(ticket.id)}
                    >
                      상세보기
                    </button>
                    <button
                      className="ticket-button"
                      onClick={() => handleChatRoomOpen(ticket.id)}
                    >
                      대화방
                    </button>
                  </div>
                )}
                {ticket.status === "transfer_completed" && (
                  <div className="ticket-button-container">
                    <button
                      className="ticket-button"
                      onClick={() => handleDetailClick(ticket.id)}
                    >
                      상세보기
                    </button>
                    <button
                      className="ticket-button"
                      onClick={() => handleChatRoomOpen(ticket.id)}
                    >
                      대화방
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 모달(판매 취소 확인) */}
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

export default SoldTickets;
