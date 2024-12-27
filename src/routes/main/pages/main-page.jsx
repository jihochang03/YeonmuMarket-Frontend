import React from "react";
import { Route, Routes } from "react-router-dom";
import { MainSection } from "../components/main-section";
import { Introducement } from "../../../components/introduce-section";
import { MainIndex } from "../../../components/main-index";
import { TicketForm } from "../components/ticket-form/ticket-form";
import { SoldTickets } from "../components/sold-tickets/sold-tickets";
import { PurchasedTickets } from "../components/purchased-tickets/purchased-tickets";
import { ProfileSettings } from "../components/profile-settings/profile-settings";

const MainPage = () => {
  return (
    <div className="w-full h-full flex justify-center items-center bg-gray-100">
      {/* 메인 컨테이너 */}
      <div className="w-full max-w-screen-xl h-full flex flex-col md:flex-row bg-white shadow-lg rounded-md">
        {/* 좌측 고정된 메뉴 (MainIndex) */}
        <div className="w-full md:w-1/4 h-auto md:h-full bg-gray-200">
          <MainIndex />
        </div>
        {/* 우측 콘텐츠 */}
        <div className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route
              path="/"
              element={
                <div className="w-full h-full flex flex-col gap-6">
                  <Introducement />
                  <MainSection />
                </div>
              }
            />
            <Route path="new" element={<TicketForm />} />
            <Route path="sold" element={<SoldTickets />} />
            <Route path="purchased" element={<PurchasedTickets />} />
            <Route path="settings" element={<ProfileSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
