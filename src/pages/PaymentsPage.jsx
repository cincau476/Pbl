// src/pages/PaymentsPage.jsx

import React from 'react';
import { FiBell, FiUser, FiDollarSign, FiClock, FiCheckCircle, FiXCircle, FiGrid, FiCreditCard } from 'react-icons/fi';
import PaymentStatCard from '../components/PaymentStatCard.jsx';
import PaymentMethodCard from '../components/PaymentMethodCard.jsx';
import TransactionItem from '../components/TransactionItem.jsx';

// Data Dummy
const transactions = [
    { 
        payId: 'PAY-5678', 
        status: { text: 'Pending', type: 'pending' },
        type: 'QRIS',
        orderId: 'ORD-1234',
        customer: '+62 812-3456-7890',
        time: '2 mins ago',
        amount: 90000 
    },
    { 
        payId: 'PAY-5679', 
        status: { text: 'Confirmed', type: 'confirmed' },
        type: 'Cash',
        orderId: 'ORD-1235',
        customer: '+62 813-4567-8901',
        time: '5 mins ago',
        amount: 32000 
    },
];

const PaymentsPage = () => {
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
                {/* --- Payment Stats Section --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <PaymentStatCard icon={<FiDollarSign />} value="Rp 2,450,000" title="Total Payments" />
                    <PaymentStatCard icon={<FiClock />} value="3" title="Pending" />
                    <PaymentStatCard icon={<FiCheckCircle />} value="42" title="Confirmed" />
                    <PaymentStatCard icon={<FiXCircle />} value="2" title="Failed" />
                </div>

                {/* --- Payment Methods Section --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <PaymentMethodCard 
                        icon={<FiGrid size={24} />}
                        title="QRIS Payment"
                        description="Customers scan QR code and payment is automatically confirmed once received."
                        stats={[
                            { label: 'Status', value: 'Active' },
                            { label: "Today's QRIS", value: 'Rp 1,850,000' },
                        ]}
                    />
                    <PaymentMethodCard 
                        icon={<FiCreditCard size={24} />}
                        title="Cash Payment"
                        description="Cashier confirms payment manually after receiving cash from customer."
                        stats={[]}
                        highlight={{
                            label: 'Pending Confirmation',
                            value: 'Rp 600,000',
                            badge: '2 waiting'
                        }}
                    />
                </div>

                {/* --- Payment Transactions Section --- */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Transactions</h2>
                    <div className="space-y-4">
                        {transactions.map((trx, index) => (
                            <TransactionItem key={index} transaction={trx} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaymentsPage;