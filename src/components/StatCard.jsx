// src/components/StatCard.jsx
import React from 'react';

const StatCard = ({ icon, title, value, change, changeColor, iconBg }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
        {/* PENTING: Di sini kita menggunakan prop 'iconBg' 
           untuk memberi warna latar belakang pada lingkaran ikon.
        */}
        <div className={`p-3 rounded-full flex items-center justify-center shadow-sm ${iconBg || 'bg-gray-100'}`}>
          {icon}
        </div>
      </div>
      
      {change && (
        <div className="mt-4 flex items-center text-xs">
          <span className={`font-medium ${changeColor || 'text-gray-500'}`}>
            {change}
          </span>
          <span className="text-gray-400 ml-2">vs last period</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
