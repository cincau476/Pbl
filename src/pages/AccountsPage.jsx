// src/pages/AccountsPage.jsx

import React from 'react';
import { FiSearch, FiPlus, FiBell, FiUser } from 'react-icons/fi';
import UserTable from '../components/UserTable.jsx'; // Impor komponen baru
import SummaryCard from '../components/SummaryCard.jsx'; // Impor komponen baru

// Data dummy sekarang berada di level halaman
const users = [
  { name: 'Admin User', role: 'Admin', email: 'admin@orderin.app', phone: '+62 812-3456-7890' },
  { name: 'Seller A', role: 'Seller', email: 'sellera@orderin.app', phone: '+62 813-4567-8901' },
  { name: 'Seller B', role: 'Seller', email: 'sellerb@orderin.app', phone: '+62 814-5678-9012' },
  { name: 'Cashier 1', role: 'Cashier', email: 'cashier1@orderin.app', phone: '+62 815-6789-0123' },
  { name: 'Cashier 2', role: 'Cashier', email: 'cashier2@orderin.app', phone: '+62 816-7890-1234' },
];

const AccountsPage = () => {
  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* === HEADER HALAMAN === */}
      <header className="bg-white p-4 border-b border-gray-200 h-18 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">
          Accounts
        </h1>
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

      {/* === KONTEN UTAMA (BISA DI-SCROLL) === */}
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        
        {/* --- Bilah Aksi: Search & Tombol --- */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-1/3">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="text-gray-400" />
            </span>
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors">
            <FiPlus size={20} />
            Add New User
          </button>
        </div>

        {/* Panggil komponen UserTable */}
        <UserTable users={users} />

        {/* Panggil komponen SummaryCard berulang kali */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard 
            title="Admins" 
            count="1" 
            description="Full system access"
            borderColor="border-blue-500" 
          />
          <SummaryCard 
            title="Sellers" 
            count="2" 
            description="Manage stands & menus"
            borderColor="border-orange-500" 
          />
          <SummaryCard 
            title="Cashiers" 
            count="2" 
            description="Process payments"
            borderColor="border-green-500" 
          />
        </div>
      </main>
    </div>
  );
};

export default AccountsPage;