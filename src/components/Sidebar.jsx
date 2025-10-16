// src/components/Sidebar.jsx

import React from 'react';
import { 
  FiGrid, FiUsers, FiShoppingCart, FiCreditCard, 
  FiBarChart2, FiChevronLeft, FiChevronRight 
} from 'react-icons/fi';
import { MdStorefront } from 'react-icons/md';

// 1. Impor file gambar logo Anda dari folder assets
import logo from '../assets/logo.png'; 

const Sidebar = ({ isCollapsed, onToggle, activePage, setActivePage }) => {
  
  const navItems = [
    { id: 'dashboard', icon: <FiGrid size={28} />, name: 'Dashboard' },
    { id: 'accounts', icon: <FiUsers size={28} />, name: 'Accounts' },
    { id: 'stands', icon: <MdStorefront size={28} />, name: 'Stands & Menu' },
    { id: 'orders', icon: <FiShoppingCart size={28} />, name: 'Orders' },
    { id: 'payments', icon: <FiCreditCard size={28} />, name: 'Payments' },
    { id: 'reports', icon: <FiBarChart2 size={28} />, name: 'Reports' },
  ];

  return (
    <div className={`flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out ${isCollapsed ? 'w-24' : 'w-72'}`}>
      
      <div className={`p-4 flex items-center border-b h-18 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        
        {/* =======================================================
          === PERUBAHAN UTAMA: MENGGANTI IKON DENGAN GAMBAR LOGO ===
          =======================================================
        */}
        <div className={`flex items-center overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0' : 'w-full'}`}>
          {/* 2. Gunakan tag <img> untuk menampilkan logo */}
          <img src={logo} alt="Orderin Logo" className="h-6" />
        </div>

        <button onClick={onToggle} className="p-2 rounded-full hover:bg-gray-100">
          {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>
      </div>

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
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    
                    <div className={`pl-4 transition-all duration-300 ease-in-out ${isCollapsed ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'}`}>
                      <span className="whitespace-nowrap">
                        {item.name}
                      </span>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      <div className={`p-4 border-t flex ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="flex items-center overflow-hidden">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
          <div className={`transition-all duration-200 ease-in-out overflow-hidden ${isCollapsed ? 'w-0 ml-0' : 'w-full ml-3'}`}>
            <p className="font-semibold text-sm text-gray-800 whitespace-nowrap">Admin User</p>
            <p className="text-xs text-gray-500 whitespace-nowrap">admin@orderin.app</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;