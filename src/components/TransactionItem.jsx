// src/components/TransactionItem.jsx

import React from 'react';

// Komponen StatusBadge tidak berubah
const StatusBadge = ({ text, type }) => {
    const typeClasses = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-green-100 text-green-700',
      other: 'bg-gray-100 text-gray-700'
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-md ${typeClasses[type]}`}>{text}</span>;
};

// Komponen TypeBadge tidak berubah
const TypeBadge = ({ text }) => {
    return <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs font-medium rounded-md">{text}</span>;
};

// --- PERUBAHAN ---
// Menerima 'transaction' (data order asli) dan 'onConfirm' (handler)
const TransactionItem = ({ transaction, onConfirm }) => {
  
  // 1. Memetakan data backend ke variabel yang mudah dibaca
  const payId = transaction.references_code;
  const type = transaction.payment_method;
  const orderId = transaction.uuid; // Menggunakan UUID sebagai Order ID
  const customer = transaction.customer?.phone || 'N/A'; // Ambil no telp customer
  const time = new Date(transaction.created_at).toLocaleString('id-ID'); // Format tanggal
  const amount = parseFloat(transaction.total); // Pastikan 'total' adalah angka

  // 2. Logika untuk menentukan status pembayaran
  // (PAID, PROCESSING, READY, COMPLETED) -> Confirmed
  // (AWAITING_PAYMENT) -> Pending
  let paymentStatus;
  if (transaction.status === 'AWAITING_PAYMENT') {
    paymentStatus = { text: 'Pending', type: 'pending' };
  } else if (['PAID', 'PROCESSING', 'READY', 'COMPLETED'].includes(transaction.status)) {
    paymentStatus = { text: 'Confirmed', type: 'confirmed' };
  } else {
    // CANCELLED, EXPIRED
    paymentStatus = { text: transaction.status, type: 'other' };
  }
  
  // 3. Logika untuk tombol konfirmasi
  const canConfirm = paymentStatus.type === 'pending' && type === 'CASH';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <p className="font-semibold text-gray-500 text-sm">{payId}</p>
          <StatusBadge text={paymentStatus.text} type={paymentStatus.type} />
          <TypeBadge text={type} />
        </div>
        {/* Tampilkan UUID order agar unik */}
        <p className="text-sm text-gray-600">Order ID: {orderId}</p> 
        <p className="text-sm text-gray-600">Customer: {customer}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs text-gray-500">Amount</p>
          <p className="font-bold text-xl text-gray-800">Rp {amount.toLocaleString('id-ID')}</p>
        </div>

        {/* 4. Tampilkan tombol HANYA jika bisa dikonfirmasi */}
        {canConfirm && (
            <div className="flex gap-2">
                <button 
                    // 5. Panggil fungsi 'onConfirm' dengan UUID
                    onClick={() => onConfirm(transaction.uuid)} 
                    className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                    Confirm
                </button>
                {/* Tombol Decline bisa ditambahkan logikanya nanti (misal: cancel order) */}
                <button className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                    Decline
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
// --- AKHIR PERUBAHAN ---

export default TransactionItem;