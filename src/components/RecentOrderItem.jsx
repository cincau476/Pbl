// src/components/RecentOrderItem.jsx

import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

const StatusBadge = ({ text, type }) => {
  // Tambahkan style untuk status baru jika perlu
  const typeClasses = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    processing: 'bg-blue-100 text-blue-700',
    ready: 'bg-purple-100 text-purple-700',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return <span className={`px-2 py-1 text-xs font-medium rounded-md ${typeClasses[type] || typeClasses.pending}`}>{text}</span>;
};

const TableBadge = ({ text }) => {
  return <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs font-medium rounded-md">{text}</span>;
};

// Terima prop baru: onConfirmPayment
const RecentOrderItem = ({ order, onConfirmPayment }) => {
  const { id, status, table, standName, items, time, total } = order;

  // Tentukan apakah tombol konfirmasi harus ditampilkan
  const showConfirmButton = status.type === 'pending';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <p className="font-semibold text-gray-500 text-sm">{id}</p>
          <StatusBadge text={status.text} type={status.type} />
          {table && <TableBadge text={table} />}
        </div>
        <h3 className="font-bold text-lg text-gray-800">{standName}</h3>
        <p className="text-sm text-gray-500">{items.join(', ')}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-xs text-gray-500">Total</p>
          <p className="font-bold text-xl text-gray-800">Rp {total.toLocaleString('id-ID')}</p>
        </div>
        
        {/* Tampilkan tombol hanya jika statusnya 'pending' */}
        {showConfirmButton && (
          <button 
            onClick={onConfirmPayment} // Panggil fungsi dari parent
            className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Confirm Payment
          </button>
        )}

        <button className="text-gray-400 hover:text-gray-600">
          <FiChevronDown size={20} />
        </button>
      </div>
    </div>
  );
};

export default RecentOrderItem;