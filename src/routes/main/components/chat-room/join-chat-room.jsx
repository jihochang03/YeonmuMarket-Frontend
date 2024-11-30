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
      const response = await joinConversation(ticket_id);
      if (response.redirect_url) {
        // Redirect to the provided URL
        window.location.href = response.redirect_url;
        return;
      }
      const ticket_Id = response.ticket_id;
      navigate(`/chat/${ticket_Id}`);
    } catch (error) {
      console.error(`Error joining conversation:`, error);

      if (error.response && error.response.status === 401) {
        // 인증되지 않은 경우 로그인 페이지로 리다이렉트
        // Redux 상태 초기화
        dispatch(logout());
        // 로그인 페이지로 리다이렉트하면서 redirect 파라미터 전달
        navigate(`/?redirect=/chat/${ticket_id}/join`);
      } else {
        // 다른 에러의 경우 에러 메시지 표시 및 이전 페이지로 이동
        alert(error.response?.data?.detail || "An error occurred.");
        navigate(-1);
      }
    }
  };

  useEffect(() => {
    // Show the join button instead of automatically joining
    setShowJoinButton(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold mb-4">대화방에 참여하시겠습니까?</h1>
      {showJoinButton && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={handleJoinChat}
        >
          대화방 참여
        </button>
      )}
    </div>
  );
};

export default JoinChatRoom;
