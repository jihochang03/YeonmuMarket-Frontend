import { useState } from 'react';
import { MainSection } from '../components/main-section';
import { Introducement } from '../../../components/introduce-section';
import { MainIndex } from '../../../components/main-index';
import { TicketForm } from '../components/ticket-form';
import { SoldTickets } from '../components/sold-tickets';
import { PurchasedTickets } from '../components/purchased-tickets';
import { ProfileSettings } from '../components/profile-settings';

const MainPage = ({ selectedMenu, setSelectedMenu }) => {
  const renderContent = () => {
    switch (selectedMenu) {
      case '양도글 작성':
        return <TicketForm />;
      case '판매한 티켓':
        return <SoldTickets />;
      case '구매한 티켓':
        return <PurchasedTickets />;
      case '설정':
        return <ProfileSettings />;
      default:
        return (
          <div className="w-full h-main-height flex flex-col items-center">
            <div className="w-main-frame max-h-main-height flex flex-col justify-center items-start gap-12 pt-32">
              <Introducement />
              <MainSection />
            </div>
          </div>
        ); 
    }
  };

  return (
    <div className="w-full h-main-height flex justify-center items-center">
      <div className="w-main-frame h-main-height flex flex-col fixed">
        <MainIndex setSelectedMenu={setSelectedMenu} selectedMenu={selectedMenu}/>
        <div className="flex-1 p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  )
};

export default MainPage;