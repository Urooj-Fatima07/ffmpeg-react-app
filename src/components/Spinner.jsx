// src/components/Spinner.jsx
import React from 'react';

const Spinner = () => (
  <div className="flex justify-center items-center">
    <svg
      className="w-8 h-8 text-gray-600 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" />
      <path
        d="M4.93 4.93a10 10 0 0 1 14.14 0M19.07 19.07a10 10 0 0 1-14.14 0"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export default Spinner;
