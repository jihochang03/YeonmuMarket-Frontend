import shakingIcon from "../assets/icons/emoji/shaking.png";
import maskIcon from "../assets/icons/emoji/mask.png";
import ticketIcon from "../assets/icons/emoji/ticket.png";

export const Introducement = () => {
  return (
    <div className="flex flex-col gap-2 px-4 sm:px-10 text-left">
      <div className="flex items-center gap-3">
        <img src={shakingIcon} alt="shaking hands" className="w-8 h-8" />
        <span className="text-lg sm:text-2xl font-semibold">안전한</span>
      </div>
      <div className="flex items-center gap-3">
        <img src={maskIcon} alt="theater mask" className="w-8 h-8" />
        <span className="text-lg sm:text-2xl font-semibold">연극.뮤지컬 전용</span>
      </div>
      <div className="flex items-center gap-3">
        <img src={ticketIcon} alt="ticket" className="w-8 h-8" />
        <span className="text-lg sm:text-2xl font-semibold">티켓 양도 플랫폼</span>
      </div>
    </div>
  );
};
