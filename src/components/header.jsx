import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/logo.png";
import profileIcon from "../assets/icons/profile.png";

export const Header = () => {
  const isLogin = useSelector((state) => state.user.isLogin);

  return (

    <div className="w-full max-w-main-frame h-header-height flex flex-row items-center justify-between px-4 py-3 z-[999] fixed top-0 left-0 right-0 mx-auto">
      <Link
        to={isLogin ? "/main" : "/"}
        className="text-xl font-bold py-[17px]"
      >
        <img src={logo} alt="연뮤마켓" className="h-[60px]" />
      </Link>
      {isLogin && (
        <Link to="/main/settings">
          <img
            src={profileIcon}
            alt="프로필"
            className="h-[35px] w-[35px] mx-5 mt-3 cursor-pointer"
          />
        </Link>
      )}
    </div>
  );
};
