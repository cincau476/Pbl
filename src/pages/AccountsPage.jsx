// src/pages/AccountsPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ====================================================================
// === PENGGANTI REACT-ICONS (SVG INLINE) ===
// ====================================================================
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
const FiEdit = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const FiTrash2 = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

// ====================================================================
// === DEFINISI KOMPONEN-KOMPONEN YANG DIBUTUHKAN ===
// ====================================================================

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
    // Saat mode edit, jangan kirim password jika field-nya kosong
    if (initialData && !formData.password) {
      delete dataToSave.password;
    }
    // Panggil onSave dengan satu argumen (objek data)
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
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

const RoleBadge = ({ role }) => {
  const roleColors = {
    Admin: 'bg-blue-100 text-blue-700',
    Seller: 'bg-orange-100 text-orange-700',
    Cashier: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${roleColors[role] || 'bg-gray-100 text-gray-700'}`}>
      {role}
    </span>
  );
};

const UserTable = ({ users, onDelete, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Role</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {user.username}
                </td>
                <td className="px-6 py-4">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-4">
                    <button onClick={() => onEdit(user)} className="flex items-center gap-1 text-blue-600 hover:underline">
                      <FiEdit size={16}/> Edit
                    </button>
                    <button onClick={() => onDelete(user.id)} className="flex items-center gap-1 text-red-600 hover:underline">
                      <FiTrash2 size={16}/> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, count, description, borderColor }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${borderColor}`}>
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 my-1">{count}</p>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
};

// ====================================================================
// === KOMPONEN UTAMA HALAMAN AKUN ===
// ====================================================================

const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
          axios.get(`${API_BASE_URL}/users/`),
          axios.get(`${API_BASE_URL}/users/summary/`)
        ]);
        setUsers(usersResponse.data);
        setSummary(summaryResponse.data);
      } catch (err) {
        console.error("Gagal mengambil data akun:", err);
        setError("Tidak dapat memuat data. Pastikan server backend Anda berjalan.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_BASE_URL}/users/${userId}/`);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        console.error("Gagal menghapus pengguna:", err);
        alert("Failed to delete user.");
      }
    }
  };
  
  // =======================================================
  // === PERBAIKAN LOGIKA: Satu fungsi handleSaveUser ===
  // =======================================================
  const handleSaveUser = async (formData) => {
    if (editingUser) {
      // MODE EDIT: Kirim request PATCH dengan ID
      try {
        const response = await axios.patch(`${API_BASE_URL}/users/${editingUser.id}/`, formData);
        setUsers(users.map(user => user.id === editingUser.id ? response.data : user));
        setIsModalOpen(false);
        setEditingUser(null);
      } catch (err) {
        console.error("Gagal mengupdate pengguna:", err.response?.data);
        alert(`Gagal update: ${JSON.stringify(err.response?.data)}`);
      }
    } else {
      // MODE BUAT BARU: Kirim request POST
      try {
        const response = await axios.post(`${API_BASE_URL}/users/`, formData);
        setUsers([...users, response.data]);
        setIsModalOpen(false);
      } catch (err) {
        console.error("Gagal menambah pengguna:", err.response?.data);
        alert(`Gagal menyimpan: ${JSON.stringify(err.response?.data)}`);
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
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 flex flex-col h-screen">
        <header className="bg-white p-4 border-b border-gray-200 h-18 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Accounts</h1>
        </header>
        <main className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Loading data...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex-1 flex flex-col h-screen">
            <header className="bg-white p-4 border-b border-gray-200 h-18 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800">Accounts</h1>
            </header>
            <main className="flex-1 flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </main>
        </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      <header className="bg-white p-4 border-b border-gray-200 h-18 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Accounts</h1>
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
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-1/3">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="text-gray-400" />
            </span>
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleOpenAddModal}
            className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors">
            <FiPlus size={20} />
            Add New User
          </button>
        </div>
        
        {isModalOpen && (
          <UserFormModal
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveUser}
            initialData={editingUser}
          />
        )}  

        <UserTable users={filteredUsers} onDelete={handleDeleteUser} onEdit={handleOpenEditModal} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summary && (
            <>
              <SummaryCard 
                title="Admins" 
                count={summary.admins.count} 
                description={summary.admins.description}
                borderColor="border-blue-500" 
              />
              <SummaryCard 
                title="Sellers" 
                count={summary.sellers.count} 
                description={summary.sellers.description}
                borderColor="border-orange-500" 
              />
              <SummaryCard 
                title="Cashiers" 
                count={summary.cashiers.count} 
                description={summary.cashiers.description}
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

