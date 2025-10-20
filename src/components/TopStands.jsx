// src/components/TopStands.jsx

import React from 'react';

// Helper untuk format mata uang
const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        minimumFractionDigits: 0 
    }).format(value);
}

// --- PERUBAHAN ---
// Menerima 'stands' sebagai prop
const TopStands = ({ stands }) => {
  // --- AKHIR PERUBAHAN ---

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h3 className="font-bold text-lg text-gray-800 mb-4">Top Performing Stands</h3>
      <div className="space-y-4">
        {/* --- PERUBAHAN --- */}
        {/* Map 'stands' dari props */}
        {stands.map((stand, index) => (
          <div key={stand.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 flex-shrink-0 mr-4 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                {index + 1}
              </div>
              <div>
                <p className="font-semibold text-gray-700">{stand.name}</p>
                <p className="text-xs text-gray-500">{stand.orders} orders today</p>
              </div>
            </div>
            <p className="font-semibold text-gray-800">{formatCurrency(stand.revenue || 0)}</p>
          </div>
        ))}
        {/* --- AKHIR PERUBAHAN --- */}
      </div>
    </div>
  );
};

export default TopStands;