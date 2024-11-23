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
    <div className="w-full flex justify-around items-center pt-3 px-5">
      <button
        onClick={() => navigate("/main/new")}
        className={`button ${isActive("/main/new") ? "bg-selected-menu" : ""}`}
      >
        양도글 작성
      </button>
      <button
        onClick={() => navigate("/main/sold")}
        className={`button ${isActive("/main/sold") ? "bg-selected-menu" : ""}`}
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
    </div>
  );
};
