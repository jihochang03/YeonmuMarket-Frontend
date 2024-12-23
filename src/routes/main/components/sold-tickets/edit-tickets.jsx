import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateTicketPost } from "../../../../apis/api";

const EditTicketForm = ({ ticket, onCancel, onSave }) => {
  const navigate = useNavigate(); // useNavigate 훅 선언

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

  const fixRegionInUrl = (url) => {
    if (!url) return null;
    const regex = /s3\.ap-northeast-2\.amazonaws\.com/;
    return url.replace(regex, "s3.ap-southeast-2.amazonaws.com");
  };

  const fixedReceiptUrl = fixRegionInUrl(ticket.uploaded_file_url);
  const fixedSeatImageUrl = fixRegionInUrl(ticket.uploaded_seat_image_url);

  const [previewReceipt, setPreviewReceipt] = useState(fixedReceiptUrl);
  const [previewSeatImage, setPreviewSeatImage] = useState(fixedSeatImageUrl);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTicket({ ...editedTicket, [name]: value });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === "uploaded_file") {
          setPreviewReceipt(reader.result);
        } else if (field === "uploaded_seat_image") {
          setPreviewSeatImage(reader.result);
        }
        setEditedTicket({ ...editedTicket, [field]: file });
      };
      reader.readAsDataURL(file);
    }
  };

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
      const response = await updateTicketPost(ticket.id, formData); // Update the ticket via API
      alert("수정이 완료되었습니다."); // Show success alert
      onSave(response); // Pass updated ticket back to parent
      window.location.reload(); // 새로 고침
    } catch (error) {
      console.error("Error updating ticket:", error);
      alert("티켓 수정 중 오류가 발생했습니다."); // Show error alert
    }
  };

  return (
    <form className="flex flex-col w-full p-4 overflow-y-auto max-h-main-menu-height">
      <h1>양도글 수정하기</h1>

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

      <label className="block my-2 font-bold">공연 이름</label>
      <input
        type="text"
        name="title"
        value={editedTicket.title || ""}
        onChange={handleChange}
        className="border p-2 mb-4 rounded-md"
      />

      <label className="block mb-2 font-bold">공연 날짜</label>
      <input
        type="date"
        name="date"
        value={editedTicket.date}
        onChange={handleChange}
        className="border p-2 rounded-md mb-4"
      />

      <label className="block mb-2 font-bold">좌석 정보</label>
      <input
        type="text"
        name="seat"
        value={editedTicket.seat}
        onChange={handleChange}
        className="border p-2 rounded-md mb-4"
      />

      <label className="block mb-2 font-bold">예매처</label>
      <input
        type="text"
        name="booking_page"
        value={editedTicket.booking_page}
        onChange={handleChange}
        className="border p-2 rounded-md mb-4"
      />

      <label className="block mb-2 font-bold">캐스팅 정보</label>
      <input
        type="text"
        name="casting"
        value={editedTicket.casting}
        onChange={handleChange}
        className="border p-2 rounded-md mb-4"
      />

      <label className="block mb-2 font-bold">가격</label>
      <input
        type="number"
        name="price"
        value={editedTicket.price}
        onChange={handleChange}
        className="border p-2 rounded-md mb-4"
      />

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
