// src/components/UserFormModal.jsx
import React, { useState } from 'react';

const UserFormModal = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    email: initialData?.email || '',
    password: '',
    role: initialData?.role || 'Cashier', // Default role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Untuk mode edit, kita mungkin tidak mau mengirim password kosong
    const dataToSave = { ...formData };
    if (initialData && !formData.password) {
      delete dataToSave.password;
    }
    
    if (initialData) {
      onSave(initialData.id, dataToSave);
    } else {
      onSave(dataToSave);
    }
  };

  // Tampilan modal bisa dibuat dengan styling Tailwind CSS
  // Ini adalah contoh struktur dasar
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit User' : 'Add New User'}</h2>
        <form onSubmit={handleSubmit}>
          {/* Input untuk username, email, password, dan role (select dropdown) */}
          <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" required className="w-full p-2 border rounded mb-2" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded mb-2" />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={initialData ? "New Password (optional)" : "Password"} className="w-full p-2 border rounded mb-2" />
          <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded mb-4">
            <option value="Cashier">Cashier</option>
            <option value="Seller">Seller</option>
            <option value="Admin">Admin</option>
          </select>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;