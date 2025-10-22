// src/pages/StandsAndMenuPage.jsx

import React, { useState } from 'react';
import { FiPlus, FiBell, FiUser } from 'react-icons/fi';
import StandCard from '../components/StandCard.jsx';
import MenuCard from '../components/MenuCard.jsx';

// =======================================================
// === PERBAIKAN UTAMA: Mengembalikan imageUrl ke data ===
// =======================================================
const stands = [
  { id: 1, name: 'Warung Pecah Sebelah', seller: 'A', description: 'Traditional indonesian food', status: 'Open', imageUrl: 'https://placehold.co/100x100/EFEFEF/333333?text=Stand' },
  { id: 2, name: 'Ayam Crispy Corner', seller: 'B', description: 'Fried chicken and snacks', status: 'Open', imageUrl: 'https://placehold.co/100x100/EFEFEF/333333?text=Stand' },
  { id: 3, name: 'Noodle House', seller: 'A', description: 'Various noodle dishes', status: 'Closed', imageUrl: 'https://placehold.co/100x100/EFEFEF/333333?text=Stand' },
];

const allMenus = [
  { id: 101, standId: 1, name: 'Ayam Kawin', description: 'Spicy grilled chicken...', price: 40000, availability: 'Available', imageUrl: 'https://placehold.co/100x100/EFEFEF/333333?text=Menu' },
  { id: 102, standId: 1, name: 'Es Teh Manis', description: 'Sweet iced tea', price: 5000, availability: 'Available', imageUrl: 'https://placehold.co/100x100/EFEFEF/333333?text=Menu' },
  { id: 201, standId: 2, name: 'Ayam Lari', description: 'Crispy fried chicken', price: 38000, availability: 'Available', imageUrl: 'https://placehold.co/100x100/EFEFEF/333333?text=Menu' },
  { id: 301, standId: 3, name: 'Mie Ayam', description: 'Chicken noodles', price: 25000, availability: 'Out of Stock', imageUrl: 'https://placehold.co/100x100/EFEFEF/333333?text=Menu' },
  { id: 302, standId: 3, name: 'Nasi Goreng Special', description: 'Special fried rice...', price: 35000, availability: 'Available', imageUrl: 'https://placehold.co/100x100/EFEFEF/333333?text=Menu' },
];

const StandsAndMenuPage = () => {
  const [selectedStand, setSelectedStand] = useState(null);

  const menusForSelectedStand = selectedStand 
    ? allMenus.filter(menu => menu.standId === selectedStand.id).map(menu => ({...menu, standName: selectedStand.name}))
    : [];

  return (
    <div className="flex-1 flex flex-col h-screen">
      <header className="bg-white p-4 border-b border-gray-200 h-18 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">
          Stands & Menu
        </h1>
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
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Stand Management</h2>
            <button className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors">
              <FiPlus size={20} />
              Add New Stand
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stands.map(stand => (
              <StandCard 
                key={stand.id} 
                stand={stand} 
                onSelect={setSelectedStand}
                isSelected={selectedStand && selectedStand.id === stand.id}
              />
            ))}
          </div>
        </div>

        {selectedStand && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Menu Management for <span className="text-blue-600">{selectedStand.name}</span></h2>
              <button className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors">
                <FiPlus size={20} />
                Add Menu Item
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {menusForSelectedStand.length > 0 ? (
                menusForSelectedStand.map(menu => <MenuCard key={menu.id} menu={menu} />)
              ) : (
                <p className="text-gray-500 lg:col-span-2">No menu items found for this stand.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StandsAndMenuPage;