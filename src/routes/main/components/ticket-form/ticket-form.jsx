import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { createTicket } from "../../../../apis/api";

export const TicketForm = () => {
  const navigate = useNavigate();
  const [performanceName, setPerformanceName] = useState(null);
  const [reservImage, setReservImage] = useState(null);
  const [seatImage, setSeatImage] = useState(null);
  const [reservFile, setReservFile] = useState(null); // Server-side file
  const [seatFile, setSeatFile] = useState(null); // Server-side file
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedMin, setSelectedMin] = useState(null);
  const [selectedAmPm, setSelectedAmPm] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [ticketNumber, setTicketNumber] = useState(false);
  const [seatInfo, setSeatInfo] = useState(false);
  const [castingInfo, setCastingInfo] = useState(false);
  const [price, setPrice] = useState(false);
  const [discountInfo, setDiscountInfo] = useState(false);
  const [lastFourDigits, setLastFourDigits] = useState("");

  const site = [
    { value: "인터파크", label: "인터파크" },
    { value: "예스24", label: "예스24" },
    { value: "티켓베이", label: "티켓베이" },
  ];
  const hours = Array.from({ length: 12 }, (v, k) => ({
    value: k + 1,
    label: `${k + 1}시`,
  }));
  const minutes = Array.from({ length: 6 }, (v, k) => ({
    value: k,
    label: `${10 * k}분`,
  }));
  const amPmOptions = [
    { value: "AM", label: "AM" },
    { value: "PM", label: "PM" },
  ];

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("ticketFormData"));
    if (savedData) {
      console.log("Restoring saved data:", savedData);

      // 이미지 파일 복원
      if (savedData.reservImage) {
        setReservImage(savedData.reservImage);
      }
      if (savedData.seatImage) {
        setSeatImage(savedData.seatImage);
      }

      setPerformanceName(savedData.performanceName || "");
      setLastFourDigits(savedData.lastFourDigits || "");
      setSelectedSite(savedData.selectedSite || null);
      setSelectedDate(
        savedData.selectedDate ? new Date(savedData.selectedDate) : null
      ); // 날짜 복원
      setSelectedHour(savedData.selectedHour || null);
      setSelectedMin(savedData.selectedMin || null);
      setSelectedAmPm(savedData.selectedAmPm || null);
      setTicketNumber(savedData.ticketNumber || "");
      setSeatInfo(savedData.seatInfo || "");
      setCastingInfo(savedData.castingInfo || "");
      setPrice(savedData.price || "");
      setDiscountInfo(savedData.discountInfo || "");
      setTermsAccepted(savedData.termsAccepted || false);
      setShowAdditionalFields(savedData.showAdditionalFields || false);
    }
  }, []);

  // 임시 저장 (localStorage에 저장)
  const handleTempSave = () => {
    console.log("Saving the following data:");
    console.log("Performance Name:", performanceName); // Check if it's correctly logged
    console.log("Last Four Digits:", lastFourDigits);

    const formData = {
      performanceName, // Ensure it's included here
      reservImage,
      seatImage,
      selectedSite,
      selectedDate: selectedDate ? selectedDate.toISOString() : null,
      selectedHour,
      selectedMin,
      selectedAmPm,
      ticketNumber,
      seatInfo,
      castingInfo,
      price,
      discountInfo,
      termsAccepted,
      showAdditionalFields,
      lastFourDigits,
    };

    localStorage.setItem("ticketFormData", JSON.stringify(formData)); // Ensure it's saved
    alert("임시저장 완료!");
  };

  const handleReservUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setReservImage(URL.createObjectURL(file)); // For display
      setReservFile(file); // For server-side upload
    }
  };

  const handleSeatUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSeatImage(URL.createObjectURL(file)); // For display
      setSeatFile(file); // For server-side upload
    }
  };

  const handleTermsChange = () => {
    setTermsAccepted(!termsAccepted);
  };

  const handleUploadComplete = async () => {
    // Check if required files are uploaded
    if (!reservFile || !seatFile) {
      alert("예매내역서와 좌석 사진을 모두 업로드해주세요.");
      return;
    }

    // Log the performance name before the upload
    console.log("Performance Name before upload:", performanceName);

    const formData = new FormData();
    formData.append("performanceName", performanceName); // Append the performance name
    formData.append("keyword", selectedSite ? selectedSite.value : "");
    formData.append("reservImage", reservFile);
    formData.append("seatImage", seatFile);

    try {
      const response = await fetch(
        "http://localhost:8000/api/tickets/process_image/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const responseData = await response.json(); // Parse the JSON response
        console.log("Response Data:", responseData);

        // Update state with the new data received
        const { 관람년도, 관람월, 관람일, 관람시간 } = responseData.date_info;
        const selectedDate = new Date(`${관람년도}-${관람월}-${관람일}`);
        const selectedHour = 관람시간.시;
        const selectedMin = 관람시간.분;
        const selectedAmPm = selectedHour >= 12 ? "PM" : "AM";

        setPerformanceName(performanceName || ""); // Make sure this updates state
        setLastFourDigits(responseData.lastFourDigits || "");
        setSelectedDate(selectedDate);
        setSelectedHour(selectedHour % 12);
        setSelectedMin(selectedMin);
        setSelectedAmPm(selectedAmPm);
        setTicketNumber(responseData.ticket_number || "");
        setSeatInfo(responseData.seat_number || "");
        setCastingInfo(responseData.cast_info || "");
        setPrice(responseData.total_amount || "");
        setDiscountInfo(responseData.price_grade || "");
        setShowAdditionalFields(true);
      } else {
        console.error("Status Code:", response.status);
        console.error("Response Text:", await response.text());
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    const formattedDate = selectedDate.toISOString().split("T")[0];

    // 가격에서 콤마 제거
    const formattedPrice = price.replace(/,/g, "");
    formData.append("title", performanceName);
    formData.append("date", formattedDate);
    formData.append("seat", seatInfo);
    formData.append("price", formattedPrice);
    formData.append("casting", castingInfo);
    formData.append("booking_details", discountInfo);
    formData.append("reservImage", reservFile);
    formData.append("seatImage", seatFile);
    formData.append("phone_last_digits", lastFourDigits);
    formData.append("keyword", selectedSite ? selectedSite.value : "");

    try {
      const response = await createTicket(formData); // 티켓 생성 API 호출

      // 성공적으로 응답을 받으면 알림을 띄우고 페이지 이동
      alert("티켓 등록이 완료되었습니다.");
      localStorage.removeItem("ticketFormData");
      navigate("/main/sold");
    } catch (error) {
      // 에러 로그 출력
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <div className="max-w-lg p-1 border-2 border-gray-300 rounded-md mx-5 mt-4">
      <form className="flex flex-col w-full p-4 overflow-y-auto max-h-main-menu-height">
        <h1>양도글 작성</h1>
        <h3 className="text-gray-500 mb-6">
          양도할 티켓의 정보를 입력해주세요.
        </h3>

        <label className="block mb-2 font-bold">공연 이름</label>
        <input
          type="text"
          placeholder="Value"
          className="border p-2 mb-4 rounded-md"
          value={performanceName || ""} // Ensure a fallback empty string for controlled input
          onChange={(e) => setPerformanceName(e.target.value)} // Make sure this correctly updates state
        />

        <div className="mb-4">
          <label className="block mb-2 font-bold">예매내역서</label>
          <div className="upload-container">
            <input
              type="file"
              accept="image/*"
              onChange={handleReservUpload}
              style={{ display: "none" }}
              id="upload1"
            />
            <label htmlFor="upload1" className="cursor-pointer upload-box">
              {reservImage && (
                <img
                  src={reservImage}
                  alt="예매내역서"
                  className="max-h-[230px] max-w-[230px] object-cover"
                />
              )}
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-bold">좌석 사진</label>
          <div className="upload-container">
            <input
              type="file"
              accept="image/*"
              onChange={handleSeatUpload}
              style={{ display: "none" }}
              id="upload2"
            />
            <label htmlFor="upload2" className="cursor-pointer upload-box">
              {seatImage && (
                <img
                  src={seatImage}
                  alt="좌석 사진"
                  className="max-h-[230px] max-w-[230px] object-cover"
                />
              )}
            </label>
          </div>
        </div>

        <label className="block mb-2 font-bold">예매처</label>
        <div className="flex gap-2 mb-4">
          <Select
            options={site}
            value={selectedSite}
            onChange={setSelectedSite}
            placeholder="선택"
            className="flex-1"
          />
        </div>

        {!showAdditionalFields && (
          <button
            type="button"
            className="bg-gray-800 text-white mx-24 my-3 px-4 py-2 rounded-md mb-4"
            onClick={handleUploadComplete}
          >
            업로드 완료
          </button>
        )}

        {showAdditionalFields && (
          <>
            <label className="block mb-2 font-bold">공연 날짜</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy년 MM월 dd일"
              locale={ko}
              dropdownMode="select"
              placeholderText="날짜 선택"
              className="border p-2 w-full mb-4 rounded-md"
            />
            <label className="block mb-2 font-bold">공연 시간</label>
            <div className="flex gap-2 mb-4">
              <Select
                options={hours}
                value={hours.find((option) => option.value === selectedHour)} // hours 배열에서 현재 선택된 hour를 찾음
                onChange={(option) => setSelectedHour(option.value)} // 선택된 객체에서 값을 추출하여 설정
                placeholder="시간"
                className="flex-1"
              />

              <Select
                options={minutes}
                value={
                  minutes.find((option) => option.value === selectedMin) || {
                    value: 0,
                    label: "0분",
                  }
                } // 0을 명시적으로 처리
                onChange={(option) => setSelectedMin(option.value)}
                placeholder="분"
                className="flex-1"
              />

              <Select
                options={amPmOptions}
                value={amPmOptions.find(
                  (option) => option.value === selectedAmPm
                )} // amPmOptions에서 현재 선택된 AM/PM을 찾음
                onChange={(option) => setSelectedAmPm(option.value)} // 선택된 객체에서 값을 추출하여 설정
                placeholder="AM/PM"
                className="flex-1"
              />
            </div>

            <label className="block mb-2 font-bold">예매번호</label>
            <input
              type="text"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              placeholder="Value"
              className="border p-2 mb-4 rounded-md"
            />

            <label className="block mb-2 font-bold">좌석 정보</label>
            <input
              type="text"
              value={seatInfo}
              onChange={(e) => setSeatInfo(e.target.value)}
              placeholder="Value"
              className="border p-2 mb-4 rounded-md"
            />

            <label className="block mb-2 font-bold">캐스팅 정보</label>
            <input
              type="text"
              value={castingInfo}
              onChange={(e) => setCastingInfo(e.target.value)}
              placeholder="Value"
              className="border p-2 mb-4 rounded-md"
            />

            <label className="block mb-2 font-bold">가격(원가)</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Value"
              className="border p-2 mb-4 rounded-md"
            />

            <label className="block mb-2 font-bold">할인 정보</label>
            <input
              type="text"
              value={discountInfo}
              onChange={(e) => setDiscountInfo(e.target.value)}
              placeholder="Value"
              className="border p-2 mb-4 rounded-md"
            />

            <label className="block mb-2 font-bold">
              예매자 전화번호 마지막 4자리
            </label>
            <input
              type="text"
              placeholder="Value"
              className="border p-2 mb-4 rounded-md"
              value={lastFourDigits} // 상태와 연결
              onChange={(e) => setLastFourDigits(e.target.value)} // 입력 값을 상태로 설정
            />

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={handleTermsChange}
                className="mr-2"
              />
              <label htmlFor="terms">I accept the terms</label>
              <a
                href="/terms"
                className="ml-2 text-gray-400 underline underline-offset-4"
              >
                Read our T&Cs
              </a>
            </div>

            <div className="flex justify-around mt-1">
              <button
                type="button"
                className="bg-gray-800 text-white px-10 rounded-md"
                onClick={handleTempSave}
              >
                임시저장
              </button>
              <button
                type="button"
                className="bg-black text-white px-10 rounded-md"
                onClick={handleSubmit}
              >
                작성 완료
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};
