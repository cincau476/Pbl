// src/pages/AccountsPage.jsx

import React, { useState, useEffect } from 'react';
import * as api from '../utils/api.jsx'; 
// 1. IMPORT UserTable dari komponen luar
import UserTable from '../components/UserTable.jsx'; 

// Ikon-ikon header tetap di sini (atau bisa dipindah ke file terpisah jika mau)
const FiSearch = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const FiPlus = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const FiBell = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);
const FiUser = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

// --- NOTE: Hapus RoleBadge lokal ---
// --- NOTE: Hapus definisi UserTable lokal (yang lama) ---

// Komponen Modal tetap di sini (karena tidak ada di UserTable.jsx)
const UserFormModal = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    email: initialData?.email || '',
    password: '',
    role: initialData?.role || 'Cashier',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    if (initialData && !formData.password) {
      delete dataToSave.password;
    }
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{initialData ? 'Edit User' : 'Add New User'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={initialData ? "New Password (optional)" : "Password"} required={!initialData} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="Cashier">Cashier</option>
              <option value="Seller">Seller</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, count, description, borderColor }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${borderColor}`}>
      <h3 className="text-gray-500 font-medium">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 my-1">{count}</p>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
};

const AccountsPage = () => {
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [usersResponse, summaryResponse] = await Promise.all([
          api.getUsers(),       
          api.getUsersSummary() 
        ]);
        setUsers(usersResponse);
        setSummary(summaryResponse);
      } catch (err) {
        console.error("Gagal mengambil data akun:", err);
        setError(`Tidak dapat memuat data: ${err.message}`); 
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.deleteUser(userId); 
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        console.error("Gagal menghapus pengguna:", err);
        alert(`Failed to delete user: ${err.message}`);
      }
    }
  };
  
  const handleSaveUser = async (formData) => {
    if (editingUser) {
      // MODE EDIT
      try {
        const response = await api.updateUser(editingUser.id, formData); 
        setUsers(users.map(user => user.id === editingUser.id ? response : user));
        setIsModalOpen(false);
        setEditingUser(null);
      } catch (err) {
        console.error("Gagal mengupdate pengguna:", err);
        alert(`Gagal update: ${err.message}`);
      }
    } else {
      // MODE BUAT BARU
      try {
        const response = await api.addUser(formData); 
        setUsers([...users, response]);
        setIsModalOpen(false);
      } catch (err) {
        console.error("Gagal menambah pengguna:", err);
        alert(`Gagal menyimpan: ${err.message}`);
      }
    }
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };
  
  const handleOpenAddModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };
  
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex-1 flex flex-col h-screen">
        <header className="bg-white p-4 border-b border-gray-200 h-18 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Accounts</h1>
        </header>
        <main className="flex-1 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500 animate-pulse font-medium">Loading data...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header Halaman */}
      <header className="bg-white p-4 border-b border-gray-200 h-18 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Accounts</h1>
        <div className="flex items-center gap-4">
          <button className="relative text-gray-600 hover:text-gray-800 transition-colors">
            <FiBell size={22} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
            <FiUser size={18} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        
        {/* Search & Add Button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/3">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="text-gray-400" />
            </span>
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleOpenAddModal}
            className="w-full md:w-auto bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-sm hover:shadow-md">
            <FiPlus size={20} />
            Add New User
          </button>
        </div>
        
        {/* Modal Form */}
        {isModalOpen && (
          <UserFormModal
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveUser}
            initialData={editingUser}
          />
        )}  

        {/* Tabel User (Menggunakan Komponen Impor) */}
        <UserTable users={filteredUsers} onDelete={handleDeleteUser} onEdit={handleOpenEditModal} />

        {/* Kartu Ringkasan (Summary) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summary && (
            <>
              <SummaryCard 
                title="Admins" 
                count={summary.admins.count} 
                description={summary.admins.description || "System Administrators"}
                borderColor="border-blue-500" 
              />
              <SummaryCard 
                title="Sellers" 
                count={summary.sellers.count} 
                description={summary.sellers.description || "Food Tenant Owners"}
                borderColor="border-orange-500" 
              />
              <SummaryCard 
                title="Cashiers" 
                count={summary.cashiers.count} 
                description={summary.cashiers.description || "Payment Processors"}
                borderColor="border-green-500" 
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AccountsPage;
