import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const MainIndex = ({ activeTab }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (activeTab) {
      return activeTab === path;
    }
    return location.pathname === path;
  };

  return (
    <div className="w-full flex flex-col pt-header-height px-5">
      {/* Main content */}
      <div className="w-full max-w-screen-sm flex justify-around items-center pt-0">
        <button
          onClick={() => navigate("/main/new")}
          className={`button ${
            isActive("/main/new") ? "bg-selected-menu" : ""
          }`}
        >
          양도/교환글 작성
        </button>
        <button
          onClick={() => navigate("/main/sold")}
          className={`button ${
            isActive("/main/sold") ? "bg-selected-menu" : ""
          }`}
        >
          양도목록
        </button>
        <button
          onClick={() => navigate("/main/purchased")}
          className={`button ${
            isActive("/main/purchased") ? "bg-selected-menu" : ""
          }`}
        >
          양수목록
        </button>
        <button
          onClick={() => navigate("/main/settings")}
          className={`button ${
            isActive("/main/settings") ? "bg-selected-menu" : ""
          }`}
        >
          설정
        </button>
        <button
          onClick={() => navigate("/main/exchange")}
          className={`button ${
            isActive("/main/exchange") ? "bg-selected-menu" : ""
          }`}
        >
          교환목록
        </button>
      </div>
    </div>
  );
};
