import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const isLogin = useSelector((state) => state.user.isLogin);
  const location = useLocation(); // 현재 경로 정보

  if (!isLogin) {
    alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
    // 로그인 페이지로 리다이렉트하면서 현재 경로를 redirect 파라미터로 전달
    return (
      <Navigate
        to={`/?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
