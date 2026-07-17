// src/components/PaymentTable.jsx
import React from 'react';
import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

export default function PaymentTable({ payments, onConfirmPayment, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
        Belum ada data transaksi.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm">
            <th className="p-4 font-medium">ID Order</th>
            <th className="p-4 font-medium">Tanggal</th>
            <th className="p-4 font-medium">Metode</th>
            <th className="p-4 font-medium">Total</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td className="p-4 font-medium text-gray-800 dark:text-gray-200">
                #{payment.id.split('-')[0].toUpperCase()}
              </td>
              <td className="p-4 text-gray-600 dark:text-gray-400">
                {new Date(payment.created_at).toLocaleDateString('id-ID')}
              </td>
              <td className="p-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-semibold">
                  {payment.payment_method || 'CASH'}
                </span>
              </td>
              <td className="p-4 font-semibold text-orange-600">
                Rp {payment.total_amount?.toLocaleString('id-ID')}
              </td>
              <td className="p-4">
                {payment.status === 'PAID' ? (
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
                    <FiCheckCircle /> Lunas
                  </span>
                ) : payment.status === 'PENDING' ? (
                  <span className="flex items-center gap-1 text-orange-500 text-sm font-medium">
                    <FiClock /> Pending
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-500 text-sm font-medium">
                    <FiXCircle /> Gagal
                  </span>
                )}
              </td>
              <td className="p-4 text-center">
                {payment.status === 'PENDING' && payment.payment_method === 'CASH' && (
                  <button
                    onClick={() => onConfirmPayment(payment.id)}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    Konfirmasi
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
