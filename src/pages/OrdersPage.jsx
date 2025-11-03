// src/pages/OrdersPage.jsx

import React, { useState, useEffect } from 'react';
import { FiBell, FiUser, FiPackage, FiClock, FiCheckCircle, FiLoader, FiAlertCircle } from 'react-icons/fi';
// --- ↓ PATH DIPERBAIKI ↓ ---
import OrderStatCard from '../components/OrderStatCard.jsx';
import RecentOrderItem from '../components/RecentOrderItem.jsx';

// --- Impor fungsi API yang baru ---
// --- ↓ PATH DIPERBAIKI ↓ ---
import { getReportsSummary, getAllOrders, confirmCashPayment } from '../utils/api.jsx'; 

// --- (Fungsi helper 'mapStatusToBadge' dan 'formatApiOrder') ---

const mapStatusToBadge = (status) => {
  switch (status) {
    case 'AWAITING_PAYMENT':
      return { text: 'Pending Payment', type: 'pending' };
    case 'PAID':
      return { text: 'Paid', type: 'paid' };
    case 'PROCESSING':
      return { text: 'Processing', type: 'processing' };
    case 'READY':
      return { text: 'Ready', type: 'ready' };
    case 'COMPLETED':
      return { text: 'Completed', type: 'completed' };
    case 'CANCELLED':
    case 'EXPIRED':
      return { text: status, type: 'cancelled' };
    default:
      return { text: status, type: 'pending' };
  }
};

const formatApiOrder = (apiOrder) => {
  const time = new Date(apiOrder.created_at).toLocaleString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short', // <-- Diubah dari 'day' menjadi 'weekday'
    day: 'numeric',   // <-- Ditambahkan untuk menampilkan tanggal (misal: 20)
    month: 'short'
  });

  return {
    id: apiOrder.references_code,
    orderPk: apiOrder.id,
    uuid: apiOrder.uuid,
    status: mapStatusToBadge(apiOrder.status),
    table: apiOrder.table ? apiOrder.table.code : 'Takeaway',
    standName: apiOrder.tenant.name,
    items: apiOrder.items.map(item => `${item.menu_item.name} x${item.qty}`),
    time: time,
    total: parseFloat(apiOrder.total),
  };
};

// --- Komponen Utama ---

const OrdersPage = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, preparing: 0 });
  const [recentOrdersList, setRecentOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fungsi fetchData ---
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [statsData, ordersData] = await Promise.all([
        getReportsSummary(),
        getAllOrders()
      ]);

      setStats(statsData.stats_today);
      setRecentOrdersList(ordersData.map(formatApiOrder));

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Fungsi handleConfirmPayment ---
  const handleConfirmPayment = async (orderUuid) => {
    if (!window.confirm("Apakah Anda yakin ingin mengonfirmasi pembayaran tunai untuk order ini?")) {
      return;
    }

    try {
      // Sekarang fungsi ini akan memanggil /api/orders/<UUID_STRING_PANJANG>/confirm-cash/
      await confirmCashPayment(orderUuid); 
      alert('Pembayaran berhasil dikonfirmasi!');
      fetchData(); // Muat ulang data

    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // --- (Struktur JSX / render() ---
  return (
    <div className="flex-1 flex flex-col h-screen">
      <header className="bg-white p-4 border-b border-gray-200 h-18 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Orders</h1>
        <div className="flex items-center gap-4">
          <button className="relative text-gray-600 hover:text-gray-800">
            <FiBell size={22} />
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            <FiUser size={22} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        {/* --- Customer Ordering Section --- */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiUser size={20} className="text-blue-600" /> Customer Ordering
          </h2>
          <div className="flex items-center gap-6">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=Example" alt="QR Code" className="w-32 h-32 p-2 border rounded-lg" />
            <div>
              <h3 className="font-bold text-gray-700">Scan to Order</h3>
              <p className="text-sm text-gray-500 max-w-md mt-1 mb-4">Customers can scan this QR code to browse menus and place orders directly from their phones.</p>
              <div className="flex gap-3">
                <button className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-600">Download QR Code</button>
                <button className="bg-gray-100 text-gray-700 font-semibold px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200">View Customer Page</button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Order Stats Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <OrderStatCard icon={<FiPackage size={24}/>} count={loading ? '...' : stats.total} title="Total Orders (Today)" color="blue" />
          <OrderStatCard icon={<FiClock size={24}/>} count={loading ? '...' : stats.pending} title="Pending" color="orange" />
          <OrderStatCard icon={<FiLoader size={24}/>} count={loading ? '...' : stats.preparing} title="Preparing" color="purple" />
          <OrderStatCard icon={<FiCheckCircle size={24}/>} count={loading ? '...' : stats.completed} title="Completed" color="green" />
        </div>

        {/* --- Recent Orders Section --- */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h2>
          
          {loading && <p className="text-gray-500">Loading data...</p>}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold"><FiAlertCircle className="inline -mt-1 mr-2" />Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {!loading && !error && recentOrdersList.length === 0 && (
             <p className="text-gray-500">Tidak ada pesanan terbaru.</p>
          )}

          <div className="space-y-4">
            {recentOrdersList.map((order) => (
              <RecentOrderItem 
                key={order.id} 
                order={order}
                onConfirmPayment={() => handleConfirmPayment(order.uuid)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;