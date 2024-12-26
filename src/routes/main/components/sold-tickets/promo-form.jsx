import React, { useState, useEffect, useRef } from "react";
import XIcon from "../../../../assets/xlogo.png";
import { postTweet, downloadImage } from "../../../../apis/api";

function PromoForm({ ticket, onSave, onCancel }) {
  // ticket 객체에서 공연명 등 필요한 기본값을 미리 세팅
  const textareaRef = useRef(null);

  // URL 리전 변경 로직
  const fixRegionInUrl = (url) => {
    if (!url) return null;
    const regex = /s3\.ap-northeast-2\.amazonaws\.com/;
    return url.replace(regex, "s3.ap-southeast-2.amazonaws.com");
  };

  const fixedSeatImageUrl = fixRegionInUrl(
    ticket.uploaded_processed_seat_image_url
  );

  const handleDownloadSeatImage = async () => {
    if (!ticket.uploaded_processed_seat_image_url) return;

    try {
      await downloadImage(selectedTicket.uploaded_seat_image_url);
      console.log("Image download triggered successfully");
    } catch (error) {
      console.error("Failed to download image:", error);
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

  const handlePublishToX = async () => {
    if (!ticket) {
      alert("티켓 정보를 불러오는 중입니다. 다시 시도해주세요.");
      console.error("No ticket details available during publish.");
      return;
    }

    const tweetContent = `
    ${ticket.title || "공연 이름 없음"} 양도
    ${formatDate(ticket.date)}
    캐스팅: ${ticket.casting || "캐스팅 정보 없음"}
    가격: ${ticket.price || "가격 정보 없음"}원
    좌석 정보: ${ticket.seat || "좌석 정보 없음"}
    <연뮤마켓> 통해서 안전 거래
    https://www.yeonmu.shop/chat/join/${ticket.id}
  `.trim();

    console.log("Generated tweet content:", tweetContent);

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
  // 폼 submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTicket = {
      ...ticket,
      promoTitle,
      promoContent,
    };
    onSave(updatedTicket);
  };
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
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
      <div className="mb-4">
      <label className="block font-semibold mb-2 text-left">
        좌석 사진
      </label>
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
          defaultValue={
            ticket
              ? `${ticket.title || "공연 이름 없음"} 양도\n${formatDate(
                  ticket.date
                )}\n캐스팅: ${ticket.casting || "캐스팅 정보 없음"}\n가격: ${
                  ticket.price || "가격 정보 없음"
                }원\n좌석 정보: ${
                  ticket.seat || "좌석 정보 없음"
                }\n<연뮤마켓> 통해서 안전 거래\nhttps://www.yeonmu.shop/chat/join/${
                  ticket.id
                }`.trim()
              : "티켓 정보를 불러오는 중입니다."
          }
        />
      </div>
      <div className="flex w-full justify-around items-center gap-2 pb-6">
        {/* <button
          type="button"
          className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-md"
          onClick={handlePublishToX}
        >
          <img src={XIcon} alt="X 로고" className="w-5 h-5" />에 게시
        </button> */}
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
