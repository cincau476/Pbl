// src/components/RecentOrders.jsx

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
// Menerima 'orders' sebagai prop
const RecentOrders = ({ orders }) => {
  
  // Ambil 4 order terbaru saja
  const ordersToShow = orders.slice(0, 4);
  // --- AKHIR PERUBAHAN ---

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h3 className="font-bold text-lg text-gray-800 mb-4">Recent Orders</h3>
      <div className="space-y-4">
        {/* --- PERUBAHAN --- */}
        {/* Ganti 'orders.map' menjadi 'ordersToShow.map' */}
        {ordersToShow.map((order) => {
          // Logika untuk status
          const isPaid = !['AWAITING_PAYMENT', 'CANCELLED', 'EXPIRED'].includes(order.status);
          // Logika untuk detail
          const details = order.table 
            ? `Table ${order.table.code} • Dine-in` 
            : 'Takeaway';

          return (
            <div key={order.uuid} className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-600 text-sm mr-4">
                  {/* Ambil 2 digit terakhir dari reference code */}
                  {order.references_code.slice(-2)}
                </div>
                <div>
                  <p className="font-semibold text-gray-700">{order.tenant.name}</p>
                  <p className="text-xs text-gray-500">{details}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-700">{formatCurrency(order.total)}</p>
                {isPaid ? (
                  <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">Paid</span>
                ) : (
                  <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Pending</span>
                )}
              </div>
            </div>
          )
        })}
        {/* --- AKHIR PERUBAHAN --- */}
      </div>
    </div>
  );
};

export default RecentOrders;