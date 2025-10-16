import React, { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiBell, FiUser } from 'react-icons/fi';
import StandCard from '../components/StandCard.jsx';
import MenuCard from '../components/MenuCard.jsx';
import StandModal from '../components/StandModal.jsx';
import MenuModal from '../components/MenuModal.jsx';
import * as api from '../utils/api';

const StandsAndMenuPage = () => {
  const [stands, setStands] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedStand, setSelectedStand] = useState(null);
  const [loadingStands, setLoadingStands] = useState(true);
  const [loadingMenus, setLoadingMenus] = useState(false);
  const [error, setError] = useState(null);
  const [isStandModalOpen, setStandModalOpen] = useState(false);
  const [isMenuModalOpen, setMenuModalOpen] = useState(false);
  const [editingStand, setEditingStand] = useState(null);
  const [editingMenu, setEditingMenu] = useState(null);

  const fetchStands = useCallback(async () => {
    setLoadingStands(true);
    try {
      const data = await api.getStands();
      setStands(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingStands(false);
    }
  }, []);

  useEffect(() => {
    fetchStands();
  }, [fetchStands]);

  const handleSelectStand = useCallback(async (stand) => {
    if (selectedStand?.id === stand.id) {
      setSelectedStand(null);
      setMenus([]);
      return;
    }
    setSelectedStand(stand);
    setLoadingMenus(true);
    setMenus([]);
    try {
      const data = await api.getMenusForStand(stand.id);
      setMenus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMenus(false);
    }
  }, [selectedStand]);

  const handleSaveStand = async (formData) => {
    try {
      if (editingStand) {
        await api.updateStand(editingStand.id, formData);
      } else {
        await api.addStand(formData);
      }
      fetchStands();
    } catch (err) {
      setError(err.message);
    } finally {
      setStandModalOpen(false);
      setEditingStand(null);
    }
  };

  const handleDeleteStand = async (standId) => {
    try {
      await api.deleteStand(standId);
      setStands(stands.filter(s => s.id !== standId));
      if(selectedStand?.id === standId) {
        setSelectedStand(null);
        setMenus([]);
      }
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleSaveMenu = async (formData) => {
    try {
        if (editingMenu) {
            if (!formData.has('available')) {
               formData.append('available', editingMenu.available);
            }
            await api.updateMenuItem(selectedStand.id, editingMenu.id, formData);
        } else {
            await api.addMenuItem(selectedStand.id, formData);
        }
        handleSelectStand(selectedStand);
    } catch (err) {
        setError(err.message);
    } finally {
        setMenuModalOpen(false);
        setEditingMenu(null);
    }
  };
  
  const handleDeleteMenu = async (menuId) => {
      try {
          await api.deleteMenuItem(selectedStand.id, menuId);
          setMenus(menus.filter(m => m.id !== menuId));
      } catch (err) {
          setError(err.message);
      }
  }

  const handleMenuAvailabilityChange = async (menuId, newAvailability) => {
      const menuToUpdate = menus.find(m => m.id === menuId);
      if (!menuToUpdate) return;
      
      const updatedData = { ...menuToUpdate, available: newAvailability };
      
      // Kirim sebagai JSON karena tidak ada file
      const payload = {
          name: updatedData.name,
          description: updatedData.description,
          price: updatedData.price,
          stock: updatedData.stock,
          available: updatedData.available,
      };

      try {
          await api.updateMenuItem(selectedStand.id, menuId, JSON.stringify(payload), { 'Content-Type': 'application/json' });
          setMenus(menus.map(m => m.id === menuId ? {...m, available: newAvailability} : m));
      } catch(err) {
          setError(err.message);
      }
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
       <header className="bg-white p-4 border-b border-gray-200 h-18 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Stands & Menu</h1>
            <div className="flex items-center gap-4"> <FiBell size={22} /> <FiUser size={22} /> </div>
        </header>

      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Stand Management</h2>
            <button onClick={() => { setEditingStand(null); setStandModalOpen(true); }} className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600">
              <FiPlus size={20} /> Add New Stand
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingStands ? <p>Loading...</p> : stands.map(stand => (
              <StandCard 
                key={stand.id} 
                stand={stand} 
                onSelect={handleSelectStand}
                isSelected={selectedStand?.id === stand.id}
                onEdit={setEditingStand}
                onDelete={handleDeleteStand}
              />
            ))}
          </div>
        </div>

        {selectedStand && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Menu for <span className="text-blue-600">{selectedStand.name}</span></h2>
              <button onClick={() => { setEditingMenu(null); setMenuModalOpen(true); }} className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600">
                <FiPlus size={20} /> Add Menu Item
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {loadingMenus ? <p>Loading...</p> : menus.length > 0 ? (
                menus.map(menu => <MenuCard 
                    key={menu.id} 
                    menu={{...menu, price: parseFloat(menu.price), standName: selectedStand.name}}
                    onAvailabilityChange={handleMenuAvailabilityChange}
                    onEdit={setEditingMenu}
                    onDelete={handleDeleteMenu}
                    />)
              ) : (
                <p className="text-gray-500 lg:col-span-2">No menu items for this stand.</p>
              )}
            </div>
          </div>
        )}
      </main>
      
      <StandModal 
        isOpen={isStandModalOpen || !!editingStand} 
        onClose={() => { setStandModalOpen(false); setEditingStand(null); }}
        onSave={handleSaveStand}
        stand={editingStand}
      />
      <MenuModal
        isOpen={isMenuModalOpen || !!editingMenu}
        onClose={() => { setMenuModalOpen(false); setEditingMenu(null); }}
        onSave={handleSaveMenu}
        menu={editingMenu}
      />
    </div>
  );
};

export default StandsAndMenuPage;