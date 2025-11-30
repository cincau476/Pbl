// src/App.jsx

import React, { useState, useEffect } from 'react'; 
import Sidebar from './components/Sidebar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AccountsPage from './pages/AccountsPage.jsx';
import StandsAndMenuPage from './pages/StandsAndMenuPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import PaymentsPage from './pages/PaymentsPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
// import LoginPage from './pages/LoginPage.jsx'; // <-- HAPUS INI

import * as api from './utils/api.jsx';

// Ganti URL ini sesuai alamat frontend customer kamu
const CUSTOMER_LOGIN_URL = 'http://localhost:5173/login';

function App() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- LOGIKA PROTEKSI HALAMAN ---
  useEffect(() => {
    const verifyUser = async () => {
      try {
        // 1. Cek ke backend apakah ada session aktif
        const userData = await api.checkAuth();
        
        // 2. Jika ada, pastikan dia BUKAN customer biasa
        // (Opsional: tergantung kebutuhan, tapi biasanya customer gak boleh masuk sini)
        if (userData.user.role === 'customer') {
           throw new Error("Unauthorized access");
        }

        // 3. Jika lolos, set user
        setUser(userData.user);
      } catch (error) {
        // 4. JIKA GAGAL (Tidak login / Session habis / Bukan Admin):
        // Tendang ke halaman login Customer
        console.warn("User not authenticated, redirecting...", error);
        window.location.href = CUSTOMER_LOGIN_URL;
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, []); 

  // Fungsi Logout
  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
        try {
            await api.logout();
            // Setelah logout sukses, lempar balik ke login customer
            window.location.href = CUSTOMER_LOGIN_URL;
        } catch (err) {
            console.error("Logout error:", err);
            // Tetap lempar meski error (safety net)
            window.location.href = CUSTOMER_LOGIN_URL;
        }
    }
  };
  
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

  // Tampilkan loading kosong saat sedang mengecek ke backend
  // (Supaya user tidak melihat dashboard sekilas sebelum ditendang)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 font-semibold animate-pulse">Memeriksa akses...</p>
      </div>
    );
  }

  // Jika lolos loading tapi user tetap null (seharusnya sudah di-redirect di useEffect),
  // return null agar layar blank sebentar sebelum pindah halaman.
  if (!user) return null;

  // Jika User Ada & Valid, tampilkan Dashboard
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar}
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout} 
        user={user} 
      />
      {renderActivePage()}
    </div>
  );
}

export default App;