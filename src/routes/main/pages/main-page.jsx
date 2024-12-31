import React from "react";
import { Route, Routes } from "react-router-dom";
import { MainSection } from "../components/main-section";
import { Introducement } from "../../../components/introduce-section";
import { MainIndex } from "../../../components/main-index";
import { TicketForm } from "../components/ticket-form/ticket-form";
import { SoldTickets } from "../components/sold-tickets/sold-tickets";
import { PurchasedTickets } from "../components/purchased-tickets/purchased-tickets";
import { ExchangeTickets } from "../components/exchange-tickets/exchange-tickets";
import { ProfileSettings } from "../components/profile-settings/profile-settings";

const MainPage = () => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="w-main-frame h-screen flex flex-col fixed">
        <MainIndex />
        <div className="flex-1 p-4s">
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
            <Route path="exchange" element={<ExchangeTickets />} />
            <Route path="settings" element={<ProfileSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
