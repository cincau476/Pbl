// src/pages/ReportsPage.jsx

import React, { useState, useEffect } from 'react';
import { FiBell, FiUser, FiDollarSign, FiList, FiTrendingUp, FiUsers } from 'react-icons/fi';
import ReportStatCard from '../components/ReportStatCard.jsx';
import SalesByHourChart from '../components/SalesByHourChart.jsx';
import TopSellingProducts from '../components/TopSellingProducts.jsx';
import StandPerformanceItem from '../components/StandPerformanceItem.jsx';

// 1. Impor fungsi API
import { getReportsSummary } from '../utils/api.jsx';

// Helper untuk format mata uang
const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        minimumFractionDigits: 0 
    }).format(value || 0); // Tambahkan fallback 0 agar tidak error jika value null
}

const ReportsPage = () => {
    // 2. Tambahkan state untuk data, loading, dan error
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 3. Buat fungsi untuk mengambil data dari backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const data = await getReportsSummary();
                console.log("Report Data:", data); // Debugging: Cek isi data di console
                setReportData(data);

            } catch (err) {
                console.error("Gagal mengambil report:", err);
                setError(err.message || "Gagal memuat data laporan.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 4. Tampilkan status loading dan error
    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-2 text-gray-600">Memuat Laporan...</span>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-screen bg-gray-50">
                <p className="text-red-500 font-semibold mb-2">Terjadi Kesalahan</p>
                <p className="text-gray-600 text-sm mb-4">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                    Muat Ulang
                </button>
            </div>
        );
    }

    // 5. Jika data tidak ada
    if (!reportData) {
        return <div className="flex-1 flex items-center justify-center h-screen">Data laporan tidak ditemukan.</div>;
    }

    // 6. Siapkan data dengan PENGAMAN (?. dan || [])
    
    // a. Format TopSellingProducts (tambahkan ?. dan || [])
    const rawTopProducts = reportData?.top_selling_products || [];
    const formattedTopProducts = rawTopProducts.map((product, index) => ({
        rank: index + 1,
        name: product.menu_item__name || "Item Tanpa Nama",
        sold: product.total_sold || 0,
        revenue: formatCurrency(product.total_revenue)
    }));

    // b. Format StandPerformance
    const standData = reportData?.stand_performance || [];
    const maxRevenue = standData.length > 0 
        ? Math.max(...standData.map(s => s.revenue || 0)) 
        : 0;
        
    const formattedStandData = standData.map(stand => ({
        name: stand.name || "Stand",
        orders: stand.orders || 0,
        revenue: formatCurrency(stand.revenue || 0),
        barPercentage: maxRevenue > 0 ? ((stand.revenue || 0) / maxRevenue) * 100 : 0 
    }));

    // c. Ambil main_stats dengan aman
    const stats = reportData?.main_stats || {};

    return (
        <div className="flex-1 flex flex-col h-screen bg-gray-50">
            <header className="bg-white p-4 border-b border-gray-200 h-18 flex items-center justify-between shadow-sm z-10">
                <h1 className="text-xl font-bold text-gray-800">Laporan & Statistik</h1>
                <div className="flex items-center gap-4">
                    <button className="relative text-gray-600 hover:text-gray-800 transition">
                        <FiBell size={22} />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 transition">
                        <FiUser size={22} />
                    </button>
                </div>
            </header>

            <main className="flex-1 p-6 overflow-y-auto">
                {/* --- Stats Section --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <ReportStatCard 
                        icon={<FiDollarSign />} 
                        value={formatCurrency(stats.total_revenue)} 
                        title="Total Pendapatan" 
                    />
                    <ReportStatCard 
                        icon={<FiList />} 
                        value={stats.total_orders || 0} 
                        title="Total Pesanan" 
                    />
                    <ReportStatCard 
                        icon={<FiTrendingUp />} 
                        value={formatCurrency(stats.avg_order_value)} 
                        title="Rata-rata Transaksi" 
                    />
                    <ReportStatCard 
                        icon={<FiUsers />} 
                        value={stats.active_customers || 0} 
                        title="Pelanggan Aktif" 
                    />
                </div>

                {/* --- Middle Section --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Pastikan SalesByHourChart bisa menangani data kosong */}
                    <SalesByHourChart data={reportData?.sales_by_hour || []} />
                    <TopSellingProducts products={formattedTopProducts} />
                </div>

                {/* --- Stand Performance Section --- */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Performa Stand</h2>
                    {formattedStandData.length > 0 ? (
                        <div className="space-y-4">
                            {formattedStandData.map((stand, index) => (
                                <StandPerformanceItem key={index} stand={stand} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm italic">Belum ada data performa stand.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ReportsPage;