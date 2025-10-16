import React from 'react';

const TopStands = () => {
  const stands = [
    { rank: 1, name: 'Warung Pecah Sebelah', orders: '45 orders today', sales: 'Rp 850,000' },
    { rank: 2, name: 'Ayam Crispy Corner', orders: '32 orders today', sales: 'Rp 650,000' },
    { rank: 3, name: 'Soto Sedap', orders: '28 orders today', sales: 'Rp 540,000' },
    { rank: 4, name: 'Nasi Goreng Pak Budi', orders: '25 orders today', sales: 'Rp 500,000' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h3 className="font-bold text-lg text-gray-800 mb-4">Top Performing Stands</h3>
      <div className="space-y-4">
        {stands.map((stand) => (
          <div key={stand.rank} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 flex-shrink-0 mr-4 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                {stand.rank}
              </div>
              <div>
                <p className="font-semibold text-gray-700">{stand.name}</p>
                <p className="text-xs text-gray-500">{stand.orders}</p>
              </div>
            </div>
            <p className="font-semibold text-gray-800">{stand.sales}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopStands; // <-- TAMBAHKAN BARIS INI