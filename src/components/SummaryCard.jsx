// src/components/SummaryCard.jsx

import React from 'react';

const SummaryCard = ({ title, count, description, borderColor }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${borderColor}`}>
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 my-1">{count}</p>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
};

export default SummaryCard;