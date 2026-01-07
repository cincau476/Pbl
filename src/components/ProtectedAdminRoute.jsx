import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import * as api from '../utils/api.jsx';

const LOGIN_URL = 'https://www.kantinku.com/login';

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
        window.location.href = LOGIN_URL;
      }
    };

    verify();
  }, []);

  if (isAllowed === null) {
    return <div className="p-10 text-center">Checking authentication...</div>;
  }

  return isAllowed ? children : null;
};

export default ProtectedAdminRoute;
