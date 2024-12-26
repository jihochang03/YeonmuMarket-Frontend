import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { joinConversation } from "../../../../apis/api";
import { useDispatch } from "react-redux";
import { logout } from "../../../../redux/user-slice";

const JoinChatRoom = () => {
  const { ticket_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showJoinButton, setShowJoinButton] = useState(false);

  const handleJoinChat = async () => {
    try {
      console.log("Attempting to join chat with ticket_id:", ticket_id);
      const response = await joinConversation(ticket_id);
      console.log("Response from joinConversation:", response);

      console.log("Navigating to chat room with ticket_Id:", ticket_id);
      window.location.href = response.redirect_url;
    } catch (error) {
      console.error("Error joining conversation:", error);

      if (error.response && error.response.status === 401) {
        console.warn("Unauthorized access detected. Redirecting to login.");

        // Redux 상태 초기화
        dispatch(logout());

        // 리다이렉트 경로 생성
        const redirectPath = `/?redirect=/chat/join/${ticket_id}`;
        console.log("Redirecting to login with redirectPath:", redirectPath);

        // 로그인 페이지로 이동
        navigate(redirectPath);
      } else {
        console.error(
          "Unhandled error occurred. Navigating back to previous page."
        );
        alert(error.response?.data?.detail || "An error occurred.");
        navigate(-1);
      }
    }
  };

  useEffect(() => {
    console.log("JoinChatRoom mounted with ticket_id:", ticket_id);
    setShowJoinButton(true);
  }, [ticket_id]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold mb-4">대화방에 참여하시겠습니까?</h1>
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
