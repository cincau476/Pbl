// src/App.jsx

import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AccountsPage from './pages/AccountsPage.jsx';
import StandsAndMenuPage from './pages/StandsAndMenuPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import PaymentsPage from './pages/PaymentsPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx'; // 1. Impor halaman baru

function App() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const renderActivePage = () => {
    if (activePage === 'accounts') return <AccountsPage />;
    if (activePage === 'stands') return <StandsAndMenuPage />;
    if (activePage === 'orders') return <OrdersPage />;
    if (activePage === 'payments') return <PaymentsPage />;
    // 2. Tambahkan kondisi untuk halaman Reports
    if (activePage === 'reports') return <ReportsPage />;
    return <DashboardPage />;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar}
        activePage={activePage}
        setActivePage={setActivePage} 
      />
      {renderActivePage()}
    </div>
  );
}

export default App;