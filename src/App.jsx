// src/App.jsx

import React, { useState, useEffect } from 'react'; 
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AccountsPage from './pages/AccountsPage.jsx';
import StandsAndMenuPage from './pages/StandsAndMenuPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import PaymentsPage from './pages/PaymentsPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import * as api from './utils/api.jsx';

// URL Produksi untuk redirect jika tidak login
const CUSTOMER_LOGIN_URL = 'https://www.kantinku.com/login';

function App() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const userData = await api.checkAuth();
        if (userData.user.role === 'customer') {
           throw new Error("Unauthorized access");
        }
        setUser(userData.user);
      } catch (error) {
        console.warn("Redirecting to login...", error);
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
  
  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);

  const renderActivePage = () => {
    if (activePage === 'accounts') return <AccountsPage />;
    if (activePage === 'stands') return <StandsAndMenuPage />;
    if (activePage === 'orders') return <OrdersPage />;
    if (activePage === 'payments') return <PaymentsPage />;
    if (activePage === 'reports') return <ReportsPage />;
    return <DashboardPage />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 font-semibold animate-pulse">Memeriksa akses...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <Router basename="/admin">
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={toggleSidebar}
          activePage={activePage}
          setActivePage={setActivePage}
          onLogout={handleLogout} 
          user={user} 
        />
        <div className="flex-1 overflow-auto">
          {renderActivePage()}
        </div>
      </div>
    </Router>
  );
}

export default App;
