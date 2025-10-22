// src/App.jsx

import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AccountsPage from './pages/AccountsPage.jsx';
import StandsAndMenuPage from './pages/StandsAndMenuPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import PaymentsPage from './pages/PaymentsPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import LoginPage from './pages/LoginPage.jsx'; // <-- 1. Impor halaman login

function App() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  // --- TAMBAHAN ---
  // 2. Cek status login saat app pertama kali dimuat
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

  // 3. Buat fungsi logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    // Kita tidak perlu reload, React akan otomatis me-render ulang
  };
  // --- AKHIR TAMBAHAN ---

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const renderActivePage = () => {
    if (activePage === 'accounts') return <AccountsPage />;
    if (activePage === 'stands') return <StandsAndMenuPage />;
    if (activePage === 'orders') return <OrdersPage />;
    if (activePage === 'payments') return <PaymentsPage />;
    if (activePage === 'reports') return <ReportsPage />;
    return <DashboardPage />;
  };

  // --- TAMBAHAN ---
  // 4. Jika belum login, tampilkan halaman Login
  if (!isAuthenticated) {
    // LoginPage akan menangani login dan me-reload halaman,
    // yang akan membuat 'isAuthenticated' menjadi true pada muatan berikutnya.
    return <LoginPage />;
  }
  // --- AKHIR TAMBAHAN ---

  // 5. Jika sudah login, tampilkan aplikasi utama
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar}
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout} // <-- 6. Kirim fungsi logout ke Sidebar
      />
      {renderActivePage()}
    </div>
  );
}

export default App;