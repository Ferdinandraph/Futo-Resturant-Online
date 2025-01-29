import React from 'react';

const MessageModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-2xl font-semibold mb-4">Notification</h3>
        <p className="text-lg text-gray-700">{message}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
