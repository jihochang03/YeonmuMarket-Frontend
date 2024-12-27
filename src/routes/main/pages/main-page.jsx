import React from "react";
import { Route, Routes } from "react-router-dom";
import { MainSection } from "../components/main-section";
import { Introducement } from "../../../components/introduce-section";
import { MainIndex } from "../../../components/main-index";
import { TicketForm } from "../components/ticket-form/ticket-form";
//import { PromoForm } from "../components/ticket-form/promo-form";
import { SoldTickets } from "../components/sold-tickets/sold-tickets";
import { PurchasedTickets } from "../components/purchased-tickets/purchased-tickets";
import { ProfileSettings } from "../components/profile-settings/profile-settings";

const MainPage = () => {
  return (
    <div className="w-full h-[calc(100vh)] flex justify-center items-center">
      <div className="w-main-frame h-[calc(100vh)] flex flex-col pt-header-height">
        <MainIndex />
        <div className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route
              path="/"
              element={
                <div className="w-full h-[calc(100vh)] flex flex-col">
                  <div className="w-main-frame h-main-menu-height flex flex-col justify-center items-start gap-12">
                    <Introducement />
                    <MainSection />
                  </div>
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
