// src/components/StandCard.jsx

import React from 'react';
import { FiEdit, FiTrash2, FiMoreVertical } from 'react-icons/fi';

const StandCard = ({ stand, onSelect, isSelected, onEdit, onDelete }) => {
  const { name, seller, description, status, imageUrl } = stand;
  const statusColor = status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';

  const handleEditClick = (e) => {
    e.stopPropagation(); // Mencegah trigger onSelect saat klik tombol edit
    onEdit(stand);
  };
  
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if(window.confirm(`Are you sure you want to delete ${name}?`)){
        onDelete(stand.id);
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 flex gap-4 transition-all cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => onSelect(stand)}
    >
      <img src={imageUrl} alt={name} className="w-24 h-24 object-cover rounded-md flex-shrink-0"/>
      <div className="flex flex-col justify-between w-full">
        <div>
          <div className="flex justify-between items-start mb-1">
            <div>
              <h3 className="font-bold text-gray-800">{name}</h3>
              <p className="text-xs text-gray-500">Seller {seller}</p>
            </div>
            {/* Opsi menu dropdown bisa ditambahkan di sini */}
          </div>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}>{status}</span>
          <div className="flex items-center gap-2">
            <button onClick={handleEditClick} className="flex items-center gap-1 text-blue-600 text-sm hover:underline">
              <FiEdit size={16}/> Edit
            </button>
            <button onClick={handleDeleteClick} className="flex items-center gap-1 text-red-600 text-sm hover:underline">
              <FiTrash2 size={16}/> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandCard;