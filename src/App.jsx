// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar.jsx';
import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx';

import DashboardPage from './pages/DashboardPage.jsx';
import AccountsPage from './pages/AccountsPage.jsx';
import StandsAndMenuPage from './pages/StandsAndMenuPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import PaymentsPage from './pages/PaymentsPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';

import * as api from './utils/api.jsx';

const LOGIN_URL = 'https://www.kantinku.com/login';

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const handleLogout = async () => {
    if (!window.confirm('Apakah Anda yakin ingin keluar?')) return;

    try {
      await api.logout();
    } catch (err) {
      console.warn('Logout gagal di server, lanjut logout lokal');
    } finally {
      sessionStorage.removeItem('admin_token');
      window.location.href = LOGIN_URL;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">

      {/* SIDEBAR */}
      <Sidebar
        onLogout={handleLogout}
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />

      {/* MAIN CONTENT */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? 'lg:pl-64' : 'lg:pl-20'
        }`}
      >
        <main className="flex-1 w-full pb-10">
          <Routes>

            <Route
              path="/"
              element={
                <ProtectedAdminRoute>
                  <DashboardPage />
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/accounts"
              element={
                <ProtectedAdminRoute>
                  <AccountsPage />
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/stands"
              element={
                <ProtectedAdminRoute>
                  <StandsAndMenuPage />
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedAdminRoute>
                  <OrdersPage />
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/payments"
              element={
                <ProtectedAdminRoute>
                  <PaymentsPage />
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/reports"
              element={
                <ProtectedAdminRoute>
                  <ReportsPage />
                </ProtectedAdminRoute>
              }
            />

          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
