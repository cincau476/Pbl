// src/components/StandPerformanceItem.jsx

import React from 'react';

const StandPerformanceItem = ({ stand }) => {
  const { name, orders, revenue, growth, barPercentage } = stand;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h4 className="font-bold text-gray-800">{name}</h4>
          <p className="text-xs text-gray-500">{orders} orders today</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg text-gray-800">{revenue}</p>
          <p className="text-xs font-semibold text-green-500">{growth}</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-orange-400 h-2 rounded-full"
          style={{ width: `${barPercentage}%`}}
        ></div>
      </div>
    </div>
  );
};

export default StandPerformanceItem;