// src/components/UserTable.jsx

import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

/**
 * RoleBadge Component
 * Menampilkan label peran dengan warna yang berbeda-beda.
 */
const RoleBadge = ({ role }) => {
  const roleColors = {
    Admin: 'bg-blue-100 text-blue-700 border border-blue-200',
    Seller: 'bg-orange-100 text-orange-700 border border-orange-200',
    Cashier: 'bg-green-100 text-green-700 border border-green-200',
  };
  return (
    <span className={`px-3 py-1 text-[10px] md:text-xs font-bold uppercase rounded-full ${roleColors[role] || 'bg-gray-100 text-gray-700'}`}>
      {role}
    </span>
  );
};

const UserTable = ({ users, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Manajemen Pengguna</h2>
        <span className="text-xs text-gray-500 font-medium">{users.length} Total Akun</span>
      </div>

      {/* PENTING: 'overflow-x-auto' memastikan tabel bisa di-scroll di iPhone 14/15 Pro 
          sehingga struktur dashboard tidak pecah. 
      */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
            <tr>
              <th scope="col" className="px-6 py-4 font-bold">Username</th>
              <th scope="col" className="px-6 py-4 font-bold">Role</th>
              <th scope="col" className="px-6 py-4 font-bold">Email</th>
              <th scope="col" className="px-6 py-4 font-bold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="bg-white hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{user.username}</span>
                        <span className="text-[10px] text-gray-400 font-mono">ID: #{user.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer text-xs font-medium">
                      {user.email || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-3">
                      {/* Tombol Edit */}
                      <button
                        onClick={() => onEdit && onEdit(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit User"
                      >
                        <FiEdit size={18} />
                      </button>
                      {/* Tombol Delete */}
                      <button 
                        onClick={() => onDelete && onDelete(user.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Hapus User"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-gray-400 italic">
                  Tidak ada data pengguna ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer info khusus mobile */}
      <div className="lg:hidden p-3 bg-gray-50 text-[10px] text-center text-gray-400 uppercase tracking-widest">
        Geser tabel ke samping untuk melihat aksi
      </div>
    </div>
  );
};

export default UserTable;