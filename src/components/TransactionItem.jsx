// src/components/TransactionItem.jsx

import React from 'react';

const StatusBadge = ({ text, type }) => {
    const typeClasses = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-green-100 text-green-700',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-md ${typeClasses[type]}`}>{text}</span>;
};

const TypeBadge = ({ text }) => {
    return <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs font-medium rounded-md">{text}</span>;
};

const TransactionItem = ({ transaction }) => {
  const { payId, status, type, orderId, customer, time, amount } = transaction;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <p className="font-semibold text-gray-500 text-sm">{payId}</p>
          <StatusBadge text={status.text} type={status.type} />
          <TypeBadge text={type} />
        </div>
        <p className="text-sm text-gray-600">Order ID: {orderId}</p>
        <p className="text-sm text-gray-600">Customer: {customer}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs text-gray-500">Amount</p>
          <p className="font-bold text-xl text-gray-800">Rp {amount.toLocaleString('id-ID')}</p>
        </div>
        {status.type === 'pending' && (
            <div className="flex gap-2">
                <button className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    Confirm
                </button>
                <button className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                    Decline
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default TransactionItem;