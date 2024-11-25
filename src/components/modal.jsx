import Info from "../assets/modal-info.png";

const Modal = ({ message, onClose, onConfirm }) => {
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-60">
      <div className="relative bg-white p-3 rounded-md shadow-md max-w-main-frame text-center px-6 border border-gray-800">
        <div className="flex items-center justify-center mb-4">
          <img src={Info} className="w-6 h-6 mr-4" alt="Info icon" />
          <div className="flex-1 text-left mt-2 font-bold">
            {message.split("\n").map((line, index) => (
              <p key={index} className="mb-1">
                {line}
              </p>
            ))}
          </div>
        </div>
        <div className="gap-12 flex justify-center">
          <button
            className="bg-gray-800 text-white mt-3 w-20 py-2 my-1 text-md rounded-md"
            onClick={onConfirm}
          >
            예
          </button>
          <button
            className="bg-gray-800 text-white mt-3 w-20 py-2 my-1 text-md rounded-md"
            onClick={onClose}
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
