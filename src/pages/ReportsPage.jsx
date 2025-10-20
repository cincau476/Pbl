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
    }).format(value);
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
                setReportData(data);

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
        return <div className="flex-1 flex items-center justify-center h-screen">Loading...</div>;
    }
    
    if (error) {
        return <div className="flex-1 flex items-center justify-center h-screen text-red-500">Error: {error}</div>;
    }

    // 5. Jika data tidak ada (setelah loading selesai), tampilkan pesan
    if (!reportData) {
        return <div className="flex-1 flex items-center justify-center h-screen">No report data found.</div>;
    }

    // 6. Siapkan data untuk komponen anak
    
    // a. Untuk TopSellingProducts (membuat format agar sesuai dgn props yg diharapkan)
    const formattedTopProducts = reportData.top_selling_products.map((product, index) => ({
        rank: index + 1,
        name: product.menu_item__name,
        sold: product.total_sold,
        revenue: formatCurrency(product.total_revenue)
    }));

    // b. Untuk StandPerformance (menghitung persentase bar)
    const standData = reportData.stand_performance || [];
    const maxRevenue = standData.length > 0 
        ? Math.max(...standData.map(s => s.revenue || 0)) 
        : 0;
        
    const formattedStandData = standData.map(stand => ({
        name: stand.name,
        orders: stand.orders,
        revenue: formatCurrency(stand.revenue || 0),
        barPercentage: maxRevenue > 0 ? ((stand.revenue || 0) / maxRevenue) * 100 : 0 
    }));

    return (
        <div className="flex-1 flex flex-col h-screen">
            <header className="bg-white p-4 border-b border-gray-200 h-18 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800">Reports</h1>
                <div className="flex items-center gap-4">
                    <button className="relative text-gray-600 hover:text-gray-800">
                        <FiBell size={22} />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                        <FiUser size={22} />
                    </button>
                </div>
            </header>

            <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
                {/* --- Stats Section (Data dari state) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <ReportStatCard 
                        icon={<FiDollarSign />} 
                        value={formatCurrency(reportData.main_stats.total_revenue)} 
                        title="Total Revenue" 
                    />
                    <ReportStatCard 
                        icon={<FiList />} 
                        value={reportData.main_stats.total_orders} 
                        title="Total Orders" 
                    />
                    <ReportStatCard 
                        icon={<FiTrendingUp />} 
                        value={formatCurrency(reportData.main_stats.avg_order_value)} 
                        title="Avg Order Value" 
                    />
                    <ReportStatCard 
                        icon={<FiUsers />} 
                        value={reportData.main_stats.active_customers} 
                        title="Active Customers" 
                    />
                </div>

                {/* --- Middle Section (Data dari state) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <SalesByHourChart data={reportData.sales_by_hour} />
                    <TopSellingProducts products={formattedTopProducts} />
                </div>

                {/* --- Stand Performance Section (Data dari state) --- */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Stand Performance</h2>
                    <div className="space-y-4">
                        {formattedStandData.map((stand, index) => (
                            <StandPerformanceItem key={index} stand={stand} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReportsPage;