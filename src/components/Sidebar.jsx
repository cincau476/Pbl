// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiGrid, FiUsers, FiShoppingBag, FiBarChart2, 
  FiBox, FiLogOut, FiCreditCard, FiChevronLeft, FiMenu 
} from 'react-icons/fi';

export default function Sidebar({ onLogout, isExpanded, setIsExpanded }) { 
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <FiGrid /> },
    { name: 'Tenant', path: '/stands', icon: <FiBox /> },
    { name: 'Pesanan', path: '/orders', icon: <FiShoppingBag /> },
    { name: 'Bayar', path: '/payments', icon: <FiCreditCard /> },
    { name: 'Laporan', path: '/reports', icon: <FiBarChart2 /> },
    { name: 'Akun', path: '/accounts', icon: <FiUsers /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden lg:flex flex-col bg-gray-900 h-screen fixed left-0 top-0 border-r border-gray-800 z-50 transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-20'
      }`}>
        
        {/* HEADER SIDEBAR (LOGO & TOGGLE) */}
        {/* Perbaikan: Menggunakan logika justify-between/center untuk posisi tombol yang lebih proporsional */}
        <div className={`flex items-center h-20 transition-all duration-300 ${
            isExpanded ? 'justify-between px-6' : 'justify-center'
        }`}>
          
          {/* Logo (Hanya muncul saat expanded) */}
          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
             <h1 className="text-xl font-black text-orange-500 tracking-tighter uppercase whitespace-nowrap">
              Kantinku
            </h1>
          </div>
          
          {/* Tombol Toggle: mx-auto DIHAPUS agar bisa geser ke kanan saat expanded */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-gray-800 text-orange-500 hover:bg-gray-700 transition-colors shadow-sm border border-gray-700/50"
            title={isExpanded ? "Kecilkan Sidebar" : "Perbesar Sidebar"}
          >
            {isExpanded ? <FiChevronLeft size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* MENU NAVIGASI */}
        <nav className="flex-1 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative ${
                isActive(item.path)
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              } ${!isExpanded ? 'justify-center' : ''}`}
            >
              {/* Ikon */}
              <span className={`text-xl transition-transform duration-300 ${!isExpanded && isActive(item.path) ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              
              {/* Teks Menu */}
              <span className={`font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'w-auto opacity-100 ml-1' : 'w-0 opacity-0 ml-0'
              }`}>
                {item.name}
              </span>

              {/* Tooltip saat Sidebar Mengecil (Opsional untuk UX) */}
              {!isExpanded && (
                <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl border border-gray-700">
                  {item.name}
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* FOOTER (LOGOUT) */}
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={onLogout} 
            className={`flex items-center gap-3 p-3 w-full text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all ${
              !isExpanded ? 'justify-center' : ''
            }`}
            title={!isExpanded ? "Sign Out" : ""}
          >
            <FiLogOut className="text-xl" />
            <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                 isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'
            }`}>
                Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* MOBILE NAV (Tetap sama) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-2 py-2 z-[100] flex justify-around items-center safe-area-pb shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        {menuItems.slice(0, 5).map((item) => (
          <Link key={item.name} to={item.path} className={`flex flex-col items-center p-1 rounded-lg transition-all ${isActive(item.path) ? 'text-orange-500' : 'text-gray-500'}`}>
            <span className={`text-xl mb-0.5 transition-transform ${isActive(item.path) ? '-translate-y-1' : ''}`}>{item.icon}</span>
            <span className="text-[9px] uppercase font-bold tracking-wide">{item.name}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
