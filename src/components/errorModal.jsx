import Close from '../assets/modal-close.png';
import Info from '../assets/modal-info.png';

const ErrorModal = ({ message, onClose, onRetry }) => (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-60">
    <div className="relative bg-white p-4 rounded-md shadow-md w-full mx-52 text-center border border-gray-800">
      <img src={Info} onClick={onClose} className='w-6 h-6'/>
      {message.split('\n').map((line, index) => (
        <p key={index} className='mb-1'>{line}</p>
      ))}
      <img src={Close} onClick={onClose} className="w-12 h-12 cursor-pointer absolute top-1 right-1"/>
      <button className='bg-gray-800 text-white mt-3' onClick={onRetry}>다시 시도</button>
    </div>
  </div>
);

export default ErrorModal;