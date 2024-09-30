import React from "react"
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"

export const Header = () => {
  return (
    <div className="w-full max-w-main-frame h-header-height flex flex-row items-center justify-start px-4 py-3 z-[999] top-0 left-0 right-0 mx-auto">
      <Link
        to='/'
        className="text-xl font-bold py-[17px]"
      >
        <img
          src={logo}
          alt="연뮤마켓"
          className="h-[60px]"
        />
      </Link>
    </div>
  )
}