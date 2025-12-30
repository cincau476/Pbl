// src/utils/api.jsx

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fungsi helper untuk request (SUDAH DIPERBAIKI: Handle Params)
async function request(endpoint, options = {}) {
    let url = `${API_BASE_URL}${endpoint}`;

    // --- PERBAIKAN: Handle Query Params manual untuk fetch ---
    // Fetch tidak otomatis membaca 'params', jadi kita konversi ke query string
    if (options.params) {
        const queryString = new URLSearchParams(options.params).toString();
        url += `?${queryString}`;
        // Hapus params dari options agar tidak dikirim ke config fetch
        delete options.params;
    }
    // ---------------------------------------------------------

    const headers = {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
    };

    const config = {
        ...options,
        headers,
        credentials: 'include', // Penting untuk cookie session
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

// PERBAIKAN PENTING DI SINI:
// 1. Tambahkan '/api' di depan
// 2. 'params' sekarang akan diproses oleh fungsi request di atas
export const getAllOrders = (params) => {
  return request('/orders/all/', { params }); 
};

// PERBAIKAN URL: Tambahkan '/orders' di tengah
export const confirmCashPayment = (orderUuid) => request(`/orders/${orderUuid}/confirm-cash/`, { method: 'POST' });

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

export const checkAuth = () => request('/users/check-auth/'); // Pastikan endpoint ini benar di backend (biasanya check-auth atau user info)
