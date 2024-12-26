import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchTicketPostDetail,
  postTweet,
  downloadImage,
} from "../../../../apis/api";

const PromoForm = () => {
  const navigate = useNavigate();
  const [ticketDetails, setTicketDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maskedSeatImageUrl, setMaskedSeatImageUrl] = useState(null);
  const textareaRef = useRef(null);

  // Extracting the ticket ID from the pathname
  const pathname = window.location.pathname;
  const ticketId = parseInt(pathname.split("/").pop(), 10);

  console.log("Parsed ticket ID:", ticketId); // Debugging ticket ID

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        console.log("Fetching ticket details for ID:", ticketId); // Debugging start
        const data = await fetchTicketPostDetail(ticketId);
        console.log("Fetched ticket details:", data); // Debugging response

        if (!data || !data.ticket) {
          console.error("Invalid ticket data received:", data);
          setError("Invalid ticket data received.");
          setLoading(false);
          return;
        }

        setTicketDetails(data.ticket || null);
        setMaskedSeatImageUrl(
          data.ticket.uploaded_processed_seat_image_url || null
        );
        console.log("Processed ticketDetails:", data.ticket); // Debugging ticket details
        console.log(
          "Processed maskedSeatImageUrl:",
          data.ticket.uploaded_processed_seat_image_url
        ); // Debugging image URL
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ticket details:", err);
        setError("Failed to load ticket details.");
        setLoading(false);
      }
    };

    if (isNaN(ticketId)) {
      console.error("Invalid ticket ID:", ticketId);
      setError("Invalid ticket ID.");
      setLoading(false);
    } else {
      fetchTicketDetails();
    }
  }, [ticketId]);

  const fixRegionInUrl = (url) => {
    if (!url) return null;
    console.log("Original URL before fix:", url); // Debugging original URL
    const regex = /s3\.ap-northeast-2\.amazonaws\.com/;
    const fixedUrl = url.replace(regex, "s3.ap-southeast-2.amazonaws.com");
    console.log("Fixed URL:", fixedUrl); // Debugging fixed URL
    return fixedUrl;
  };

  const fixedSeatImageUrl = fixRegionInUrl(maskedSeatImageUrl);

  const handleDownloadSeatImage = async () => {
    if (!maskedSeatImageUrl) {
      console.error("No masked seat image URL provided.");
      return;
    }
    try {
      await downloadImage(maskedSeatImageUrl);
      console.log("Image download triggered successfully");
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  const handlePublishToX = async () => {
    if (!ticketDetails) {
      alert("티켓 정보를 불러오는 중입니다. 다시 시도해주세요.");
      console.error("No ticketDetails available during publish."); // Debugging missing ticket details
      return;
    }

    const tweetContent = `
      ${ticketDetails.title || "공연 이름 없음"} 양도
      ${formatDate(ticketDetails.date)}
      캐스팅: ${ticketDetails.casting || "캐스팅 정보 없음"}
      가격: ${ticketDetails.price || "가격 정보 없음"}원
      좌석 정보: ${ticketDetails.seat || "좌석 정보 없음"}
      <연뮤마켓> 통해서 안전 거래
      https://www.yeonmu.shop/chat/join/${ticketId}
    `;

    console.log("Generated tweet content:", tweetContent.trim()); // Debugging tweet content

    try {
      await postTweet(tweetContent.trim());
      alert("트윗이 성공적으로 게시되었습니다.");
      console.log("Tweet posted successfully."); // Debugging success
    } catch (error) {
      console.error("트윗 게시 중 오류가 발생했습니다:", error);
      alert("트윗 게시 중 오류가 발생했습니다.");
    }
  };

  const handleCopyText = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      alert("복사할 내용이 없습니다.");
      console.error("No textarea reference available."); // Debugging missing textarea
      return;
    }

    const textToCopy = textarea.value;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("텍스트가 클립보드에 복사되었습니다!");
        console.log("Text copied to clipboard:", textToCopy); // Debugging copied text
      })
      .catch((err) => {
        console.error("텍스트 복사 실패:", err);
        alert("텍스트 복사에 실패했습니다. 다시 시도해주세요.");
      });
  };

  const onCancel = () => {
    console.log("Navigation canceled, redirecting to main/sold."); // Debugging cancel navigation
    navigate(`/main/sold`);
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      console.log("Textarea height adjusted:", textarea.scrollHeight); // Debugging textarea height
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "날짜 정보 없음";
    try {
      const date = new Date(dateString);
      const formattedDate = new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
      console.log("Formatted date:", formattedDate); // Debugging formatted date
      return formattedDate;
    } catch (error) {
      console.error("Invalid date format:", dateString, error);
      return "날짜 정보 없음";
    }
  };

  if (loading) {
    console.log("Loading state, showing loader."); // Debugging loading state
    return <div>로딩 중...</div>;
  }

  if (error) {
    console.error("Error state, showing error message:", error); // Debugging error state
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col w-full h-main-height">
      <MainIndex />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full p-4 overflow-y-auto max-h-main-menu-height"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg mb-4">홍보글 생성(직접 수정하셔도 됩니다.)</h3>
          <button
            type="button"
            className="text-gray-500 text-xl hover:text-black"
            onClick={onCancel}
          >
            ×
          </button>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">좌석 사진</label>
          {fixedSeatImageUrl ? (
            <div className="flex flex-col items-start">
              {/* 왼쪽 정렬 */}
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
        <div className="mb-4">
          <label className="block font-semibold mb-2">홍보 내용</label>
          {/* 홍보글 내용 */}
          {ticketDetails && (
            <>
              <textarea
                ref={textareaRef}
                className="border p-2 mb-4 rounded-md w-full overflow-y-auto resize-none"
                style={{ height: "auto", minHeight: "250px" }}
                onInput={handleInput}
                defaultValue={`${ticketDetails.title || "공연 이름 없음"} 양도
                ${formatDate(ticketDetails.date)}
                캐스팅: ${ticketDetails.casting || "캐스팅 정보 없음"}
                가격: ${ticketDetails.price || "가격 정보 없음"}원
                좌석 정보: ${ticketDetails.seat || "좌석 정보 없음"}
                <연뮤마켓> 통해서 안전 거래
                https://www.yeonmu.shop/chat/join/${ticketDetails.id}`.trim()} // 공백 제거
              />
              <div className="flex w-full justify-around items-center gap-2 pb-6">
                <button
                  type="button"
                  className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-md"
                  onClick={handleCopyText}
                >
                  텍스트 복사
                </button>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default PromoForm;
