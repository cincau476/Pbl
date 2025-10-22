// src/components/ReportStatCard.jsx

import React from 'react';

const ReportStatCard = ({ icon, value, title, change }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4">
      <div className="text-2xl text-blue-600 bg-blue-100 p-3 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xs text-green-500 mt-1">{change}</p>
      </div>
    </div>
  );
};

export default ReportStatCard;