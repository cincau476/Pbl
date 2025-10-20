// src/pages/PaymentsPage.jsx

import React, { useState, useEffect } from 'react';
import { FiBell, FiUser, FiDollarSign, FiClock, FiCheckCircle, FiXCircle, FiGrid, FiCreditCard } from 'react-icons/fi';
import PaymentStatCard from '../components/PaymentStatCard.jsx';
import PaymentMethodCard from '../components/PaymentMethodCard.jsx';
import TransactionItem from '../components/TransactionItem.jsx';

// --- PERUBAHAN ---
// 1. Impor fungsi API yang kita butuhkan
import { getReportsSummary, getAllOrders, confirmCashPayment } from '../utils/api.jsx';
// --- AKHIR PERUBAHAN ---


// Helper untuk format mata uang
const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        minimumFractionDigits: 0 
    }).format(value);
}

const PaymentsPage = () => {
    // --- PERUBAHAN ---
    // 2. Tambahkan state untuk data, loading, dan error
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 3. Buat fungsi untuk mengambil data dari backend
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Ambil data summary dan data order secara paralel
            const [summaryData, ordersData] = await Promise.all([
                getReportsSummary(),
                getAllOrders()
            ]);
            
            setStats(summaryData);
            setOrders(ordersData);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 4. Panggil fetchData() saat komponen pertama kali dimuat
    useEffect(() => {
        fetchData();
    }, []); // [] berarti hanya dijalankan sekali saat mount

    // 5. Buat handler untuk tombol konfirmasi
    const handleConfirmCash = async (orderUuid) => {
        if (!window.confirm("Apakah Anda yakin ingin mengkonfirmasi pembayaran ini?")) {
            return;
        }
        
        try {
            await confirmCashPayment(orderUuid);
            alert("Pembayaran berhasil dikonfirmasi!");
            fetchData(); // Muat ulang data setelah konfirmasi
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    // 6. Tampilkan status loading dan error
    if (loading) {
        return <div className="flex-1 flex items-center justify-center h-screen">Loading...</div>;
    }
    
    if (error) {
        return <div className="flex-1 flex items-center justify-center h-screen text-red-500">Error: {error}</div>;
    }

    // 7. Hitung statistik untuk kartu "Cash Payment"
    const pendingCashOrders = orders.filter(o => 
        o.status === 'AWAITING_PAYMENT' && o.payment_method === 'CASH'
    );
    const pendingCashTotal = pendingCashOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);
    const pendingCashCount = pendingCashOrders.length;
    
    // 8. Hitung statistik untuk kartu "QRIS Payment"
    // Ini asumsi, idealnya backend memberi data spesifik
    const totalPaidRevenue = stats?.main_stats?.total_revenue || 0; 
    const qrisPaidToday = orders
        .filter(o => ['PAID', 'PROCESSING', 'READY', 'COMPLETED'].includes(o.status) && o.payment_method === 'TRANSFER')
        .reduce((sum, o) => sum + parseFloat(o.total), 0);
    
    // 9. Ambil data untuk kartu atas (Total, Pending, Confirmed)
    const topStats = {
        total: totalPaidRevenue,
        pending: stats?.stats_today?.pending || 0,
        // Confirmed = Paid + Processing + Ready + Completed
        confirmed: (stats?.stats_today?.preparing || 0) + (stats?.stats_today?.completed || 0), 
        failed: 0 // Backend summary tidak menyediakan ini, jadi kita set 0
    };
    // --- AKHIR PERUBAHAN ---

    return (
        <div className="flex-1 flex flex-col h-screen">
            <header className="bg-white p-4 border-b border-gray-200 h-18 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800">Payments</h1>
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
                {/* --- Payment Stats Section (Data dari state) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <PaymentStatCard icon={<FiDollarSign />} value={formatCurrency(topStats.total)} title="Total Paid Revenue" />
                    <PaymentStatCard icon={<FiClock />} value={topStats.pending} title="Pending Today" />
                    <PaymentStatCard icon={<FiCheckCircle />} value={topStats.confirmed} title="Confirmed Today" />
                    <PaymentStatCard icon={<FiXCircle />} value={topStats.failed} title="Failed" />
                </div>

                {/* --- Payment Methods Section (Data dari state) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <PaymentMethodCard 
                        icon={<FiGrid size={24} />}
                        title="QRIS Payment"
                        description="Customers scan QR code and payment is automatically confirmed once received."
                        stats={[
                            { label: 'Status', value: 'Active' },
                            { label: "Today's Paid QRIS", value: formatCurrency(qrisPaidToday) },
                        ]}
                    />
                    <PaymentMethodCard 
                        icon={<FiCreditCard size={24} />}
                        title="Cash Payment"
                        description="Cashier confirms payment manually after receiving cash from customer."
                        stats={[]}
                        highlight={{
                            label: 'Pending Confirmation',
                            value: formatCurrency(pendingCashTotal),
                            badge: `${pendingCashCount} waiting`
                        }}
                    />
                </div>

                {/* --- Payment Transactions Section (Data dari state) --- */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Transactions</h2>
                    <div className="space-y-4">
                        {/* 10. Map data 'orders' dan kirim 'onConfirm' handler */}
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <TransactionItem 
                                    key={order.uuid} 
                                    transaction={order} 
                                    onConfirm={handleConfirmCash} 
                                />
                            ))
                        ) : (
                            <p className="text-gray-500">No transactions found.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaymentsPage;