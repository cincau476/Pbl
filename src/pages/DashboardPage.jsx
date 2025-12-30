// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { FiHome, FiTrendingUp, FiCheckCircle, FiUsers, FiLoader } from 'react-icons/fi';
import StatCard from '../components/StatCard.jsx';
import RecentOrders from '../components/RecentOrders.jsx';
import TopStands from '../components/TopStands.jsx';
import Sidebar from '../components/Sidebar.jsx'; // Tambahkan Sidebar

// 1. Impor API
import { getReportsSummary, getAllOrders } from '../utils/api.jsx';

// Helper untuk format mata uang
const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        minimumFractionDigits: 0 
    }).format(value);
}

const DashboardPage = () => {
  // 2. State untuk data, loading, dan error
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Ambil data saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [summaryData, ordersData] = await Promise.all([
          getReportsSummary(),
          getAllOrders()
        ]);
        
        setSummary(summaryData);
        setOrders(ordersData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <FiLoader className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500 bg-gray-50 px-4 text-center">
        Error: {error}
      </div>
    );
  }

  // Persiapan data Stats
  const totalSalesToday = summary?.stand_performance
    ? summary.stand_performance.reduce((acc, stand) => acc + (stand.revenue || 0), 0)
    : 0;
  const totalStandsToday = summary?.stand_performance?.length || 0;
  const activeOrders = summary?.stats_today?.preparing || 0;
  const pendingOrders = summary?.stats_today?.pending || 0;
  const activeCustomers = summary?.main_stats?.active_customers || 0;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Sidebar Responsif (Akan jadi Bottom Nav di HP/iPad) */}
      <Sidebar />

      {/* Main Content Area */}
      {/* lg:ml-64 memberikan ruang untuk sidebar desktop */}
      <main className="flex-1 lg:ml-64 w-full flex flex-col transition-all duration-300">
        
        {/* Header Responsif */}
        <header className="bg-white p-4 border-b border-gray-200 h-18 flex items-center sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-800">Admin Portal</h1>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          
          {/* Welcome Banner Responsif */}
          <div className="p-6 md:p-10 mb-8 text-white rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome to Kantinku</h2>
            <p className="text-blue-100 text-sm md:text-base max-w-xl">
              Smart canteen ordering system for seamless food ordering and payment management.
            </p>
          </div>

          {/* Stat Cards: 1 Kolom (HP), 2 Kolom (iPad), 4 Kolom (Desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <StatCard
              icon={<FiHome className="text-blue-500" />}
              title="Stands Today"
              value={totalStandsToday}
            />
            <StatCard
              icon={<FiTrendingUp className="text-green-500" />}
              title="Sales Today"
              value={formatCurrency(totalSalesToday)}
              change={`${activeOrders} active orders`}
              changeColor="text-green-500"
            />
            <StatCard
              icon={<FiCheckCircle className="text-orange-500" />}
              title="Pending Orders"
              value={pendingOrders}
              change="Awaiting payment"
            />
            <StatCard
              icon={<FiUsers className="text-purple-500" />}
              title="Customers (7d)"
              value={activeCustomers}
            />
          </div>

          {/* Main Panels: Tumpuk (HP/iPad Portrait), Samping (Desktop/iPad Landscape) */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Recent Orders - Scrollable horizontal di mobile */}
            <div className="xl:col-span-2 overflow-hidden">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                 <div className="min-w-[600px]">
                    <RecentOrders orders={orders} />
                 </div>
              </div>
            </div>

            {/* Top Stands */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Top Performance</h3>
              <TopStands stands={summary?.stand_performance} />
            </div>
            
          </div>

          {/* Spacer untuk Bottom Nav Mobile (Agar konten tidak tertutup bar bawah) */}
          <div className="h-24 lg:hidden"></div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;