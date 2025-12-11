// src/components/Sidebar.jsx

import React, { useState } from 'react';
import { 
  FiGrid, FiUsers, FiShoppingCart, FiCreditCard, 
  FiBarChart2, FiChevronLeft, FiChevronRight, FiLogOut 
} from 'react-icons/fi';
import { MdStorefront } from 'react-icons/md';

import logo from '../assets/logo.png';

const Sidebar = ({ isCollapsed, onToggle, activePage, setActivePage, user, onLogout }) => {
  
  const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', icon: <FiGrid size={28} />, name: 'Dashboard' },
    { id: 'accounts', icon: <FiUsers size={28} />, name: 'Accounts' },
    { id: 'stands', icon: <MdStorefront size={28} />, name: 'Stands & Menu' },
    { id: 'orders', icon: <FiShoppingCart size={28} />, name: 'Orders' },
    { id: 'payments', icon: <FiCreditCard size={28} />, name: 'Payments' },
    { id: 'reports', icon: <FiBarChart2 size={28} />, name: 'Reports' },
  ];

  const handleLogoutClick = () => {
    onLogout();
  };

  // Helper untuk mendapatkan inisial nama (Misal: "Budi Santoso" -> "B")
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'A';
  };

  return (
    <div className={`flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out ${isCollapsed ? 'w-24' : 'w-72'}`}>
      
      {/* Header Logo */}
      <div className={`p-4 flex items-center border-b h-18 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className={`flex items-center overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0' : 'w-full'}`}>
          <img src={logo} alt="Orderin Logo" className="h-6" />
        </div>
        <button onClick={onToggle} className="p-2 rounded-full hover:bg-gray-100">
          {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-grow">
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <li key={item.id}>
                  <button 
                    onClick={() => setActivePage(item.id)}
                    className={`
                      w-full flex items-center p-3 rounded-lg overflow-hidden text-left transition-colors
                      ${ isActive ? 'bg-blue-800 text-white font-semibold' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}
                    `}
                  >
                    <div className="flex-shrink-0">{item.icon}</div>
                    <div className={`pl-4 transition-all duration-300 ease-in-out ${isCollapsed ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'}`}>
                      <span className="whitespace-nowrap">{item.name}</span>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* --- BAGIAN AKUN USER (DINAMIS) --- */}
      <div className={`relative p-4 border-t ${isCollapsed ? 'flex justify-center' : ''}`}>
        
        {/* Pop-up Menu Logout */}
        {isAccountMenuOpen && !isCollapsed && (
          <div className="absolute bottom-full left-4 right-4 mb-2 p-4 bg-white rounded-lg shadow-lg border z-10">
            {/* Tampilkan Nama & Email dari props 'user' */}
            <p className="font-semibold text-sm text-gray-800">
              {user?.username || 'Admin User'}
            </p>
            <p className="text-xs text-gray-500 mb-4 truncate">
              {user?.email || 'admin@example.com'}
            </p>
            
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <FiLogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        )}

        {/* Tombol Profil di Sidebar Bawah */}
        <button
          onClick={() => setAccountMenuOpen(prev => !prev)}
          disabled={isCollapsed}
          className={`flex items-center w-full overflow-hidden text-left p-2 rounded-lg ${isCollapsed ? 'justify-center' : ''} ${!isCollapsed ? 'hover:bg-gray-100' : ''} transition-colors`}
        >
          {/* Avatar Inisial Dinamis */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
            {getInitial(user?.username)}
          </div>
          
          {/* Teks Nama & Email Dinamis */}
          <div className={`transition-all duration-200 ease-in-out overflow-hidden ${isCollapsed ? 'w-0 ml-0' : 'w-full ml-3'}`}>
            <p className="font-semibold text-sm text-gray-800 whitespace-nowrap">
              {user?.username || 'User'}
            </p>
            <p className="text-xs text-gray-500 whitespace-nowrap">
              {user?.role || 'Admin'}
            </p>
          </div>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;