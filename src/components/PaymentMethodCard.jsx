// src/components/PaymentMethodCard.jsx

import React from 'react';

const PaymentMethodCard = ({ icon, title, description, stats, highlight }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-orange-500">{icon}</div>
        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
      </div>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      
      {stats.map((stat, index) => (
        <div key={index} className="flex justify-between items-center text-sm mb-2">
          <p className="text-gray-600">{stat.label}</p>
          <span className={`font-semibold ${stat.label === 'Status' ? 'text-green-600' : 'text-gray-800'}`}>{stat.value}</span>
        </div>
      ))}

      {highlight && (
        <div className="mt-4 pt-4 border-t border-dashed flex justify-between items-center">
            <div>
                <p className="text-sm text-gray-500">{highlight.label}</p>
                <p className="font-bold text-lg text-orange-500">{highlight.value}</p>
            </div>
            <span className="text-xs font-semibold bg-orange-100 text-orange-600 px-2 py-1 rounded-full">{highlight.badge}</span>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodCard;