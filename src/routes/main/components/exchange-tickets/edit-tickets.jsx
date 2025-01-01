import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateTicketPost } from "../../../../apis/api";

const EditTicketForm = ({ ticket, onCancel, onSave }) => {
  const navigate = useNavigate();

  // ticket prop을 펼쳐서 기본값 세팅
  const [editedTicket, setEditedTicket] = useState({
    ...ticket,
    title: ticket.title || "",
    date: ticket.date || "",
    seat: ticket.seat || "",
    booking_page: ticket.booking_page || "",
    casting: ticket.casting || "",
    price: ticket.price || "",
    phone_last_digits: ticket.phone_last_digits || "",
  });

  // S3 리전 URL 정정 함수 (필요 시 사용)
  const fixRegionInUrl = (url) => {
    if (!url) return null;
    const regex = /s3\.ap-northeast-2\.amazonaws\.com/;
    return url.replace(regex, "s3.ap-southeast-2.amazonaws.com");
  };

  // 기존 이미지(파일) URL 정정
  const fixedReceiptUrl = fixRegionInUrl(ticket.uploaded_file_url);
  const fixedSeatImageUrl = fixRegionInUrl(ticket.uploaded_seat_image_url);
  const fixedMaskedReceiptUrl = fixRegionInUrl(ticket.masked_file_url);
  const fixedMaskedSeatImageUrl = fixRegionInUrl(
    ticket.processed_seat_image_url
  );

  // 미리보기 state
  const [previewReceipt, setPreviewReceipt] = useState(fixedReceiptUrl);
  const [previewSeatImage, setPreviewSeatImage] = useState(fixedSeatImageUrl);
  const [previewMaskedReceipt, setPreviewMaskedReceipt] = useState(
    fixedMaskedReceiptUrl
  );
  const [previewMaskedSeatImage, setPreviewMaskedSeatImage] = useState(
    fixedMaskedSeatImageUrl
  );

  // 일반 텍스트 필드 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTicket({ ...editedTicket, [name]: value });
  };

  // 파일(이미지) 핸들러
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === "uploaded_file") {
          setPreviewReceipt(reader.result);
        } else if (field === "uploaded_seat_image") {
          setPreviewSeatImage(reader.result);
        } else if (field === "uploaded_masked_file") {
          setPreviewMaskedReceipt(reader.result);
        } else if (field === "uploaded_masked_seat_image") {
          setPreviewMaskedSeatImage(reader.result);
        }
        setEditedTicket({ ...editedTicket, [field]: file });
      };
      reader.readAsDataURL(file);
    }
  };

  // 저장(수정) 요청
  const handleSave = async () => {
    const formData = new FormData();
    Object.entries(editedTicket).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    });

    try {
      // 기존에 사용하던 API가 있다면 그대로 사용
      const response = await updateTicketPost(ticket.id, formData);
      alert("교환 티켓 수정이 완료되었습니다.");
      onSave(response);
      // 필요 시 새로고침
      // window.location.reload();
    } catch (error) {
      console.error("Error updating ticket:", error);
      alert("티켓 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <form className="flex flex-col w-full p-4 overflow-y-auto max-h-main-menu-height">
      <h1 className="text-xl font-bold mb-4">교환 티켓 수정하기</h1>

      {/* 예매내역서 */}
      <div className="mb-4">
        <label className="block mb-2 font-bold">예매내역서</label>
        <input
          type="file"
          onChange={(e) => handleFileChange(e, "uploaded_file")}
          className="mb-2"
        />
        {previewReceipt ? (
          <img
            src={previewReceipt}
            alt="예매내역서"
            className="max-h-[230px] max-w-[230px] mb-4"
          />
        ) : (
          <span className="mb-4">이미지가 없습니다.</span>
        )}
      </div>

      {/* 좌석 사진 */}
      <div className="mb-4">
        <label className="block mb-2 font-bold">좌석 사진</label>
        <input
          type="file"
          onChange={(e) => handleFileChange(e, "uploaded_seat_image")}
          className="mb-2"
        />
        {previewSeatImage ? (
          <img
            src={previewSeatImage}
            alt="좌석 사진"
            className="max-h-[230px] max-w-[230px] mb-4"
          />
        ) : (
          <span className="mb-4">이미지가 없습니다.</span>
        )}
      </div>

      {/* 가려진 예매내역서 */}
      <div className="mb-4">
        <label className="block mb-2 font-bold">가려진 예매내역서</label>
        <input
          type="file"
          onChange={(e) => handleFileChange(e, "uploaded_masked_file")}
          className="mb-2"
        />
        {previewMaskedReceipt ? (
          <img
            src={previewMaskedReceipt}
            alt="가려진 예매내역서"
            className="max-h-[230px] max-w-[230px] mb-4"
          />
        ) : (
          <span className="mb-4">이미지가 없습니다.</span>
        )}
      </div>

      {/* 가려진 좌석 사진 */}
      <div className="mb-4">
        <label className="block mb-2 font-bold">가려진 좌석 사진</label>
        <input
          type="file"
          onChange={(e) => handleFileChange(e, "uploaded_masked_seat_image")}
          className="mb-2"
        />
        {previewMaskedSeatImage ? (
          <img
            src={previewMaskedSeatImage}
            alt="가려진 좌석 사진"
            className="max-h-[230px] max-w-[230px] mb-4"
          />
        ) : (
          <span className="mb-4">이미지가 없습니다.</span>
        )}
      </div>

      {/* 공연 이름 */}
      <label className="block my-2 font-bold">공연 이름</label>
      <input
        type="text"
        name="title"
        value={editedTicket.title}
        onChange={handleChange}
        className="border p-2 mb-4 rounded-md"
      />

      {/* 공연 날짜 */}
      <label className="block mb-2 font-bold">공연 날짜</label>
      <input
        type="date"
        name="date"
        value={editedTicket.date}
        onChange={handleChange}
        className="border p-2 rounded-md mb-4"
      />

      {/* 좌석 정보 */}
      <label className="block mb-2 font-bold">좌석 정보</label>
      <input
        type="text"
        name="seat"
        value={editedTicket.seat}
        onChange={handleChange}
        className="border p-2 rounded-md mb-4"
      />

      {/* 예매처 */}
      <label className="block mb-2 font-bold">예매처</label>
      <input
        type="text"
        name="booking_page"
        value={editedTicket.booking_page}
        onChange={handleChange}
        className="border p-2 rounded-md mb-4"
      />

      {/* 캐스팅 정보 */}
      <label className="block mb-2 font-bold">캐스팅 정보</label>
      <input
        type="text"
        name="casting"
        value={editedTicket.casting}
        onChange={handleChange}
        className="border p-2 rounded-md mb-4"
      />

      {/* 가격 */}
      <label className="block mb-2 font-bold">가격</label>
      <input
        type="number"
        name="price"
        value={editedTicket.price}
        onChange={handleChange}
        className="border p-2 rounded-md mb-4"
      />

      {/* 예매자 전화번호 마지막 4자리 */}
      <label className="block mb-2 font-bold">
        예매자 전화번호 마지막 4자리
      </label>
      <input
        type="text"
        name="phone_last_digits"
        value={editedTicket.phone_last_digits}
        onChange={handleChange}
        className="border p-2 rounded-md mb-4"
      />

      {/* 버튼들 */}
      <div className="flex justify-center items-center gap-12 mt-4">
        <button
          type="button"
          className="bg-black text-white px-8 py-2 rounded-md"
          onClick={handleSave}
        >
          저장
        </button>
        <button
          type="button"
          className="bg-black text-white px-8 py-2 rounded-md"
          onClick={onCancel}
        >
          취소
        </button>
      </div>
    </form>
  );
};

export default EditTicketForm;