// src/pages/OrdersPage.jsx

import React from 'react';
import { FiBell, FiUser, FiPackage, FiClock, FiCheckCircle, FiLoader } from 'react-icons/fi';
import OrderStatCard from '../components/OrderStatCard.jsx';
import RecentOrderItem from '../components/RecentOrderItem.jsx';

// Data Dummy
const recentOrders = [
  { 
    id: 'ORD-1234', 
    status: { text: 'Pending Payment', type: 'pending' },
    table: 'Table A12',
    standName: 'Warung Pecah Sebelah',
    items: ['Ayam Kawin x2', 'Es Teh Manis x2'],
    time: '10 mins ago',
    total: 90000 
  },
  { 
    id: 'ORD-1235', 
    status: { text: 'Paid', type: 'paid' },
    table: 'Table B05',
    standName: 'Noodle House',
    items: ['Mie Ayam x1'],
    time: '12 mins ago',
    total: 25000 
  },
];

const OrdersPage = () => {
  return (
    <div className="flex-1 flex flex-col h-screen">
      <header className="bg-white p-4 border-b border-gray-200 h-18 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Orders</h1>
        <div className="flex items-center gap-4">
          <button className="relative text-gray-600 hover:text-gray-800">
            <FiBell size={22} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            <FiUser size={22} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        {/* --- Customer Ordering Section --- */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiUser size={20} className="text-blue-600" /> Customer Ordering
          </h2>
          <div className="flex items-center gap-6">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=Example" alt="QR Code" className="w-32 h-32 p-2 border rounded-lg" />
            <div>
              <h3 className="font-bold text-gray-700">Scan to Order</h3>
              <p className="text-sm text-gray-500 max-w-md mt-1 mb-4">Customers can scan this QR code to browse menus and place orders directly from their phones.</p>
              <div className="flex gap-3">
                <button className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-600">Download QR Code</button>
                <button className="bg-gray-100 text-gray-700 font-semibold px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200">View Customer Page</button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Order Stats Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <OrderStatCard icon={<FiPackage size={24}/>} count="48" title="Total Orders" color="blue" />
          <OrderStatCard icon={<FiClock size={24}/>} count="8" title="Pending" color="orange" />
          <OrderStatCard icon={<FiCheckCircle size={24}/>} count="35" title="Completed" color="green" />
          <OrderStatCard icon={<FiLoader size={24}/>} count="5" title="Preparing" color="purple" />
        </div>

        {/* --- Recent Orders Section --- */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <RecentOrderItem key={index} order={order} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;