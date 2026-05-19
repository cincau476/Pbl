// src/utils/api.jsx

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// 1. TAMBAHAN BARU: Fungsi untuk mengambil CSRF Token dari Cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

async function request(endpoint, options = {}) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    let url = `${API_BASE_URL}${cleanEndpoint}`;

    // Handle Query Params
    if (options.params) {
        const params = new URLSearchParams();
        Object.entries(options.params).forEach(([key, val]) => {
            if (val !== undefined && val !== null) params.append(key, val);
        });
        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;
        delete options.params;
    }

    // 2. PERUBAHAN: Hapus pengambilan token dari sessionStorage
    // (Token sekarang akan otomatis dikirim oleh browser karena menggunakan HttpOnly Cookie)

    const headers = {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
    };    

    // 3. TAMBAHAN BARU: Sisipkan CSRF Token untuk request yang memodifikasi data (Standar Keamanan Django)
    if (options.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method.toUpperCase())) {
        const csrftoken = getCookie('csrftoken');
        if (csrftoken) {
            headers['X-CSRFToken'] = csrftoken;
        }
    }

    const config = {
        ...options,
        headers,
        credentials: 'include', // Ini kunci utama agar Cookie dikirim ke Backend
    };

    try {
        const response = await fetch(url, config);
        
        // 4. TAMBAHAN BARU: Penanganan Global Error 401 (Sesi Habis / Ditolak)
        if (response.status === 401) {
            console.warn("Sesi tidak valid atau expired. Mengarahkan ke login...");
            sessionStorage.removeItem('admin_token'); // Membersihkan sisa token lama jika masih ada
            window.location.href = import.meta.env.VITE_LOGIN_URL || '/login';
            return null; // Hentikan eksekusi
        }

        if (!response.ok) {
            let errorData;
            try { errorData = await response.json(); } 
            catch { throw new Error(`HTTP Error ${response.status}`); }
            throw new Error(errorData.detail || errorData.message || 'API Error');
        }
        return response.status === 204 ? null : response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// === Stand API ===
export const getStands = () => request('/tenants/stands/');
export const addStand = (standData) => request('/tenants/stands/', { method: 'POST', body: standData });
export const updateStand = (id, standData) => request(`/tenants/stands/${id}/`, { method: 'PUT', body: standData });
export const deleteStand = (id) => request(`/tenants/stands/${id}/`, { method: 'DELETE' });

// === Menu API ===
export const getMenusForStand = (standId) => request(`/tenants/stands/${standId}/menus/`);
export const addMenuItem = (standId, menuData) => request(`/tenants/stands/${standId}/menus/`, { method: 'POST', body: menuData });
export const updateMenuItem = (standId, menuId, menuData) => request(`/tenants/stands/${standId}/menus/${menuId}/`, { method: 'PUT', body: menuData });
export const deleteMenuItem = (standId, menuId) => request(`/tenants/stands/${standId}/menus/${menuId}/`, { method: 'DELETE' });

// === FUNGSI UNTUK ORDERS & REPORTS ===
export const getReportsSummary = () => request('/orders/reports/summary/'); // Pastikan URL ini sesuai backend

export const getAllOrders = (params) => {
  return request('/orders/all/', { params }); 
};

export const confirmCashPayment = (orderUuid) => {
  return request(`/orders/${orderUuid}/status/`, {
    method: 'POST',
    body: JSON.stringify({ status: 'PAID' })
  });
};

// === FUNGSI UNTUK USERS ===
export const getUsers = () => request('/users/');
export const getUsersSummary = () => request('/users/summary/');
export const addUser = (userData) => request('/users/', { method: 'POST', body: JSON.stringify(userData) });
export const updateUser = (userId, userData) => request(`/users/${userId}/`, { method: 'PATCH', body: JSON.stringify(userData) });
export const deleteUser = (userId) => request(`/users/${userId}/`, { method: 'DELETE' });

// === AUTH ===
export const login = (username, password) => request('/users/login/', { 
    method: 'POST', 
    body: JSON.stringify({ username, password }) 
});

export const logout = () => request('/users/logout/', { 
    method: 'POST' 
});

export const checkAuth = () => request('/users/check-auth/');