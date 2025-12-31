import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const queryParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = queryParams.get('token');

  // Jika ada token di URL (dari redirect login), simpan ke session
  if (tokenFromUrl) {
    sessionStorage.setItem('admin_token', tokenFromUrl);
    // Bersihkan URL agar token tidak terlihat
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const token = sessionStorage.getItem('admin_token');
  
  if (!token) {
    // Jika tidak ada token sama sekali, lempar ke portal login utama
    window.location.href = 'https://www.kantinku.com/login';
    return null;
  }
  
  return children;
};

export default ProtectedAdminRoute;
