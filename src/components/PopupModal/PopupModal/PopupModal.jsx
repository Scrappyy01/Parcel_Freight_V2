'use client';

import React, { useState } from "react";
import { useEffect } from "react";

const PopupModal = ({ show, message, error, onClose }) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    }
  }, [show]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 mx-4 max-w-md w-full">
        <div className="text-center">
          {!error && (
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          )}
          <h6 className="text-lg font-semibold mt-3">
            {message}
          </h6>
          {error && (
            <button
              onClick={handleClose}
              className="mt-3 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupModal;

