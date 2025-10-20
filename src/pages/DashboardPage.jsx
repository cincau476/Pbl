// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { FiHome, FiTrendingUp, FiCheckCircle, FiUsers } from 'react-icons/fi';
import StatCard from '../components/StatCard.jsx';
import RecentOrders from '../components/RecentOrders.jsx';
import TopStands from '../components/TopStands.jsx';

// --- PERUBAHAN ---
// 1. Impor API
import { getReportsSummary, getAllOrders } from '../utils/api.jsx';
// --- AKHIR PERUBAHAN ---

// Helper untuk format mata uang
const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        minimumFractionDigits: 0 
    }).format(value);
}

const DashboardPage = () => {
  // --- PERUBAHAN ---
  // 2. Tambahkan state untuk data, loading, dan error
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. useEffect untuk mengambil data saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Ambil data summary dan data order secara bersamaan
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
  }, []); // [] berarti hanya dijalankan sekali saat mount

  // 4. Tampilkan status loading dan error
  if (loading) {
    return <div className="flex-1 flex items-center justify-center h-screen">Loading dashboard...</div>;
  }
  
  if (error) {
    return <div className="flex-1 flex items-center justify-center h-screen text-red-500">Error: {error}</div>;
  }

  // 5. Siapkan data untuk Stat Cards (setelah loading selesai)
  const totalSalesToday = summary?.stand_performance
    ? summary.stand_performance.reduce((acc, stand) => acc + (stand.revenue || 0), 0)
    : 0;

  const totalStandsToday = summary?.stand_performance
    ? summary.stand_performance.length
    : 0;
    
  const activeOrders = summary?.stats_today?.preparing || 0;
  const pendingOrders = summary?.stats_today?.pending || 0;
  const activeCustomers = summary?.main_stats?.active_customers || 0;

  // --- AKHIR PERUBAHAN ---

  return (
    <div className="flex-1 flex flex-col h-screen">
      <header className="bg-white p-4 border-b border-gray-200 h-18 flex items-center">
        <h1 className="text-xl font-bold text-gray-800">
          Dashboard
        </h1>
      </header>

      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        
        <div className="p-8 mb-8 text-white rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400">
          <h2 className="text-3xl font-bold mb-2">Welcome to Orderin</h2>
          <p className="text-blue-100">Smart canteen ordering system for seamless food ordering and payment management</p>
        </div>

        {/* --- PERUBAHAN --- */}
        {/* Stats Cards diisi dengan data dari state */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FiHome className="text-blue-500" />}
            title="Performing Stands Today"
            value={totalStandsToday}
          />
          <StatCard
            icon={<FiTrendingUp className="text-green-500" />}
            title="Total Sales Today"
            value={formatCurrency(totalSalesToday)}
            change={`${activeOrders} active orders`}
            changeColor="text-green-500"
          />
          <StatCard
            icon={<FiCheckCircle className="text-orange-500" />}
            title="Pending Orders Today"
            value={pendingOrders}
            change={`${pendingOrders} pending payment`}
          
          />
          <StatCard
            icon={<FiUsers className="text-purple-500" />}
            title="Active Customers (7d)"
            value={activeCustomers}
          />
        </div>
        {/* --- AKHIR PERUBAHAN --- */}


        {/* --- PERUBAHAN --- */}
        {/* Main Panels diisi dengan data dari state */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Kirim data 'orders' sebagai prop */}
            <RecentOrders orders={orders} />
          </div>
          <div>
            {/* Kirim data 'stand_performance' sebagai prop */}
            <TopStands stands={summary.stand_performance} />
          </div>
        </div>
        {/* --- AKHIR PERUBAHAN --- */}
      </main>

    </div>
  );
};

export default DashboardPage;