import React, { useRef } from "react";
import XIcon from "../../../../assets/xlogo.png";
import { postTweet, downloadImage } from "../../../../apis/api";

function PromoForm({ ticket, onSave, onCancel }) {
  const textareaRef = useRef(null);

  // S3 리전 URL 정정 함수
  const fixRegionInUrl = (url) => {
    if (!url) return null;
    const regex = /s3\.ap-northeast-2\.amazonaws\.com/;
    return url.replace(regex, "s3.ap-southeast-2.amazonaws.com");
  };

  // ticket 내부에 좌석 이미지(이미 가공된 이미지)가 있다고 가정
  const fixedSeatImageUrl = fixRegionInUrl(
    ticket.uploaded_processed_seat_image_url
  );

  // 다운로드 (예시)
  const handleDownloadSeatImage = async () => {
    if (!ticket.uploaded_processed_seat_image_url) return;
    try {
      await downloadImage(ticket.uploaded_seat_image_url);
      console.log("Image download triggered successfully");
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  // 날짜 포맷팅
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

  // 트윗에 게시 (선택 기능)
  const handlePublishToX = async () => {
    if (!ticket) {
      alert("티켓 정보를 불러오는 중입니다. 다시 시도해주세요.");
      return;
    }
    const tweetContent = `
      ${ticket.title || "공연 이름 없음"} 교환
      ${formatDate(ticket.date)}
      캐스팅: ${ticket.casting || "캐스팅 정보 없음"}
      가격: ${ticket.price || "가격 정보 없음"}원
      좌석 정보: ${ticket.seat || "좌석 정보 없음"}
      <연뮤마켓> 통해서 안전 거래
      https://www.yeonmu.shop/exchange/join/${ticket.id}
    `.trim();

    try {
      const response = await postTweet(tweetContent);
      alert("트윗이 성공적으로 게시되었습니다.");
      console.log("Tweet posted successfully:", response);
    } catch (error) {
      console.error(
        "트윗 게시 중 오류가 발생했습니다:",
        error.response?.data || error.message
      );
      alert("트윗 게시 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 홍보 문구 복사
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

  // textarea 자동 높이 조절
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // 폼 제출 (실제 서버 저장은 필요 없다면 onSave로 로컬 state 갱신만)
  const handleSubmit = (e) => {
    e.preventDefault();
    // 이 예시에서는 ticket 자체에 홍보글을 첨부한다고 가정
    onSave(ticket);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full p-4 overflow-y-auto max-h-main-menu-height"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl mb-4">홍보글 생성</h2>
        <button
          type="button"
          className="text-gray-500 text-xl hover:text-black"
          onClick={onCancel}
        >
          ×
        </button>
      </div>

      {/* 좌석 사진 */}
      <div className="mb-4">
        <label className="block font-semibold mb-2 text-left">좌석 사진</label>
        {fixedSeatImageUrl ? (
          <div className="flex flex-col items-center">
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

      {/* 홍보글 내용 */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">홍보 내용</label>
        <textarea
          ref={textareaRef}
          className="border p-2 mb-4 rounded-md w-full overflow-y-auto resize-none"
          style={{ height: "auto", minHeight: "250px" }}
          onInput={handleInput}
          defaultValue={`
${ticket.title || "공연 이름 없음"} 교환
${formatDate(ticket.date)}
캐스팅: ${ticket.casting || "캐스팅 정보 없음"}
가격: ${ticket.price || "가격 정보 없음"}원
좌석 정보: ${ticket.seat || "좌석 정보 없음"}
<연뮤마켓> 통해서 안전 거래
https://www.yeonmu.shop/exchange/join/${ticket.id}
          `.trim()}
        />
      </div>

      <div className="flex w-full justify-around items-center gap-2 pb-6">
        {/* 트윗에 게시 (필요하다면 주석 해제) */}
        {/* 
        <button
          type="button"
          className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-md"
          onClick={handlePublishToX}
        >
          <img src={XIcon} alt="X 로고" className="w-5 h-5" />
          트윗 게시
        </button>
        */}
        <button
          type="button"
          className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-md"
          onClick={handleCopyText}
        >
          텍스트 복사
        </button>
      </div>
    </form>
  );
}

export default PromoForm;
