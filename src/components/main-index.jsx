export const MainIndex = ({ setSelectedMenu, selectedMenu }) => {
  return (
    <div className="flex justify-around w-full p-1">
      <button
        onClick={() => setSelectedMenu('양도글 작성')}
        className={selectedMenu === '양도글 작성' ? 'bg-selected-menu' : ''}
      >
        양도글 작성
      </button>
      <button
        onClick={() => setSelectedMenu('판매한 티켓')}
        className={selectedMenu === '판매한 티켓' ? 'bg-selected-menu' : ''}
      >
        판매한 티켓
      </button>
      <button
        onClick={() => setSelectedMenu('구매한 티켓')}
        className={selectedMenu === '구매한 티켓' ? 'bg-selected-menu' : ''}
      >
        구매한 티켓
      </button>
      <button
        onClick={() => setSelectedMenu('설정')}
        className={selectedMenu === '설정' ? 'bg-selected-menu' : ''}
      >
        설정
      </button>
    </div>
  );
};
