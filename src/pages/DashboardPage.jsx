import React from 'react';
import { FiHome, FiTrendingUp, FiCheckCircle, FiUsers } from 'react-icons/fi';
import StatCard from '../components/StatCard.jsx';
import RecentOrders from '../components/RecentOrders.jsx';
import TopStands from '../components/TopStands.jsx';

const DashboardPage = () => {
  return (
    // Wrapper utama untuk seluruh area konten di sebelah kanan sidebar
    <div className="flex-1 flex flex-col h-screen">

      {/* === KONTENER 1: HEADER DASHBOARD === */}
      {/*
        - Tingginya akan sama dengan header sidebar karena menggunakan padding (p-4) dan border-b yang identik.
        - Panjangnya otomatis sampai ujung karena parent-nya memiliki 'flex-1'.
      */}
      <header className="bg-white p-4 border-b border-gray-200 h-18 flex items-center">
        <h1 className="text-xl font-bold text-gray-800">
          Dashboard
        </h1>
      </header>

      {/* === KONTENER 2: ISI KONTEN UTAMA === */}
      {/*
        - 'flex-1' membuat area ini mengisi sisa ruang vertikal.
        - 'p-6' atau 'p-8' memberikan jarak antara konten dengan header dan tepi layar.
        - 'overflow-y-auto' akan membuat area ini bisa di-scroll jika kontennya panjang.
        - 'bg-gray-50' memberikan warna latar sedikit abu-abu agar kontainer putih menonjol.
      */}
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        
        {/* Welcome Banner */}
        <div className="p-8 mb-8 text-white rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400">
          <h2 className="text-3xl font-bold mb-2">Welcome to Orderin</h2>
          <p className="text-blue-100">Smart canteen ordering system for seamless food ordering and payment management</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FiHome className="text-blue-500" />}
            title="Total Stands"
            value="12"
            change="+2 this month"
          />
          <StatCard
            icon={<FiTrendingUp className="text-green-500" />}
            title="Total Sales Today"
            value="Rp 2,450,000"
            change="+15% from yesterday"
            changeColor="text-green-500"
          />
          <StatCard
            icon={<FiCheckCircle className="text-orange-500" />}
            title="Active Orders"
            value="23"
            change="8 pending payment"
          />
          <StatCard
            icon={<FiUsers className="text-purple-500" />}
            title="Total Users"
            value="156"
            change="+12 this week"
          />
        </div>

        {/* Main Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentOrders />
          </div>
          <div>
            <TopStands />
          </div>
        </div>

      </main>

    </div>
  );
};

export default DashboardPage;