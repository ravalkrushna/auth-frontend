type ModalProps = {
    title: string,
    message:string,
    buttonText: string,
    onClose: () => void;
};

function Modal({ title, message, buttonText, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fadeIn">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {title}
        </h2>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <button
          onClick={onClose}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default Modal;