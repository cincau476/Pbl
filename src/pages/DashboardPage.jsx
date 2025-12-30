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
    <div className="flex h-[60vh] items-center justify-center">
      <FiLoader className="w-10 h-10 text-orange-500 animate-spin" />
    </div>
  );
  
  if (error) return (
    <div className="bg-red-500/10 border border-red-500 p-4 rounded-xl text-red-500 text-center">
      Error: {error}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">Dashboard</h1>
        <p className="text-gray-400">Selamat datang kembali di portal manajemen.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FiHome className="text-orange-500" />}
          title="Stands Aktif"
          value={summary?.stand_performance?.length || 0}
        />
        <StatCard
          icon={<FiTrendingUp className="text-green-500" />}
          title="Omzet Hari Ini"
          value={formatCurrency(summary?.stand_performance?.reduce((acc, s) => acc + (s.revenue || 0), 0) || 0)}
          change="Data real-time"
          changeColor="text-green-500"
        />
        <StatCard
          icon={<FiCheckCircle className="text-blue-500" />}
          title="Pesanan Aktif"
          value={summary?.stats_today?.preparing || 0}
        />
        <StatCard
          icon={<FiUsers className="text-purple-500" />}
          title="Pelanggan"
          value={summary?.main_stats?.active_customers || 0}
        />
      </div>

      {/* Main Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-700 bg-gray-800/30">
            <h3 className="font-bold text-white uppercase text-sm">Pesanan Terbaru</h3>
          </div>
          <div className="overflow-x-auto">
            <RecentOrders orders={orders} />
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 shadow-xl">
          <h3 className="font-bold text-white uppercase text-sm mb-6">Top Stands</h3>
          <TopStands stands={summary?.stand_performance} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
