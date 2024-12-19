import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import XIcon from "../../../../assets/xlogo.png";
import UrlIcon from "../../../../assets/url.png";
import { fetchTicketPostDetail, postTweet } from "../../../../apis/api"; // Import necessary API functions

const PromoForm = ({ ticket, onCancel }) => {
  const navigate = useNavigate();
  const [editedTicket, setEditedTicket] = useState({
    ...ticket, // Spread the ticket data
    title: ticket.title || "", // Ensure fallback to empty string
    date: ticket.date || "",
    seat: ticket.seat || "",
    booking_page: ticket.booking_page || "",
    casting: ticket.casting || "",
    price: ticket.price || "",
    phone_last_digits: ticket.phone_last_digits || "",
  });
  const [previewSeatImage, setPreviewSeatImage] = useState(
    ticket.processed_seat_image
  );
  // const [ticketDetails, setTicketDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  // const [maskedSeatImageUrl, setMaskedSeatImageUrl] = useState(null); // Ensure this is initialized in the state
  const textareaRef = useRef(null);

  const pathname = window.location.pathname; // "/main/new/103"
  const ticketId = pathname.split("/").pop(); // Extract the last part of the URL

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const data = await fetchTicketPostDetail(ticketId);
        setTicketDetails(data?.ticket || null); // Set ticket details
        setMaskedSeatImageUrl(
          data?.ticket?.uploaded_processed_seat_image_url || null
        ); // Set masked image URL if available
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ticket details:", err);
        setError("Failed to load ticket details.");
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [ticketId]);

  const handleDownloadMaskedSeatImage = async () => {
    if (!maskedSeatImageUrl) {
      console.error("No masked seat image URL provided.");
      return;
    }

    try {
      const response = await fetch(maskedSeatImageUrl);
      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "masked_seat_image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the blob URL to free memory
      window.URL.revokeObjectURL(blobUrl);
      console.log("Download completed.");
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const handlePublishToX = async () => {
    if (!ticketDetails) {
      alert("티켓 정보를 불러오는 중입니다. 다시 시도해주세요.");
      return;
    }

    const tweetContent = `
      ${ticketDetails.title || "공연 이름 없음"} 양도
      ${ticketDetails.date || "날짜 정보 없음"}
      캐스팅: ${ticketDetails.casting || "캐스팅 정보 없음"}
      가격: ${ticketDetails.price || "가격 정보 없음"}
      좌석 정보: ${ticketDetails.seat || "좌석 정보 없음"}
      <연뮤마켓> 통해서 안전 거래
      https://yeonmumarket-frontend.fly.dev/chat/join/${ticketId}
    `;

    try {
      await postTweet(tweetContent.trim());
      alert("트윗이 성공적으로 게시되었습니다.");
    } catch (error) {
      console.error("트윗 게시 중 오류가 발생했습니다:", error);
      alert("트윗 게시 중 오류가 발생했습니다.");
    }
  };

  const handleCopyText = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      alert("복사할 내용이 없습니다.");
      return;
    }

    const textToCopy = textarea.value;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("텍스트가 클립보드에 복사되었습니다!");
      })
      .catch((err) => {
        console.error("텍스트 복사 실패:", err);
        alert("텍스트 복사에 실패했습니다. 다시 시도해주세요.");
      });
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "날짜 정보 없음";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch (error) {
      console.error("Invalid date format:", dateString, error);
      return "날짜 정보 없음";
    }
  };
  //div className="flex flex-col w-full p-4 overflow-y-auto max-h-list-height"
  return (
    <form className="flex flex-col w-full p-4 overflow-y-auto max-h-list-height">
      <div className="flex flex-col justify-center min-h-main-menu-height2 w-full p-8">
        <h3 className="py-2 font-bold">홍보글 생성 (수정 가능)</h3>

        {previewSeatImage && (
          <div className="mb-4">
            <img
              src={previewSeatImage}
              alt="좌석 이미지 미리보기"
              className="max-w-full h-auto"
            />
            <button
              onClick={handleDownloadMaskedSeatImage}
              className="bg-black text-white px-4 py-2 rounded-md mt-2"
            >
              이미지 저장
            </button>
          </div>
        )}

        <textarea
          ref={textareaRef}
          className="border p-2 mb-4 rounded-md w-full overflow-y-auto resize-none"
          style={{ height: "auto", minHeight: "250px" }}
          onInput={handleInput}
          defaultValue={`
  ${editedTicket.title || "공연 이름 없음"} 양도
  날짜: ${formatDate(editedTicket.date)}
  캐스팅: ${editedTicket.casting || "캐스팅 정보 없음"}
  가격: ${editedTicket.price || "가격 정보 없음"}원
  좌석 정보: ${editedTicket.seat || "좌석 정보 없음"}
  <연뮤마켓> 통해서 안전 거래
  https://yeonmumarket-frontend.fly.dev/chat/join/${ticketId}`}
        />

        <div className="flex justify-around items-center gap-2 mt-6">
          <button
            type="button"
            className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-md"
            onClick={handlePublishToX}
          >
            <img src={XIcon} alt="X 로고" className="w-5 h-5" />에 게시
          </button>
          <button
            type="button"
            className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-md"
            onClick={handleCopyText}
          >
            텍스트 복사
          </button>
        </div>
        <div className="flex justify-around items-center gap-2 mt-6">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
            onClick={onCancel}
          >
            돌아가기
          </button>
        </div>
      </div>
    </form>
  );
};

export default PromoForm;
