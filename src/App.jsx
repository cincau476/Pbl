// src/App.jsx
import React, { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AccountsPage from './pages/AccountsPage.jsx';
import StandsAndMenuPage from './pages/StandsAndMenuPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import PaymentsPage from './pages/PaymentsPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import * as api from './utils/api.jsx';

const CUSTOMER_LOGIN_URL = 'https://www.kantinku.com/login';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const userData = await api.checkAuth();
        if (userData.user.role === 'customer') throw new Error("Unauthorized");
        setUser(userData.user);
      } catch (error) {
        window.location.href = CUSTOMER_LOGIN_URL;
      } finally {
        setIsLoading(false);
      }
    };
    verifyUser();
  }, []); 

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
        try {
            await api.logout();
            window.location.href = CUSTOMER_LOGIN_URL;
        } catch (err) {
            window.location.href = CUSTOMER_LOGIN_URL;
        }
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <p className="text-orange-500 font-semibold animate-pulse">Memeriksa akses...</p>
    </div>
  );

  if (!user) return null;

  return (
    <Router basename="/admin">
      <div className="flex min-h-screen bg-gray-900 text-gray-100">
        {/* Sidebar dipanggil sekali di sini */}
        <Sidebar onLogout={handleLogout} />
        
        {/* Kontainer Konten Utama */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
            <div className="max-w-7xl mx-auto space-y-6">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/accounts" element={<AccountsPage />} />
                <Route path="/stands" element={<StandsAndMenuPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
