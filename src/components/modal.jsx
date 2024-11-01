import Info from '../assets/modal-info.png';

const Modal = ({ message, onClose, onConfirm }) => (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-60">
    <div className="relative bg-white p-4 rounded-md shadow-md w-full mx-52 text-center border border-gray-800">
      <img src={Info} className='w-6 h-6'/>
      {message.split('\n').map((line, index) => (
        <p key={index} className='mb-1'>{line}</p>
      ))}
      <div className='gap-12 flex justify-center'>
        <button className='bg-gray-800 text-white mt-3 px-5' onClick={onConfirm}>예</button>
        <button className='bg-gray-800 text-white mt-3' onClick={onClose}>아니오</button>
      </div>
    </div>
  </div>
);

export default Modal;