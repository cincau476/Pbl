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
      <FiLoader className="w-10 h-10 text-blue-500 animate-spin" />
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-600 text-center">
      Error: {error}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Selamat datang kembali di portal manajemen.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<FiHome className="text-blue-500" />} title="Stands Hari Ini" value={summary?.stand_performance?.length || 0} />
        <StatCard icon={<FiTrendingUp className="text-green-500" />} title="Omzet" value={formatCurrency(summary?.stand_performance?.reduce((acc, s) => acc + (s.revenue || 0), 0) || 0)} />
        <StatCard icon={<FiCheckCircle className="text-orange-500" />} title="Pesanan Aktif" value={summary?.stats_today?.preparing || 0} />
        <StatCard icon={<FiUsers className="text-purple-500" />} title="Pelanggan" value={summary?.main_stats?.active_customers || 0} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-800 uppercase text-sm">Pesanan Terbaru</h3>
          </div>
          <div className="overflow-x-auto">
            <RecentOrders orders={orders} />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 uppercase text-sm mb-6">Top Stands</h3>
          <TopStands stands={summary?.stand_performance} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
