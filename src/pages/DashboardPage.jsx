// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { FiHome, FiTrendingUp, FiCheckCircle, FiUsers, FiLoader } from 'react-icons/fi';
import StatCard from '../components/StatCard.jsx';
import RecentOrders from '../components/RecentOrders.jsx';
import TopStands from '../components/TopStands.jsx';
import { getReportsSummary, getAllOrders } from '../utils/api.jsx';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0 
    }).format(value);
}

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
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

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <FiLoader className="w-10 h-10 text-orange-500 animate-spin" />
    </div>
  );

  return (
    <div className="w-full animate-in fade-in duration-500">
      
      {/* HEADER SECTION (KOTAK PUTIH):
         - w-full: Memastikan lebar penuh.
         - p-8: Memberikan ruang di dalam kotak putih.
         - border-b: Garis pemisah tipis di bawah.
         - Karena App.jsx tidak ada padding, div ini akan menempel ke atas & kiri.
      */}
      <div className="bg-white w-full border-b border-gray-200 px-8 py-6 mb-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] sticky top-0 z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Ringkasan aktivitas dan performa kantin hari ini.
            </p>
          </div>
          {/* Anda bisa menambahkan tombol filter tanggal di sini jika perlu */}
        </div>
      </div>

      {/* CONTENT SECTION:
         - px-8: Memberikan jarak konten dari tepi layar (agar tidak menempel).
         - space-y-8: Memberikan jarak antar elemen vertikal.
      */}
      <div className="px-6 md:px-8 space-y-8 pb-12">
        
        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={<FiHome className="text-white text-xl" />} 
            iconBg="bg-blue-500"
            title="Total Stand" 
            value={summary?.stand_performance?.length || 0} 
          />
          <StatCard 
            icon={<FiTrendingUp className="text-white text-xl" />} 
            iconBg="bg-green-500"
            title="Omzet Hari Ini" 
            value={formatCurrency(summary?.stand_performance?.reduce((acc, s) => acc + (s.revenue || 0), 0) || 0)} 
          />
          <StatCard 
            icon={<FiCheckCircle className="text-white text-xl" />} 
            iconBg="bg-orange-500"
            title="Pesanan Aktif" 
            value={summary?.stats_today?.preparing || 0} 
          />
          <StatCard 
            icon={<FiUsers className="text-white text-xl" />} 
            iconBg="bg-purple-500"
            title="Pelanggan Baru" 
            value={summary?.main_stats?.active_customers || 0} 
          />
        </div>

        {/* BOTTOM PANELS GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* LEFT PANEL: RECENT TRANSACTIONS */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-lg">Transaksi Terbaru</h3>
            </div>
            <div className="p-0 overflow-x-auto">
              <RecentOrders orders={orders} />
            </div>
          </div>

          {/* RIGHT PANEL: TOP STANDS */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-fit">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">Performa Stand</h3>
            </div>
            <div className="p-6">
              <TopStands stands={summary?.stand_performance} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
