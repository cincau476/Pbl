// src/utils/api.jsx

// --- PERUBAHAN: Gunakan .env ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- PERUBAHAN: Hapus getAuthToken ---
// const getAuthToken = () => { ... }

// Fungsi helper untuk request (Dimodifikasi)
async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    // const token = getAuthToken(); // <-- HAPUS

    const headers = {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
    };

    // --- PERUBAHAN: Hapus blok 'if (token)' ---
    
    const config = {
        ...options,
        headers,
        credentials: 'include', // <-- PERUBAHAN: Ini penting agar 'fetch' mengirim cookie
    };

    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            let errorData;
            try {
              errorData = await response.json();
            } catch (jsonError) {
              throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
            }
            const errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
            throw new Error(errorMessage);
        }
        if (response.status === 204) {
            return null;
        }
        return response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// === Stand API (Perhatikan tambahan '/tenants') ===
export const getStands = () => request('/api/tenants/stands/');
export const addStand = (standData) => request('/api/tenants/stands/', { method: 'POST', body: standData });
export const updateStand = (id, standData) => request(`/api/tenants/stands/${id}/`, { method: 'PUT', body: standData });
export const deleteStand = (id) => request(`/api/tenants/stands/${id}/`, { method: 'DELETE' });

// === Menu API (Perhatikan tambahan '/tenants') ===
export const getMenusForStand = (standId) => request(`/api/tenants/stands/${standId}/menus/`);
export const addMenuItem = (standId, menuData) => request(`/api/tenants/stands/${standId}/menus/`, { method: 'POST', body: menuData });
export const updateMenuItem = (standId, menuId, menuData) => request(`/api/tenants/stands/${standId}/menus/${menuId}/`, { method: 'PUT', body: menuData });
export const deleteMenuItem = (standId, menuId) => request(`/api/tenants/stands/${standId}/menus/${menuId}/`, { method: 'DELETE' });

// === FUNGSI UNTUK ORDERS & REPORTS ===
export const getReportsSummary = () => request('/api/reports/summary/');
export const getAllOrders = () => request('/api/orders/');
export const confirmCashPayment = (orderUuid) => request(`/api/${orderUuid}/confirm-cash/`, { method: 'POST' });

// === FUNGSI UNTUK USERS ===
export const getUsers = () => request('/api/users/');
export const getUsersSummary = () => request('/api/users/summary/');
export const addUser = (userData) => request('/api/users/', { method: 'POST', body: JSON.stringify(userData) });
export const updateUser = (userId, userData) => request(`/api/users/${userId}/`, { method: 'PATCH', body: JSON.stringify(userData) });
export const deleteUser = (userId) => request(`/api/users/${userId}/`, { method: 'DELETE' });

// --- PERUBAHAN: TAMBAHKAN EXPORT BARU UNTUK AUTENTIKASI ---
export const login = (username, password) => request('/api/users/login/', { 
    method: 'POST', 
    body: JSON.stringify({ username, password }) 
});

export const logout = () => request('/api/users/logout/', { 
    method: 'POST' 
});

// URL INI YANG PALING PENTING UNTUK PROTEKSI
export const checkAuth = () => request('/api/users/check-auth/');