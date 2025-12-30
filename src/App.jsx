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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

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

  if (isLoading) return null;

  return (
    <Router basename="/admin">
      {/* Container utama: bg-gray-50 untuk warna dasar abu muda */}
      <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
        
        {/* Sidebar: Fixed position, tidak ikut scroll */}
        <Sidebar 
          onLogout={handleLogout} 
          isExpanded={isSidebarExpanded} 
          setIsExpanded={setIsSidebarExpanded} 
        />
        
        {/* WRAPPER KONTEN: 
           1. padding-left (pl) dinamis: Mendorong konten ke kanan agar tidak tertumpuk sidebar.
           2. transition-all: Animasi halus saat sidebar buka/tutup.
        */}
        <div 
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
            isSidebarExpanded ? 'lg:pl-64' : 'lg:pl-20'
          }`}
        >
          {/* MAIN AREA: 
             PENTING: Tidak ada padding (p-*) di sini! 
             Ini agar Header Putih di DashboardPage bisa menempel penuh ke tepi.
          */}
          <main className="flex-1 w-full pb-10">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/stands" element={<StandsAndMenuPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
