// src/pages/ReportsPage.jsx

import React from 'react';
import { FiBell, FiUser, FiDollarSign, FiList, FiTrendingUp, FiUsers } from 'react-icons/fi';
import ReportStatCard from '../components/ReportStatCard.jsx';
import SalesByHourChart from '../components/SalesByHourChart.jsx';
import TopSellingProducts from '../components/TopSellingProducts.jsx';
import StandPerformanceItem from '../components/StandPerformanceItem.jsx';

// Data Dummy
const salesData = [
    { hour: '08', orders: 12 }, { hour: '09', orders: 24 }, { hour: '10', orders: 38 },
    { hour: '11', orders: 56 }, { hour: '12', orders: 89 }, { hour: '13', orders: 67 },
    { hour: '14', orders: 45 }, { hour: '15', orders: 34 },
];
const topProducts = [
    { rank: 1, name: 'Ayam Kawin', sold: 156, revenue: 'Rp 6240K' },
    { rank: 2, name: 'Nasi Goreng Special', sold: 143, revenue: 'Rp 5005K' },
    { rank: 3, name: 'Ayam Lari', sold: 128, revenue: 'Rp 4864K' },
    { rank: 4, name: 'Mie Ayam', sold: 98, revenue: 'Rp 2450K' },
    { rank: 5, name: 'Dimsum Mentai', sold: 87, revenue: 'Rp 2610K' },
];
const standPerformanceData = [
    { name: 'Warung Pecah Sebelah', orders: 125, revenue: 'Rp 4250K', growth: '+15% growth', barPercentage: 80 },
    { name: 'Ayam Crispy Corner', orders: 98, revenue: 'Rp 3720K', growth: '+12% growth', barPercentage: 70 },
    { name: 'Noodle House', orders: 87, revenue: 'Rp 2680K', growth: '+8% growth', barPercentage: 55 },
    { name: 'Juice Bar', orders: 48, revenue: 'Rp 1800K', growth: '+15% growth', barPercentage: 90 },
];


const ReportsPage = () => {
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
                {/* --- Stats Section --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <ReportStatCard icon={<FiDollarSign />} value="Rp 12,450,000" title="Total Revenue" change="+8% from last week" />
                    <ReportStatCard icon={<FiList />} value="358" title="Total Orders" change="+5% from last week" />
                    <ReportStatCard icon={<FiTrendingUp />} value="Rp 34,750" title="Avg Order Value" change="+8% from last week" />
                    <ReportStatCard icon={<FiUsers />} value="156" title="Active Customers" change="+12% from last week" />
                </div>

                {/* --- Middle Section --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <SalesByHourChart data={salesData} />
                    <TopSellingProducts products={topProducts} />
                </div>

                {/* --- Stand Performance Section --- */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Stand Performance</h2>
                    <div className="space-y-4">
                        {standPerformanceData.map((stand, index) => (
                            <StandPerformanceItem key={index} stand={stand} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReportsPage;