// src/App.jsx

// --- PERUBAHAN: Impor useState dan useEffect ---
import React, { useState, useEffect } from 'react'; 
import Sidebar from './components/Sidebar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AccountsPage from './pages/AccountsPage.jsx';
import StandsAndMenuPage from './pages/StandsAndMenuPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import PaymentsPage from './pages/PaymentsPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
// --- PERUBAHAN: Impor api ---
import * as api from './utils/api.jsx';

function App() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  // --- PERUBAHAN BESAR PADA LOGIKA AUTENTIKASI ---
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State untuk loading pengecekan auth

  // Cek status login (via cookie) saat aplikasi pertama kali dimuat
  useEffect(() => {
    api.checkAuth()
      .then(userData => {
        setUser(userData); // Jika berhasil, user login
      })
      .catch(() => {
        setUser(null); // Jika gagal (cookie tidak ada/valid), user tidak login
      })
      .finally(() => {
        setIsLoading(false); // Selesai loading
      });
  }, []); // [] berarti hanya jalan sekali saat mount

  // Fungsi untuk logout (dipanggil dari Sidebar)
  const handleLogout = async () => {
    // Pindahkan window.confirm ke sini agar lebih masuk akal
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
        try {
            await api.logout();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setUser(null); // Set user menjadi null (kembali ke halaman login)
        }
    }
  };
  
  // Fungsi ini dipanggil oleh LoginPage saat login berhasil
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setActivePage('dashboard'); // Arahkan ke dashboard setelah login
  };
  // --- AKHIR PERUBAHAN BESAR ---

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

  // --- LOGIKA RENDER BARU ---
  
  // Tampilkan loading saat sedang mengecek auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // Jika tidak loading DAN user tidak ada (null), tampilkan LoginPage
  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }
  
  // --- AKHIR LOGIKA RENDER BARU ---

  // Jika user ada, tampilkan aplikasi utama
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar}
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout} // <-- PERUBAHAN: Kirim fungsi logout
        user={user} // <-- PERUBAHAN: Kirim data user
      />
      {renderActivePage()}
    </div>
  );
}

export default App;