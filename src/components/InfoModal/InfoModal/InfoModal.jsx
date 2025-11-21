'use client';

import React from "react";

const InfoModal = ({ title, content, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h5 className="text-xl font-semibold">{title}</h5>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="p-4 overflow-y-auto" style={{ maxHeight: "60vh" }}>
          <div
            style={{
              whiteSpace: "pre-wrap",
              fontSize: "14px",
              lineHeight: "1.6",
              paddingRight: "10px",
            }}
          >
            {content}
          </div>
        </div>
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;

