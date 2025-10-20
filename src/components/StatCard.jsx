// src/components/StatCard.jsx

import React from 'react';

// --- PERUBAHAN ---
// Prop 'change' sekarang opsional
const StatCard = ({ icon, title, value, change, changeColor = 'text-gray-500' }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">{title}</span>
          <span className="text-2xl font-bold text-gray-800 mt-1">{value}</span>
        </div>
        <div className="text-2xl bg-gray-100 p-2 rounded-lg">
          {icon}
        </div>
      </div>
      {/* Tampilkan baris ini hanya jika 'change' ada isinya */}
      {change && (
        <p className={`text-xs mt-2 ${changeColor}`}>{change}</p>
      )}
      {/* --- AKHIR PERUBAHAN --- */}
    </div>
  );
};

export default StatCard;