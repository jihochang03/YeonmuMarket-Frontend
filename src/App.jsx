// src/App.js

import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/header.jsx";
import LoginPage from "./routes/login/pages/login-page.jsx";
import MainPage from "./routes/main/pages/main-page.jsx";
import TermsPage from "./routes/terms/pages/terms-page.jsx";
import Auth from "./routes/login/pages/auth.jsx";
import AccountAuthPage from "./routes/account-auth/pages/account-auth-page.jsx";
import { useSelector } from "react-redux";
import JoinChatRoom from "./routes/main/components/chat-room/join-chat-room.jsx";
import ChatRoom from "./routes/main/components/chat-room/chat-room.jsx";
import ProtectedRoute from "./components/protectroute.jsx"; // ProtectedRoute 임포트
import FetchCSRFToken from "./components/fetchcsrftoken.jsx"; // FetchCSRFToken 컴포넌트 임포트
import AccountEditPage from './routes/account-auth/pages/account-edit-page.jsx';
function App() {
  const isLogin = useSelector((state) => state.user.isLogin);

  return (
    <div className="min-h-screen bg-darker flex flex-col items-center">
      <BrowserRouter>
        <FetchCSRFToken /> {/* CSRF 토큰 초기화를 위한 컴포넌트 */}
        <div className="w-main-frame bg-white">
          <Header isLogin={isLogin} />
          <div className="flex flex-col">
            <div className="flex-1">
              <Routes>
                {/* 로그인 페이지는 누구나 접근 가능 */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/account-auth" element={<AccountAuthPage />} />

                {/* 인증이 필요한 라우트는 ProtectedRoute로 감싸줍니다 */}
                <Route
                  path="/main/*"
                  element={
                    <ProtectedRoute>
                      <MainPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat/join/:ticket_id"
                  element={
                    <ProtectedRoute>
                      <JoinChatRoom />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat/:ticket_id"
                  element={
                    <ProtectedRoute>
                      <ChatRoom />
                    </ProtectedRoute>
                  }
                />
                <Route path="/account-edit" element={<AccountEditPage />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
