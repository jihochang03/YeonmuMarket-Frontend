import React from "react"
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"
import profileIcon from "../assets/icons/profile.png";

export const Header = ({ isLoggedIn , setSelectedMenu }) => {
  const handleLogoClick = () => {
    setSelectedMenu('');
  };
  return (
    <div className="w-full max-w-main-frame h-header-height flex flex-row items-center justify-between px-4 py-3 z-[999] top-0 left-0 right-0 mx-auto">
      <Link
        to={isLoggedIn ? '/main' : '/'}
        className="text-xl font-bold py-[17px]"
        onClick={handleLogoClick}
      >
        <img
          src={logo}
          alt="연뮤마켓"
          className="h-[60px]"
        />
      </Link>
      {isLoggedIn && (
        <img
          src={profileIcon}
          alt="프로필"
          className="h-[35px] w-[35px] mx-5 mt-3"
        />
      )}
    </div>
  )
}