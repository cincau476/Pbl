// src/pages/PaymentsPage.jsx
import React, { useState, useEffect } from 'react';
import { FiCreditCard, FiSearch } from 'react-icons/fi';
import { getAllOrders, confirmCashPayment } from '../utils/api';

// IMPORT KOMPONEN YANG BARU DIBUAT
import PaymentTable from '../components/PaymentTable.jsx'; 
import AbacSettings from '../components/AbacSettings.jsx';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      // Ambil data order/pembayaran dari API
      const data = await getAllOrders(); 
      setPayments(data);
    } catch (error) {
      console.error("Gagal mengambil data pembayaran:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPayment = async (orderId) => {
    if (!window.confirm("Apakah Anda yakin ingin mengkonfirmasi pembayaran ini?")) {
        return;
    }
    
    try {
      await confirmCashPayment(orderId);
      alert("Pembayaran berhasil dikonfirmasi!");
      // Refresh data setelah berhasil
      fetchPayments(); 
    } catch (error) {
      console.error("Gagal konfirmasi pembayaran:", error);
      alert("Gagal mengonfirmasi pembayaran.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      
      {/* HEADER PAGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <FiCreditCard className="text-orange-500" />
            Manajemen Pembayaran & Sistem
          </h1>
          <p className="text-gray-500 mt-2">
            Kelola konfirmasi pembayaran dan atur operasional (ABAC) kantin.
          </p>
        </div>

        {/* Kolom Pencarian */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari ID Order..." 
            className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
      </div>

      {/* GRID LAYOUT: Kiri Table Pembayaran (2/3), Kanan Pengaturan ABAC (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: Daftar Pembayaran */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Daftar Transaksi</h2>
          <PaymentTable 
            payments={payments} 
            isLoading={isLoading} 
            onConfirmPayment={handleConfirmPayment} 
          />
        </div>

        {/* KOLOM KANAN: Komponen Pengaturan ABAC */}
        <div className="lg:col-span-1">
          <AbacSettings />
        </div>

      </div>
    </div>
  );
}
