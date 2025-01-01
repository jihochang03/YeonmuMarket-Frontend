import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { joinExchange } from "../../../../apis/api";
import { useDispatch } from "react-redux";
import { logout } from "../../../../redux/user-slice";

const JoinChatRoom = () => {
  const { ticket_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // redirectUrl 상태 추가
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [showJoinButton, setShowJoinButton] = useState(false);

  // (추가) 사용자 티켓 번호 입력 상태
  const [myTicketNumber, setMyTicketNumber] = useState("");

  const handleJoinChat = async () => {
    // (추가) 간단한 유효성 체크
    if (!myTicketNumber.trim()) {
      alert("자신의 티켓 번호를 입력하세요.");
      return;
    }

    try {
      console.log("Attempting to join exchange with ticket_id:", ticket_id);
      // (추가) 내 티켓 번호를 서버에 전달 (joinExchange 함수에 맞춰 수정)
      const response = await joinExchange(ticket_id, {
        my_ticket_number: myTicketNumber,
      });
      console.log("Response from joinExchange:", response);

      console.log("Navigating to exchange room with ticket_Id:", ticket_id);
      window.location.href = response.redirect_url;
    } catch (error) {
      console.error("Error joining conversation:", error);

      if (error.response && error.response.status === 401) {
        console.warn("Unauthorized access detected. Redirecting to login.");

        // Redux 상태 초기화
        dispatch(logout());

        // redirectUrl 상태 저장
        const redirectPath = `/exchange/join/${ticket_id}`;
        setRedirectUrl(redirectPath);
        console.log("Setting redirectUrl:", redirectPath);

        // 로그인 페이지로 이동
        navigate(`/?redirect=${encodeURIComponent(redirectPath)}`);
      } else {
        console.error(
          "Unhandled error occurred. Navigating back to previous page."
        );
        alert(error.response?.data?.detail || "An error occurred.");
        navigate(-1);
      }
    }
  };

  // 컴포넌트가 다시 마운트되었을 때 상태 초기화
  useEffect(() => {
    console.log("JoinChatRoom mounted with ticket_id:", ticket_id);
    setShowJoinButton(true);

    // 리다이렉트 후 상태 초기화
    if (redirectUrl) {
      console.log("Resetting redirectUrl after redirect");
      setRedirectUrl(null);
    }
  }, [ticket_id, redirectUrl]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold mb-4">대화방에 참여하시겠습니까?</h1>

      {/* (추가) 내 티켓 번호 입력란 */}
      <div className="mb-4">
        <label htmlFor="myTicketNumber" className="block mb-1 font-medium">
          내 티켓 번호
        </label>
        <input
          id="myTicketNumber"
          type="text"
          value={myTicketNumber}
          onChange={(e) => setMyTicketNumber(e.target.value)}
          placeholder="티켓 번호를 입력하세요"
          className="border rounded-md px-3 py-2"
        />
      </div>

      {showJoinButton && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-6"
          onClick={handleJoinChat}
        >
          대화방 참여
        </button>
      )}
    </div>
  );
};

export default JoinChatRoom;
