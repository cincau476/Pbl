// src/pages/AccountsPage.jsx

import React, { useState, useEffect } from 'react';
import * as api from '../utils/api.jsx'; 
import UserTable from '../components/UserTable.jsx'; 
import MfaSetupModal from '../components/MfaSetupModal.jsx';

const FiSearch = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const FiPlus = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const FiUser = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const UserFormModal = ({ onClose, onSave, initialData, availableTenants }) => {
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    email: initialData?.email || '',
    password: '',
    role: initialData?.role || 'cashier',
    is_mfa_enabled: initialData?.is_mfa_enabled || false, 
    stand_name: '', 
    existing_tenant_id: '',
  });
  
  const [sellerMode, setSellerMode] = useState('new'); 
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (validationError) setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi Password
    if (!initialData || (initialData && formData.password)) {
      const pass = formData.password;
      if (pass.length < 8) return setValidationError('Password harus minimal 8 karakter.');
      if (!/[A-Z]/.test(pass)) return setValidationError('Password harus mengandung minimal satu huruf besar (A-Z).');
      if (!/[0-9]/.test(pass)) return setValidationError('Password harus mengandung minimal satu angka (0-9).');
    }

    // MEMBANGUN DATA SECARA EKSPLISIT (ANTI ERROR 400)
    const dataToSave = {
      username: formData.username,
      email: formData.email,
      role: formData.role,
      is_mfa_enabled: formData.is_mfa_enabled
    };

    if (!initialData || formData.password) {
      dataToSave.password = formData.password;
    }

    // Hanya lampirkan data Stand jika role = Seller
    if (formData.role === 'seller' && !initialData) {
      if (sellerMode === 'new' && formData.stand_name.trim() !== '') {
        dataToSave.stand_name = formData.stand_name;
      } else if (sellerMode === 'existing' && formData.existing_tenant_id !== '') {
        dataToSave.existing_tenant_id = parseInt(formData.existing_tenant_id);
      }
    }

    // Kirim data yang sudah bersih ke API
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md animate-fadeIn">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {initialData ? 'Edit User' : 'Add New User'}
        </h2>
        
        {validationError && (
          <div className="mb-4 p-2 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">{validationError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" required className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <div>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={initialData ? "New Password (optional)" : "Password"} required={!initialData} className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationError.includes('Password') ? 'border-red-500' : 'border-gray-300'}`} />
            </div>
            
            <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="cashier">Cashier</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>

            {formData.role === 'seller' && !initialData && (
              <div className="p-3 mt-2 bg-orange-50 border border-orange-200 rounded-lg animate-fadeIn">
                <label className="block text-xs font-bold text-orange-800 uppercase tracking-wider mb-2">Penempatan Stand Kantin</label>
                
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="sellerMode" checked={sellerMode === 'new'} onChange={() => setSellerMode('new')} className="accent-orange-500" />
                    Buat Stand Baru
                  </label>
                  <label className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="sellerMode" checked={sellerMode === 'existing'} onChange={() => setSellerMode('existing')} className="accent-orange-500" />
                    Gabung Stand Lama
                  </label>
                </div>

                {sellerMode === 'new' ? (
                  <input type="text" name="stand_name" value={formData.stand_name} onChange={handleChange} placeholder="Contoh: Stand Nasi Padang" className="w-full p-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white text-sm" />
                ) : (
                  <select name="existing_tenant_id" value={formData.existing_tenant_id} onChange={handleChange} className="w-full p-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white text-sm" required>
                    <option value="">-- Pilih Stand yang Sudah Ada --</option>
                    {availableTenants.map(tenant => (
                      <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div className="flex items-center justify-between p-3 mt-2 bg-gray-50 border border-gray-200 rounded-lg">
              <div>
                <p className="text-sm font-semibold text-gray-800">Wajibkan MFA</p>
                <p className="text-xs text-gray-500">Minta kode OTP saat user ini login</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="is_mfa_enabled" checked={formData.is_mfa_enabled} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Save User</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, count, description, borderColor }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${borderColor}`}>
    <h3 className="text-gray-500 font-medium">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 my-1">{count}</p>
    <p className="text-xs text-gray-400">{description}</p>
  </div>
);

const AccountsPage = () => {
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [tenants, setTenants] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isMfaOpen, setIsMfaOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [usersResponse, summaryResponse, authResponse, tenantsResponse] = await Promise.all([
          api.getUsers(),       
          api.getUsersSummary(),
          api.checkAuth(),
          api.getTenants().catch(() => []) 
        ]);
        
        setUsers(Array.isArray(usersResponse) ? usersResponse : (usersResponse?.results || []));
        setSummary(summaryResponse);
        setTenants(Array.isArray(tenantsResponse) ? tenantsResponse : (tenantsResponse?.results || []));
        
        if (authResponse && authResponse.user) setCurrentUser(authResponse.user);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
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
        alert(`Failed to delete user: ${err.message}`);
      }
    }
  };
  
  const handleSaveUser = async (formData) => {
    if (editingUser) {
      try {
        const response = await api.updateUser(editingUser.id, formData); 
        setUsers(users.map(user => user.id === editingUser.id ? response : user));
        setIsModalOpen(false);
        setEditingUser(null);
      } catch (err) {
        alert(`Gagal update: ${err.message}`);
      }
    } else {
      try {
        const response = await api.addUser(formData); 
        setUsers([...users, response]);
        setIsModalOpen(false);
      } catch (err) {
        // PERBAIKAN UX: Munculkan error API yang asli agar mudah dilacak
        alert(`Gagal menyimpan: ${err.response?.data?.detail || err.message}`);
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
        <header className="bg-white p-4 border-b border-gray-200 h-18 flex items-center justify-between"><h1 className="text-xl font-bold text-gray-800">Accounts</h1></header>
        <main className="flex-1 flex items-center justify-center bg-gray-50"><p className="text-gray-500 animate-pulse font-medium">Loading data...</p></main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      <header className="bg-white p-4 border-b border-gray-200 h-18 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Accounts</h1>
        <div className="flex items-center gap-4">
          {currentUser && (
            <button onClick={() => setIsMfaOpen(true)} className={`flex items-center gap-2 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm border ${ currentUser.is_mfa_enabled ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' }`}>
              {currentUser.is_mfa_enabled ? '✅ MFA Aktif (Reset)' : '⚠️ Aktifkan MFA'}
            </button>
          )}
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><FiUser size={18} /></div>
        </div>
      </header>

      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/3">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><FiSearch className="text-gray-400" /></span>
            <input type="text" placeholder="Search users by name or email..." className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button onClick={handleOpenAddModal} className="w-full md:w-auto bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-sm">
            <FiPlus size={20} /> Add New User
          </button>
        </div>
        
        {isModalOpen && (
          <UserFormModal
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveUser}
            initialData={editingUser}
            availableTenants={tenants} 
          />
        )}  

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <UserTable users={filteredUsers} onDelete={handleDeleteUser} onEdit={handleOpenEditModal} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summary && (
            <>
              <SummaryCard title="Admins" count={summary.admins.count} description={summary.admins.description || "System Administrators"} borderColor="border-blue-500" />
              <SummaryCard title="Sellers" count={summary.sellers.count} description={summary.sellers.description || "Food Tenant Owners"} borderColor="border-orange-500" />
              <SummaryCard title="Cashiers" count={summary.cashiers.count} description={summary.cashiers.description || "Payment Processors"} borderColor="border-green-500" />
            </>
          )}
        </div>

        <MfaSetupModal isOpen={isMfaOpen} onClose={() => setIsMfaOpen(false)} onSuccess={() => setCurrentUser(prev => ({ ...prev, is_mfa_enabled: true }))} />
      </main>
    </div>
  );
};

export default AccountsPage;
