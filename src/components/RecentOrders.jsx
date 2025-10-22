import React from 'react';

const RecentOrders = () => {
  const orders = [
    { id: '#1234', name: 'Warung Pecah Sebelah', details: 'Table 1 • Diner-in', price: 'Rp 45,000', status: 'Paid' },
    { id: '#2234', name: 'Warung Pecah Sebelah', details: 'Takeaway', price: 'Rp 45,000', status: 'Paid' },
    { id: '#3456', name: 'Ayam Crispy Corner', details: 'Table 3 • Diner-in', price: 'Rp 25,000', status: 'Pending' },
    { id: '#4567', name: 'Soto Sedap', details: 'Table 5 • Diner-in', price: 'Rp 18,000', status: 'Paid' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h3 className="font-bold text-lg text-gray-800 mb-4">Recent Orders</h3>
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-600 text-sm mr-4">
                {order.id.slice(1, 3)}
              </div>
              <div>
                <p className="font-semibold text-gray-700">{order.name}</p>
                <p className="text-xs text-gray-500">{order.details}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-700">{order.price}</p>
              {order.status === 'Paid' ? (
                 <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">Paid</span>
              ) : (
                 <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Pending</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;