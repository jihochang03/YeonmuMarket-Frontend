import React, { useState } from 'react';

const EditTicketForm = ({ ticket, onSave, onCancel }) => {
  const [editedTicket, setEditedTicket] = useState(ticket);
  const [previewReceipt, setPreviewReceipt] = useState(ticket.uploaded_file);
  const [previewSeatImage, setPreviewSeatImage] = useState(ticket.uploaded_seat_image);

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
        setEditedTicket({ ...editedTicket, [field]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form className="flex flex-col w-full p-4 overflow-y-auto max-h-main-menu-height">
      <h1>양도글 수정하기</h1>
      <label className="block my-2 font-bold">공연 이름</label>
      <input
        type="text"
        name="title"
        value={editedTicket.title}
        onChange={handleChange}
        className="border p-2 mb-4 rounded-md"
      />

      <label className="block mb-2 font-bold">예매내역서</label>
      <input
        type="file"
        onChange={(e) => handleFileChange(e, "uploaded_file")}
        className="mb-2"
      />
      {previewReceipt ? (
        <img src={previewReceipt} alt="예매내역서" className="max-h-[230px] max-w-[230px] mb-4" />
      ) : (
        <span className="mb-4">이미지가 없습니다.</span>
      )}

      <label className="block mb-2 font-bold">좌석 사진</label>
      <input
        type="file"
        onChange={(e) => handleFileChange(e, "uploaded_seat_image")}
        className="mb-2"
      />
      {previewSeatImage ? (
        <img src={previewSeatImage} alt="좌석 사진" className="max-h-[230px] max-w-[230px] mb-4" />
      ) : (
        <span className="mb-4">이미지가 없습니다.</span>
      )}

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
        name="keyword"
        value={editedTicket.keyword}
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

      <label className="block mb-2 font-bold">예매자 전화번호 마지막 4자리</label>
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
          onClick={() => onSave(editedTicket)}
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