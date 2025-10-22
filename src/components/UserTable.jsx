// src/components/UserTable.jsx

import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

// Komponen kecil yang bisa digunakan kembali untuk badge peran (role)
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

const UserTable = ({ users }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">User Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Role</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Phone</th>
              <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    {user.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-6 py-4 text-blue-600 underline cursor-pointer">{user.email}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-4">
                    <button className="flex items-center gap-1 text-blue-600 hover:underline">
                      <FiEdit size={16}/> Edit
                    </button>
                    <button className="flex items-center gap-1 text-red-600 hover:underline">
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

export default UserTable;