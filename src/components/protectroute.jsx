// src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const isLogin = useSelector((state) => state.user.isLogin);

  if (!isLogin) {
    alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
