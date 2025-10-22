import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const MenuCard = ({ menu, onAvailabilityChange, onEdit, onDelete }) => {
  const { id, name, description, price, available, standName, image } = menu;

  const handleToggleClick = (e) => {
      e.stopPropagation();
      onAvailabilityChange(id, !available);
  };
  
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if(window.confirm(`Are you sure you want to delete ${name}?`)){
        onDelete(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex gap-4">
      <img src={image} alt={name} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
      <div className="flex flex-col justify-between w-full">
        <div>
          <h3 className="font-bold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          <p className="text-xs text-gray-400 mb-3 italic">From: {standName}</p>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <div>
            <p className="font-bold text-lg text-gray-800">Rp {price.toLocaleString('id-ID')}</p>
            <p className="text-xs text-gray-500">Per serving</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleToggleClick}>
              <span className={`text-sm ${available ? 'text-green-600' : 'text-gray-500'}`}>
                {available ? 'Available' : 'Out of Stock'}
              </span>
              <div className={`w-12 h-6 rounded-full flex items-center p-1 ${available ? 'bg-green-500' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${available ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>
            <button onClick={() => onEdit(menu)} className="flex items-center gap-1 text-blue-600 text-sm hover:underline">
              <FiEdit size={16}/>
            </button>
            <button onClick={handleDeleteClick} className="flex items-center gap-1 text-red-600 text-sm hover:underline">
              <FiTrash2 size={16}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;