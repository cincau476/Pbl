// src/components/SalesByHourChart.jsx

import React from 'react';

const SalesByHourChart = ({ data }) => {
  // Find the maximum number of orders to calculate bar widths proportionally
  const maxOrders = Math.max(...data.map(item => item.orders));

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <h3 className="font-bold text-lg text-gray-800 mb-4">Sales by Hour</h3>
      <div className="space-y-4">
        {data.map(item => (
          <div key={item.hour} className="flex items-center gap-4 text-sm">
            <span className="w-12 text-gray-500">{item.hour}:00</span>
            <div className="flex-1 bg-gray-200 rounded-full h-6">
              <div
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-6 rounded-full"
                style={{ width: `${(item.orders / maxOrders) * 100}%` }}
              ></div>
            </div>
            <span className="w-20 text-right font-semibold text-gray-700">{item.orders} orders</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesByHourChart;