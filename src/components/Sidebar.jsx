import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiGrid, 
  FiUsers, 
  FiShoppingBag, 
  FiBarChart2, 
  FiBox, 
  FiLogOut,
  FiCreditCard // Ikon baru untuk pembayaran
} from 'react-icons/fi';

export default function Sidebar({ onLogout }) { 
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <FiGrid /> },
    { name: 'Tenant', path: '/stands', icon: <FiBox /> },
    { name: 'Pesanan', path: '/orders', icon: <FiShoppingBag /> },
    { name: 'Bayar', path: '/payments', icon: <FiCreditCard /> }, // Menambahkan menu pembayaran
    { name: 'Laporan', path: '/reports', icon: <FiBarChart2 /> },
    { name: 'Akun', path: '/accounts', icon: <FiUsers /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 h-screen fixed left-0 top-0 border-r border-gray-800 z-40">
        <div className="p-8">
          <h1 className="text-2xl font-black text-orange-500 tracking-tighter">
            KANTINKU <span className="text-white text-xs block font-light tracking-widest mt-1">ADMIN PORTAL</span>
          </h1>
        </div>

        {/* Navigasi Utama dengan scroll jika menu banyak */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={onLogout} 
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <FiLogOut className="text-xl" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- MOBILE NAV --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-white/5 px-2 py-1 z-[100] flex justify-around items-center shadow-[0_-10px_30px_rgba(0,0,0,0.5)] safe-area-pb">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center justify-center py-2 px-1 min-w-[50px] relative transition-all ${
              isActive(item.path) ? 'text-orange-500 scale-110' : 'text-gray-500'
            }`}
          >
            <span className="text-xl mb-1">{item.icon}</span>
            <span className="text-[8px] font-bold uppercase tracking-tighter">{item.name}</span>
            {isActive(item.path) && (
              <div className="absolute -top-1 w-6 h-1 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
            )}
          </Link>
        ))}
      </nav>
    </>
  );
}
