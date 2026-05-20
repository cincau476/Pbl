// src/components/ProtectedAdminRoute.jsx
import { useEffect, useState } from 'react';
import * as api from '../utils/api.jsx';

// Gunakan URL App Utama secara dinamis
const MAIN_APP_URL = import.meta.env.VITE_MAIN_APP_URL  ;

const ProtectedAdminRoute = ({ children }) => {
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const data = await api.checkAuth();

        if (data?.user?.role !== 'admin') {
          throw new Error('Not admin');
        }

        setIsAllowed(true);
      } catch {
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('user');
        window.location.href = `${MAIN_APP_URL}/login`;
      }
    };

    verify();
  }, []);

  if (isAllowed === null) {
    return <div className="flex justify-center items-center h-screen font-bold text-gray-500">Mengecek otorisasi keamanan...</div>;
  }

  return isAllowed ? children : null;
};

export default ProtectedAdminRoute;