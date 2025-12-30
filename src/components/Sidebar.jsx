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
        {/* Header dengan Tombol Toggle */}
        <div className="p-6 flex items-center justify-between">
          {isExpanded && (
            <h1 className="text-xl font-black text-orange-500 tracking-tighter uppercase animate-in fade-in duration-300">
              Kantinku
            </h1>
          )}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-gray-800 text-orange-500 hover:bg-gray-700 transition-colors mx-auto"
            title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isExpanded ? <FiChevronLeft size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Navigasi Menu */}
        <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 p-3.5 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              } ${!isExpanded ? 'justify-center' : ''}`}
              title={!isExpanded ? item.name : ''}
            >
              <span className="text-xl">{item.icon}</span>
              {isExpanded && (
                <span className="font-semibold whitespace-nowrap animate-in slide-in-from-left-2 duration-300">
                  {item.name}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={onLogout} 
            className={`flex items-center gap-3 p-3 w-full text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all ${
              !isExpanded ? 'justify-center' : ''
            }`}
          >
            <FiLogOut className="text-xl" />
            {isExpanded && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE NAV (Bottom Bar) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-2 py-1 z-[100] flex justify-around items-center safe-area-pb">
        {menuItems.slice(0, 5).map((item) => ( // Batasi jumlah menu di mobile agar tidak sesak
          <Link key={item.name} to={item.path} className={`flex flex-col items-center py-2 ${isActive(item.path) ? 'text-orange-500' : 'text-gray-500'}`}>
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] uppercase font-bold">{item.name}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
