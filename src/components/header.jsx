import React from "react"
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div className="w-full flex flex-row items-center justify-between h-[80px] px-[68px] z-[999]">
      <Link
        to='/'
        className="text-xl font-bold px-10 py-[17px]"
      >
        연뮤마켓
      </Link>
      <Link
        to='login'
        className="text-xl font-bold px-10 py-[17px]"
      >
        로그인
      </Link>
    </div>
  )
}