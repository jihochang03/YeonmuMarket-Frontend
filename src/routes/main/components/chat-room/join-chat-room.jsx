// src/routes/main/components/chat-room/join-chat-room.jsx

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { joinConversation } from "../../../../apis/api";
import { useDispatch } from "react-redux";
import { logout } from "../../../../redux/user-slice";

const JoinChatRoom = () => {
  const { ticket_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const joinChat = async () => {
      try {
        const response = await joinConversation(ticket_id);
        if (response.redirect_url) {
          // Redirect to the provided URL
          window.location.href = response.redirect_url;
          return;
        }
        const conversationId = response.conversation_id;
        navigate(`/chat/${conversationId}`);
      } catch (error) {
        console.error(`Error joining conversation:`, error);

        if (error.response && error.response.status === 401) {
          // 인증되지 않은 경우 로그인 페이지로 리다이렉트
          alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
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

    joinChat();
  }, [ticket_id, navigate, dispatch]);

  return <div>대화방에 참여 중...</div>;
};

export default JoinChatRoom;
