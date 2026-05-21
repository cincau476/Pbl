// src/components/UserFormModal.jsx
import React, { useState } from 'react';

const UserFormModal = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    email: initialData?.email || '',
    password: '',
    role: initialData?.role || 'Cashier',
    // Tambahkan state default untuk MFA berdasarkan data user yang diedit
    is_mfa_enabled: initialData?.is_mfa_enabled || false, 
  });

  const handleChange = (e) => {
    // Ambil type dan checked untuk mendeteksi input checkbox
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dataToSave = { ...formData };
    
    // Jangan kirim password jika sedang mode edit dan field password dibiarkan kosong
    if (initialData && !formData.password) {
      delete dataToSave.password;
    }
    
    if (initialData) {
      onSave(initialData.id, dataToSave);
    } else {
      onSave(dataToSave);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {initialData ? 'Edit User' : 'Add New User'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              placeholder="Masukkan username" 
              required 
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="nama@kantinku.com" 
              required 
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {initialData && <span className="text-gray-400 font-normal">(Kosongkan jika tidak diganti)</span>}
            </label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder={initialData ? "••••••••" : "Masukkan password baru"} 
              required={!initialData} // Wajib diisi hanya saat buat user baru
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hak Akses (Role)</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange} 
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="Cashier">Cashier</option>
              <option value="Seller">Seller</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Opsi Pengaktifan MFA yang rapi dan minimalis */}
          <div className="flex items-center justify-between p-3 mt-2 bg-gray-50 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm font-semibold text-gray-800">Wajibkan MFA</p>
              <p className="text-xs text-gray-500">Minta kode OTP saat user ini login</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="is_mfa_enabled"
                checked={formData.is_mfa_enabled} 
                onChange={handleChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Save User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;