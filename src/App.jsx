// src/App.jsx
import React, { useState, useEffect } from 'react'; 
// PERBAIKAN 1: Hapus 'BrowserRouter as Router' dari import
import { Routes, Route } from 'react-router-dom';
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
      // AMBIL TOKEN DARI URL JIKA ADA
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get('token');
  
      if (tokenFromUrl) {
        // Simpan ke sessionStorage agar dibaca oleh api.jsx
        sessionStorage.setItem('admin_token', tokenFromUrl);
        // Bersihkan URL agar token tidak terlihat lagi di address bar
        window.history.replaceState({}, document.title, window.location.pathname);
      }
  
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

  // PERBAIKAN 2: Hapus pembungkus <Router> di sini.
  // Langsung return <div> container utamanya.
  return (
      <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
        
        <Sidebar 
          onLogout={handleLogout} 
          isExpanded={isSidebarExpanded} 
          setIsExpanded={setIsSidebarExpanded} 
        />
        
        <div 
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
            isSidebarExpanded ? 'lg:pl-64' : 'lg:pl-20'
          }`}
        >
          <main className="flex-1 w-full pb-10">
            {/* Routes tetap di sini, tapi Router-nya sudah dihandle main.jsx */}
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
  );
}

export default App;
