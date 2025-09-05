import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

export default function SuccessMessage({ message, onClose }) {
  return (
    <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center justify-between">
      <div className="flex items-center">
        <FaCheckCircle className="text-green-600 mr-2" />
        <p className="text-sm text-green-600">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-green-600 hover:text-green-800 ml-2"
        >
          ×
        </button>
      )}
    </div>
  );
}
