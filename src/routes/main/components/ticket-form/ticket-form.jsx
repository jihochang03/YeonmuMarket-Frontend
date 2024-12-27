import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import {
  createTicket,
  processImageUpload,
  postTweet,
  downloadImage,
} from "../../../../apis/api";
import XIcon from "../../../../assets/xlogo.png";
import UrlIcon from "../../../../assets/url.png";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export const TicketForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
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
  const [seatInfo, setSeatInfo] = useState(false);
  const [castingInfo, setCastingInfo] = useState(false);
  const [price, setPrice] = useState(false);
  const [discountInfo, setDiscountInfo] = useState(false);
  const [lastFourDigits, setLastFourDigits] = useState("");
  const [isPromoViewVisible, setIsPromoViewVisible] = useState(false);
  const [reservationStatus, setReservationStatus] = useState(null); // 예매 상태
  const [place, setPlace] = useState(null);
  const [maskedReservImage, setMaskedReservImage] = useState(null);
  const [maskedSeatImage, setMaskedSeatImage] = useState(null);
  const [maskedReservFile, setMaskedReservFile] = useState(null); // Server-side file
  const [maskedSeatFile, setMaskedSeatFile] = useState(null); // Server-side file

  const site = [
    { value: "인터파크", label: "인터파크" },
    { value: "예스24", label: "예스24" },
    { value: "티켓링크", label: "티켓링크" },
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
  const base64ToFile = (base64, fileName) => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  };

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("ticketFormData"));
    if (savedData) {
      console.log("Restoring saved data:", savedData);

      if (savedData.reservFile) {
        const reservFile = base64ToFile(
          savedData.reservFile,
          "reservImage.jpg"
        );
        setReservFile(reservFile);
        setReservImage(URL.createObjectURL(reservFile));
      }
      if (savedData.seatFile) {
        const seatFile = base64ToFile(savedData.seatFile, "seatImage.jpg");
        setSeatFile(seatFile);
        setSeatImage(URL.createObjectURL(seatFile));
      }
      if (savedData.maskedReservFile) {
        const maskedReservFile = base64ToFile(
          savedData.maskedReservFile,
          "maskedReservImage.jpg"
        );
        setMaskedReservFile(maskedReservFile);
        setMaskedReservImage(URL.createObjectURL(maskedReservFile));
      }
      if (savedData.maskedSeatFile) {
        const maskedSeatFile = base64ToFile(
          savedData.maskedSeatFile,
          "maskedSeatImage.jpg"
        );
        setMaskedSeatFile(maskedSeatFile);
        setMaskedSeatImage(URL.createObjectURL(maskedSeatFile));
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
      setSeatInfo(savedData.seatInfo || "");
      setCastingInfo(savedData.castingInfo || "");
      setPrice(savedData.price || "");
      setDiscountInfo(savedData.discountInfo || "");
      setTermsAccepted(savedData.termsAccepted || false);
      setShowAdditionalFields(savedData.showAdditionalFields || false);
      setReservationStatus(savedData.reservationStatus || false);
      setPlace(savedData.place || false);
    }
  }, []);
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // 임시 저장 (localStorage에 저장)
  const handleTempSave = async () => {
    console.log("Saving the following data:");
    console.log("Performance Name:", performanceName); // Check if it's correctly logged
    console.log("Last Four Digits:", lastFourDigits);
    try {
      const reservBase64 = reservFile ? await fileToBase64(reservFile) : null; // 예매내역서를 Base64로 변환
      const seatBase64 = seatFile ? await fileToBase64(seatFile) : null; // 좌석 사진을 Base64로 변환
      const maskedReservBase64 = maskedReservFile
        ? await fileToBase64(maskedReservFile)
        : null; // 예매내역서를 Base64로 변환
      const maskedSeatBase64 = maskedSeatFile
        ? await fileToBase64(maskedSeatFile)
        : null; // 좌석 사진을 Base64로 변환
      const formData = {
        performanceName, // Ensure it's included here
        reservImage,
        seatImage,
        selectedSite,
        selectedDate: selectedDate ? selectedDate.toISOString() : null,
        selectedHour,
        selectedMin,
        selectedAmPm,
        seatInfo,
        castingInfo,
        price,
        discountInfo,
        termsAccepted,
        showAdditionalFields,
        lastFourDigits,
        place,
        reservationStatus,
        maskedReservImage,
        maskedSeatImage,
        reservFile: reservBase64,
        seatFile: seatBase64,
        maskedReservFile: maskedReservBase64,
        maskedSeatFile: maskedSeatBase64,
      };

      localStorage.setItem("ticketFormData", JSON.stringify(formData)); // Ensure it's saved
      alert("임시저장 완료!");
    } catch (error) {
      console.error("임시저장 중 오류 발생:", error);
      alert("임시저장 중 오류가 발생했습니다.");
    }
  };

  const handleReservUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setReservImage(URL.createObjectURL(file)); // For display
      setReservFile(file); // For server-side upload
    }
  };
  const handleMaskedReservUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMaskedReservImage(URL.createObjectURL(file)); // For display
      setMaskedReservFile(file); // For server-side upload
    }
  };

  const handleSeatUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSeatImage(URL.createObjectURL(file)); // For display
      setSeatFile(file); // For server-side upload
    }
  };
  const handleMaskedSeatUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMaskedSeatImage(URL.createObjectURL(file)); // For display
      setMaskedSeatFile(file); // For server-side upload
    }
  };

  const handleTermsChange = () => {
    setTermsAccepted(!termsAccepted);
  };

  const handleUploadComplete = async () => {
    setLoading(true);
    if (!reservFile || !seatFile) {
      alert("예매내역서와 좌석 사진을 모두 업로드해주세요.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("performanceName", performanceName);
    formData.append("keyword", selectedSite ? selectedSite.value : "");
    formData.append("reservImage", reservFile);
    formData.append("seatImage", seatFile);
    //formData.append("booking_page", selectedSite ? selectedSite.value : "");

    try {
      const responseData = await processImageUpload(formData); // Call the API function
      console.log("Response Data:", responseData);

      // Handle response data...
      const { 관람년도, 관람월, 관람일, 시간 } = responseData.date_info || {};

      let selectedDate = null;
      let selectedHour = null;
      let selectedMin = null;
      let selectedAmPm = null;

      if (관람년도 && 관람월 && 관람일) {
        selectedDate = new Date(`${관람년도}-${관람월}-${관람일}`);
      }

      if (시간) {
        const [hourStr, minuteStr] = 시간.split(":");
        const hourNum = parseInt(hourStr, 10); // 예: 19
        const minuteNum = parseInt(minuteStr, 10); // 예: 30

        // AM/PM 결정
        selectedAmPm = hourNum >= 12 ? "PM" : "AM";

        // 12시간제로 변환 (13시→1시, 19시→7시, 0시→12시)
        let twelveHour = hourNum % 12;
        if (twelveHour === 0) {
          twelveHour = 12;
        }

        // 분(10분 단위) → 30분이면 3
        const tenMinute = Math.floor(minuteNum / 10);

        selectedHour = twelveHour; // 예: 7
        selectedMin = tenMinute; // 예: 3
      }

      if (responseData.masked_image) {
        const maskedReservBlob = base64ToBlob(
          responseData.masked_image,
          "image/jpeg"
        );
        console.log("MaskedReservBlob:", maskedReservBlob); // Blob 확인

        const reservObjectURL = URL.createObjectURL(maskedReservBlob);
        console.log("ReservObjectURL:", reservObjectURL); // Blob URL 확인

        // Blob → File 변환
        const maskedReservFile = new File(
          [maskedReservBlob],
          "masked_reserv_image.jpg",
          {
            type: "image/jpeg",
          }
        );
        console.log(
          "MaskedReservFile (converted from Blob):",
          maskedReservFile
        ); // File 확인

        // Blob URL 및 File 객체 저장
        setMaskedReservImage(reservObjectURL); // Blob URL로 미리보기 표시
        setMaskedReservFile(maskedReservFile); // File 객체로 저장 (나중에 서버에 전송 가능)
      }

      if (responseData.masked_seat_image) {
        const maskedSeatBlob = base64ToBlob(
          responseData.masked_seat_image,
          "image/jpeg"
        );
        console.log("MaskedSeatBlob:", maskedSeatBlob); // Blob 확인

        const seatObjectURL = URL.createObjectURL(maskedSeatBlob);
        console.log("SeatObjectURL:", seatObjectURL); // Blob URL 확인

        // Blob → File 변환
        const maskedSeatFile = new File(
          [maskedSeatBlob],
          "masked_seat_image.jpg",
          {
            type: "image/jpeg",
          }
        );
        console.log("MaskedSeatFile (converted from Blob):", maskedSeatFile); // File 확인

        // Blob URL 및 File 객체 저장
        setMaskedSeatImage(seatObjectURL); // Blob URL로 미리보기 표시
        setMaskedSeatFile(maskedSeatFile); // File 객체로 저장 (나중에 서버에 전송 가능)
      }

      setPerformanceName(performanceName || "");
      setLastFourDigits(responseData.lastFourDigits || "");
      setSelectedDate(selectedDate);
      setSelectedHour(selectedHour % 12);
      setSelectedMin(selectedMin);
      setSelectedAmPm(selectedAmPm);
      setSelectedSite(selectedSite);
      setSeatInfo(responseData.seat_number || "");
      setCastingInfo(responseData.cast_info || "");
      setPrice(responseData.total_amount || "");
      setDiscountInfo(responseData.price_grade || "");
      setShowAdditionalFields(true);
      setPlace(responseData.place || "");
      setReservationStatus(responseData.reservation_status || "");
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("파일 업로드에 실패했습니다.");
    } finally {
      // ---------------------
      // 추가: 로딩 종료
      // ---------------------
      setLoading(false);
    }
  };
  // Base64 → Blob 변환 함수
  const base64ToBlob = (base64, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(base64.split(",")[1]); // Base64 데이터 디코딩
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: contentType });
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!termsAccepted) {
      alert("약관에 동의해야 등록을 완료할 수 있습니다.");
      setLoading(false);
      return;
    }
    try {
      // Input validation
      if (!performanceName || performanceName.toString().trim() === "") {
        alert("공연 이름을 입력해주세요.");
        setLoading(false);
        return;
      }
      if (!selectedDate) {
        alert("날짜를 선택해주세요.");
        setLoading(false);
        return;
      }
      if (!seatInfo || seatInfo.toString().trim() === "") {
        alert("좌석 정보를 입력해주세요.");
        setLoading(false);
        return;
      }
      if (!price || isNaN(price.replace(/,/g, ""))) {
        alert("가격을 입력해주세요. '원' 단위는 제외해주세요 (예: 172000).");
        setLoading(false);
        return;
      }
      if (!castingInfo || castingInfo.toString().trim() === "") {
        alert("캐스팅 정보를 입력해주세요.");
        setLoading(false);
        return;
      }
      if (!reservFile) {
        alert("예매내역서를 첨부해주세요.");
        setLoading(false);
        return;
      }
      if (!seatFile) {
        alert("좌석 사진을 첨부해주세요.");
        setLoading(false);
        return;
      }
      if (!maskedSeatFile) {
        alert("가려진 좌석 사진을 첨부해주세요.");
        setLoading(false);
        return;
      }
      if (!maskedReservFile) {
        alert("예매번호가 가려진 예매내역서를 첨부해주세요.");
        setLoading(false);
        return;
      }

      if (!reservationStatus) {
        alert("예매 상태를 입력해주세요.");
        setLoading(false);
        return;
      }
      if (!place) {
        alert("공연 장소를 입력해주세요.");
        setLoading(false);
        return;
      }
      if (
        !lastFourDigits ||
        lastFourDigits.length !== 4 ||
        isNaN(lastFourDigits)
      ) {
        setLoading(false);
        alert("전화번호 마지막 4자리를 올바르게 입력해주세요.");
        return;
      }

      // Prepare formData
      const formData = new FormData();

      const formattedDate = selectedDate.toISOString().split("T")[0];
      const formattedPrice = price.replace(/,/g, ""); // Remove commas from the price

      formData.append("title", performanceName);
      formData.append("date", formattedDate);
      formData.append("seat", seatInfo);
      formData.append("price", formattedPrice);
      formData.append("casting", castingInfo);
      formData.append("booking_page", selectedSite ? selectedSite.value : "");
      formData.append("booking_details", discountInfo || ""); // Default to empty string if no discount info provided
      formData.append("reservImage", reservFile);
      formData.append("seatImage", seatFile);
      formData.append("phone_last_digits", lastFourDigits);
      formData.append("place", place);
      formData.append("reservationStatus", reservationStatus);
      formData.append("maskedReservImage", maskedReservFile);
      formData.append("maskedSeatImage", maskedSeatFile);

      // Submit formData
      const response = await createTicket(formData, dispatch);

      console.log("Ticket created successfully:", response);

      // Display success message
      alert("티켓 등록이 완료되었습니다.");
      setLoading(false);

      // Clear local storage and reset form
      localStorage.removeItem("ticketFormData");
      const ticketId = response.ticket.id;
      navigate(`/main/new/${ticketId}`);
    } catch (error) {
      console.error("Error submitting the form:", error);

      // Extract error details from the server response, if available
      const errorDetails = error.response?.data?.errors || {};
      const errorMessages = Object.entries(errorDetails)
        .map(([field, message]) => `${field}: ${message}`)
        .join("\n");

      const alertMessage = error.response?.data?.detail
        ? `${errorMessages}`
        : "알 수 없는 오류가 발생했습니다. 다시 시도해주세요.";

      // Show error alert
      alert(alertMessage);
    }
  };

  const ticketId = useSelector((state) => state.ticket.ticketId);

  const handlePublishToX = async () => {
    const tweetContent = (() => {
      let formattedDate = selectedDate
        ? `${selectedDate.getFullYear()}.${String(
            selectedDate.getMonth() + 1
          ).padStart(2, "0")}.${String(selectedDate.getDate()).padStart(
            2,
            "0"
          )}`
        : "날짜 정보 없음";
      let formattedTime =
        selectedHour !== null && selectedMin !== null
          ? `${String(selectedHour).padStart(2, "0")}:${String(
              selectedMin
            ).padStart(2, "0")}`
          : "시간 정보 없음";
      const ticketUrl = ticketId
        ? `https://yeonmumarket-frontend.fly.dev/chat/join/${ticketId}`
        : "URL 없음";

      return `${performanceName || "공연 이름 없음"} 양도 \n${
        place || "공연 장소 없음"
      } \n${formattedDate} ${selectedAmPm || ""} ${formattedTime}\n캐스팅: ${
        castingInfo || "캐스팅 정보 없음"
      }\n가격: ${price || "가격 정보 없음"}\n좌석 정보: ${
        seatInfo || "좌석 정보 없음"
      }\n<연뮤마켓> 통해서 안전 거래\n${ticketUrl}`;
    })();

    if (!ticketId) {
      alert(
        "ticket_id가 설정되지 않았습니다. 티켓을 생성한 후 게시를 시도하세요."
      );
      return;
    }

    try {
      const response = await postTweet(tweetContent);
      alert("트윗이 성공적으로 게시되었습니다.");
    } catch (error) {
      console.error("트윗 게시 중 오류가 발생했습니다: ", error);
      alert("트윗 게시 중 오류가 발생했습니다.");
    }
  };

  const handleCopyUrl = () => {
    if (!ticketId) {
      alert(
        "ticket_id가 설정되지 않았습니다. 티켓을 생성한 후 URL을 복사하세요."
      );
      return;
    }

    const ticketUrl = `https://yeonmumarket-frontend.fly.dev/chat/join/${ticketId}`;
    navigator.clipboard
      .writeText(ticketUrl)
      .then(() => {
        alert("URL이 클립보드에 복사되었습니다!");
      })
      .catch((err) => {
        console.error("URL 복사 실패: ", err);
        alert("URL 복사에 실패했습니다. 다시 시도해주세요.");
      });
  };
  const handleDownloadMaskedSeatImage = async () => {
    try {
      await downloadImage(maskedSeatImageUrl);
      console.log("Image download triggered successfully");
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };
  const handleTempCancel = () => {
    localStorage.removeItem("ticketFormData"); // 임시저장 데이터 삭제
    setPerformanceName(null);
    setReservImage(null);
    setSeatImage(null);
    setReservFile(null);
    setSeatFile(null);
    setSelectedSite(null);
    setSelectedDate(null);
    setSelectedHour(null);
    setSelectedMin(null);
    setSelectedAmPm(null);
    setTermsAccepted(false);
    setShowAdditionalFields(false);
    setSeatInfo(false);
    setCastingInfo(false);
    setPrice(false);
    setDiscountInfo(false);
    setLastFourDigits("");
    setIsPromoViewVisible(false);
    setReservationStatus(null);
    setPlace(null);
    setMaskedReservImage(null);
    setMaskedSeatImage(null);
    setMaskedReservFile(null);
    setMaskedSeatFile(null);
    alert("임시저장이 취소되었습니다."); // 알림 표시
  };

  return (
     <div className="min-h-main-menu-height rounded-md mt-2 mx-2 flex flex-col">
      {loading && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          {/* 간단한 Tailwind 스피너 예시 */}
          <div className="w-12 h-12 border-4 border-white border-t-transparent border-t-4 rounded-full animate-spin"></div>
        </div>
      )}
      {!isPromoViewVisible ? (
        <form className="flex flex-col rounded-md w-full p-4 overflow-y-auto max-h-main-menu-height">
          <h1>양도글 작성</h1>
          <h3 className="text-gray-500 mb-6">
            양도할 티켓의 정보를 입력해주세요.
          </h3>

          <label className="block mb-2 font-bold">공연 이름</label>
          <input
            type="text"
            placeholder="공연 이름"
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
              menuPlacement="auto"
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
              <div className="mb-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md shadow-md">
                  <h3 className="text-gray-800 text-lg font-semibold flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-yellow-400 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                      />
                    </svg>
                    사진이 잘 가려졌는지 확인해주세요. 가려지지 않은 경우 직접
                    파일을 지워서 넣어주세요.
                  </h3>
                </div>
                <label className="block mb-2 font-bold">
                  가려진 예매내역서
                </label>
                <div className="upload-container">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMaskedReservUpload}
                    style={{ display: "none" }}
                    id="upload3"
                  />
                  <label
                    htmlFor="upload3"
                    className="cursor-pointer upload-box"
                  >
                    {maskedReservImage && (
                      <img
                        src={maskedReservImage}
                        alt="예매내역서"
                        className="max-h-[230px] max-w-[230px] object-cover"
                      />
                    )}
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-bold">가려진 좌석 사진</label>
                <div className="upload-container">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMaskedSeatUpload}
                    style={{ display: "none" }}
                    id="upload4"
                  />
                  <label
                    htmlFor="upload4"
                    className="cursor-pointer upload-box"
                  >
                    {maskedSeatImage && (
                      <img
                        src={maskedSeatImage}
                        alt="좌석 사진"
                        className="max-h-[230px] max-w-[230px] object-cover"
                      />
                    )}
                  </label>
                </div>
              </div>
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
              <label className="block mb-2 font-bold">예매상태</label>
              <input
                type="text"
                value={reservationStatus}
                onChange={(e) => setReservationStatus(e.target.value)}
                placeholder="Value"
                className="border p-2 mb-4 rounded-md"
              />
              <label className="block mb-2 font-bold">장소</label>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
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
              <div className="flex justify-around mt-6 space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                  onClick={handleTempSave}
                >
                  임시저장
                </button>
                <button
                  type="button"
                  className="px-6 py-2 text-sm font-medium text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all"
                  onClick={handleTempCancel}
                >
                  임시저장 취소
                </button>
                <button
                  type="button"
                  className="px-6 py-2 text-sm font-medium text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
                  onClick={handleSubmit}
                >
                  작성 완료
                </button>
              </div>
            </>
          )}
        </form>
      ) : (
        <div className="max-w-lg border-2 border-gray-300 rounded-md mx-5 mt-4">
          <form
            className="flex flex-col w-full p-4 overflow-y-auto max-h-main-menu-height"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col justify-center min-h-main-menu-height w-full p-8">
              <h3 className="py-2 font-bold">홍보글 작성(선택)</h3>
              {maskedSeatImageUrl && (
                <div className="mb-4">
                  <img
                    src={maskedSeatImageUrl}
                    alt="마스킹된 좌석 이미지"
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
                className="border p-2 mb-4 rounded-md w-full h-160"
                style={{ resize: "none", overflowY: "hidden" }}
                defaultValue={(() => {
                  const formattedDate = selectedDate
                    ? `${selectedDate.getFullYear()}.${String(
                        selectedDate.getMonth() + 1
                      ).padStart(2, "0")}.${String(
                        selectedDate.getDate()
                      ).padStart(2, "0")}`
                    : "날짜 정보 없음";

                  const formattedTime =
                    selectedHour !== null && selectedMin !== null
                      ? `${String(selectedHour).padStart(2, "0")}:${String(
                          selectedMin
                        ).padStart(2, "0")}`
                      : "시간 정보 없음";

                  const text = `${performanceName || "공연 이름 없음"} 양도
${formattedDate} ${selectedAmPm || ""} ${formattedTime}
캐스팅: ${castingInfo || "캐스팅 정보 없음"}
가격: ${price || "가격 정보 없음"}
좌석 정보: ${seatInfo || "좌석 정보 없음"}
<연뮤마켓> 통해서 안전 거래`;

                  return text.trim(); // 앞뒤 공백 제거
                })()}
              />
              <div className="flex w-full justify-around items-center gap-2 pb-24">
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
                  onClick={handleCopyUrl}
                >
                  URL 복사
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
