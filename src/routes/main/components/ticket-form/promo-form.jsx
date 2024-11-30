import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import XIcon from "../../../../assets/xlogo.png";
import UrlIcon from "../../../../assets/url.png";
import { fetchTicketPostDetail, postTweet } from "../../../../apis/api"; // Import necessary API functions

const PromoForm = () => {
  const navigate = useNavigate();
  const [ticketDetails, setTicketDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pathname = window.location.pathname; // "/main/new/103"
  const ticketId = pathname.split("/").pop(); // 마지막 경로를 가져옴

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const data = await fetchTicketPostDetail(ticketId);
        setTicketDetails(data?.ticket || null); // `ticket` 객체만 저장
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ticket details:", err);
        setError("Failed to load ticket details.");
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [ticketId]);

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
      http://localhost:5173/chat/join/${ticketId}
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

    const textToCopy = textarea.value; // textarea의 값을 가져옴
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
  const textareaRef = useRef(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // 기존 높이 초기화
      textarea.style.height = `${textarea.scrollHeight}px`; // 내용 높이에 맞게 조정
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

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-lg border-2 border-gray-300 rounded-md mx-5 mt-4">
      <form className="flex flex-col w-full p-4 overflow-y-auto max-h-main-menu-height">
        <div className="flex flex-col justify-center min-h-main-menu-height w-full p-8">
          <h3 className="py-2 font-bold">
            홍보글 생성(직접 수정하셔도 됩니다)
          </h3>
          {ticketDetails && (
            <>
              <textarea
                ref={textareaRef}
                className="border p-2 mb-4 rounded-md w-full h-64"
                style={{ resize: "none", overflowY: "hidden" }}
                onInput={handleInput}
                defaultValue={`
${ticketDetails.title || "공연 이름 없음"} 양도
${formatDate(ticketDetails.date)}
캐스팅: ${ticketDetails.casting || "캐스팅 정보 없음"}
가격: ${ticketDetails.price || "가격 정보 없음"}원
좌석 정보: ${ticketDetails.seat || "좌석 정보 없음"}
<연뮤마켓> 통해서 안전 거래
http://localhost:5173/chat/join/${ticketId}
`}
              />
              <div className="flex w-full justify-around items-center gap-2 pb-24">
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
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default PromoForm;
