// src/components/ProtectedAdminRoute.jsx
import { useEffect, useState } from 'react';
import * as api from '../utils/api.jsx';

// Kita gunakan window.location.origin agar dinamis (sama seperti di App.jsx)
const MAIN_APP_URL = window.location.origin;

const ProtectedAdminRoute = ({ children }) => {
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        // --- PERBAIKAN: TANGKAP TOKEN DARI URL ---
        const params = new URLSearchParams(window.location.search);
        const tokenFromUrl = params.get('token');

        if (tokenFromUrl) {
          // Simpan token ke sessionStorage agar file api.jsx bisa menggunakannya
          sessionStorage.setItem('admin_token', tokenFromUrl);
          
          // Bersihkan token dari URL di address bar agar rapi dan aman
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        // ------------------------------------------

        // Sekarang checkAuth() akan berjalan normal karena token sudah ada di sessionStorage
        const data = await api.checkAuth();

        // Validasi role admin
        if (data?.user?.role !== 'admin') {
          throw new Error('Not admin');
        }

        setIsAllowed(true);
      } catch (err) {
        console.error("Autentikasi gagal:", err);
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('user');
        window.location.href = `${MAIN_APP_URL}/login`;
      }
    };

    verify();
  }, []);

  if (isAllowed === null) {
    return (
      <div className="flex justify-center items-center h-screen font-bold text-gray-500">
        Mengecek otorisasi keamanan...
      </div>
    );
  }

  return isAllowed ? children : null;
};

export default ProtectedAdminRoute;
