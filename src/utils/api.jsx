// src/utils/api.jsx

// --- PERUBAHAN: Gunakan .env ---
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

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

// === Stand API ===
export const getStands = () => request('/api/stands/');
export const addStand = (standData) => request('/api/stands/', { method: 'POST', body: standData });
export const updateStand = (id, standData) => request(`/api/stands/${id}/`, { method: 'PUT', body: standData });
export const deleteStand = (id) => request(`/api/stands/${id}/`, { method: 'DELETE' });

// === Menu API ===
export const getMenusForStand = (standId) => request(`/api/stands/${standId}/menus/`);
export const addMenuItem = (standId, menuData) => request(`/api/stands/${standId}/menus/`, { method: 'POST', body: menuData });
export const updateMenuItem = (standId, menuId, menuData) => request(`/api/stands/${standId}/menus/${menuId}/`, { method: 'PUT', body: menuData });
export const deleteMenuItem = (standId, menuId) => request(`/api/stands/${standId}/menus/${menuId}/`, { method: 'DELETE' });

// === FUNGSI UNTUK ORDERS & REPORTS ===
export const getReportsSummary = () => request('/api/reports/summary/');
export const getAllOrders = () => request('/api/all/');
export const confirmCashPayment = (orderUuid) => request(`/api/${orderUuid}/confirm-cash/`, { method: 'POST' });

// === FUNGSI UNTUK USERS ===
export const getUsers = () => request('/api/users/');
export const getUsersSummary = () => request('/api/users/summary/');
export const addUser = (userData) => request('/api/users/', { method: 'POST', body: JSON.stringify(userData) });
export const updateUser = (userId, userData) => request(`/api/users/${userId}/`, { method: 'PATCH', body: JSON.stringify(userData) });
export const deleteUser = (userId) => request(`/api/users/${userId}/`, { method: 'DELETE' });

// --- PERUBAHAN: TAMBAHKAN EXPORT BARU UNTUK AUTENTIKASI ---
export const login = (username, password) => request('/api/auth/login/', { 
    method: 'POST', 
    body: JSON.stringify({ username, password }) 
});

export const logout = () => request('/api/auth/logout/', { 
    method: 'POST' 
});

export const checkAuth = () => request('/api/auth/user/');