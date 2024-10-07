import React, { useState } from "react";
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ko } from 'date-fns/locale';

export const TicketForm = () => {
  const [reservImage, setReservImage] = useState(null);
  const [seatImage, setSeatImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedMin, setSelectedMin] = useState(null);
  const [selectedAmPm, setSelectedAmPm] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const hours = Array.from({length: 12}, (v, k) => ({value: k+1, label: `${k+1}시`}));
  const minutes = Array.from({length: 6}, (v, k) => ({value: k, label: `${10*k}분`}));
  const amPmOptions = [
    {value: 'AM', label: 'AM'},
    {value: 'PM', label: 'PM'},
  ];

  const handleReservUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setReservImage(URL.createObjectURL(file));
    }
  };

  const handleSeatUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSeatImage(URL.createObjectURL(file));
    }
  };

  const handleTermsChange = () => {
    setTermsAccepted(!termsAccepted);
  };

  return (
    <div className="max-w-lg p-1 border-2 border-gray-300 rounded-md mx-5 mt-4">
      <form className="flex flex-col w-full p-4 overflow-y-auto max-h-main-menu-height">
        <h1>양도글 작성</h1>
        <h3 className="text-gray-500 mb-8">양도할 티켓의 정보를 입력해주세요.</h3>
        <div className="mb-4">
          <label className="block mb-2 font-bold">예매내역서</label>
          <div className="upload-container">
            <input type="file" accept="image/*" onChange={handleReservUpload} style={{display: 'none'}} id='upload1' />
            <label htmlFor="upload1" className="cursor-pointer upload-box">
              {reservImage && (
                <img src={reservImage} alt="예매내역서" className="max-h-[230px] max-w-[230px] object-cover" />
              )}
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold">좌석 사진</label>
          <div className="upload-container">
            <input type="file" accept="image/*" onChange={handleSeatUpload} style={{display: 'none'}} id='upload2' />
            <label htmlFor="upload2" className="cursor-pointer upload-box">
              {seatImage && (
                <img src={seatImage} alt="좌석 사진" className="max-h-[230px] max-w-[230px] object-cover" />
              )}
            </label>
          </div>
        </div>
        <label className="block mb-2 font-bold">공연 이름</label>
        <input type="text" placeholder="Value" className="border p-2 mb-4" />

        <label className="block mb-2 font-bold">공연 날짜</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy년 MM월 dd일"
          locale={ko}
          dropdownMode="select"
          placeholderText="날짜 선택"
          className="border p-2 w-full mb-4"
        />
        <label className="block mb-2 font-bold">공연 시간</label>
        <div className="flex gap-2 mb-4">
        <Select
          options={hours}
          value={selectedHour}
          onChange={setSelectedHour}
          placeholder="시간"
          className="flex-1"
        />
        <Select
          options={minutes}
          value={selectedMin}
          onChange={setSelectedMin}
          placeholder="분"
          className="flex-1"
        />
        <Select
          options={amPmOptions}
          value={selectedAmPm}
          onChange={setSelectedAmPm}
          placeholder="AM/PM"
          className="flex-1"
        />
        </div>

        <label className="block mb-2 font-bold">예매자명</label>
        <input type="text" placeholder="Value" className="border p-2 mb-4" />

        <label className="block mb-2 font-bold">전화번호 마지막 4자리</label>
        <input type="text" placeholder="Value" className="border p-2 mb-4" />

        <label className="block mb-2 font-bold">희망 판매 가격</label>
        <input type="text" placeholder="Value" className="border p-2 mb-4" />

        <label className="block mb-2 font-bold">할인 정보</label>
        <input type="text" placeholder="Value" className="border p-2 mb-4" />

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={handleTermsChange}
            className="mr-2"
          />
          <label htmlFor="terms">I accept the terms</label>
          <a href="/terms" className="ml-2 text-gray-400 underline underline-offset-4">Read our T&Cs</a>
        </div>

        <div className="flex justify-around mt-1">
          <button type="button" className="bg-gray-800 text-white px-10 rounded-md">임시저장</button>
          <button href="/main" className="bg-black text-white px-10 rounded-md">작성 완료</button>
        </div>

      </form>
    </div>
  )
};