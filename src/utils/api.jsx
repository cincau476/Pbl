// src/utils/api.jsx
import { getClientLocation } from './geoUtils';

const API_BASE_URL = "/api";
const MAIN_APP_URL = window.location.origin;

// 1. FUNGSI UTILITAS CSRF TOKEN (Tetap sama...)
function getCookie(name) { /* ... */ }

// 2. STATE UNTUK MUTEX LOCK (Tetap sama...)
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => { /* ... */ };

// ==========================================
// 3. CORE REQUEST ENGINE (INTEGRASI ABAC)
// ==========================================
async function request(endpoint, options = {}) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    let url = `${API_BASE_URL}${cleanEndpoint}`;

    if (options.params) {
        const params = new URLSearchParams();
        Object.entries(options.params).forEach(([key, val]) => {
            if (val !== undefined && val !== null) params.append(key, val);
        });
        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;
        delete options.params;
    }

    const headers = {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
    };    

    // --- OTORISASI TOKEN ---
    const accessToken = sessionStorage.getItem('admin_token');
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    if (options.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method.toUpperCase())) {
        const csrftoken = getCookie('csrftoken');
        if (csrftoken) {
            headers['X-CSRFToken'] = csrftoken;
        }
    }

    // --- PERBAIKAN 1: INJEKSI ATRIBUT ABAC (LOKASI) ---
    try {
        const location = await getClientLocation();
        if (location) {
            // Gunakan 'X-User-Latitude' sesuai dengan expected header di Django
            headers['X-User-Latitude'] = location.latitude;
            headers['X-User-Longitude'] = location.longitude;
        }
    } catch (geoError) {
        console.warn("Gagal menyisipkan atribut lokasi ABAC:", geoError);
    }
    // --------------------------------------------------

    const config = {
        ...options,
        headers,
        credentials: 'include', 
    };

    try {
        let response = await fetch(url, config);
        
        // ==========================================
        // 4. INTERCEPTOR & SILENT REFRESH LOGIC
        // ==========================================
        if (response.status === 401 && !options._retry && !url.includes('/users/token/refresh/')) {
            // ... (Logika Silent Refresh 401 Anda Tetap Sama)
            // [JANGAN DIHAPUS, BIARKAN SESUAI KODE ANDA SEBELUMNYA]
        }

        // ==========================================
        // 5. PENANGANAN RESPONSE STANDAR & ERROR 403 ABAC
        // ==========================================
        if (!response.ok) {
            let errorData;
            try { 
                errorData = await response.json(); 
            } catch { 
                throw new Error(`HTTP Error ${response.status}`); 
            }

            // --- PERBAIKAN 2: TANGKAP ERROR 403 ABAC DENY ---
            if (response.status === 403) {
                const errorMessage = errorData.detail || errorData.message || '';
                if (typeof errorMessage === 'string' && errorMessage.includes('ABAC DENY')) {
                    // Buat error object khusus agar komponen UI bisa menanganinya tanpa crash
                    const abacError = new Error(errorMessage);
                    abacError.isAbacError = true;
                    throw abacError;
                }
            }
            // ------------------------------------------------

            throw new Error(errorData.detail || errorData.message || 'API Error');
        }
        
        return response.status === 204 ? null : response.json();

    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}


// === Stand API ===
export const getStands = async () => {
    const data = await request('/tenants/stands/');
    return data?.results || data || []; 
};
export const addStand = (standData) => request('/tenants/stands/', { method: 'POST', body: JSON.stringify(standData) });
export const updateStand = (id, standData) => request(`/tenants/stands/${id}/`, { method: 'PUT', body: JSON.stringify(standData) });
export const deleteStand = (id) => request(`/tenants/stands/${id}/`, { method: 'DELETE' });

// === Menu API ===
export const getMenusForStand = (standId) => request(`/tenants/stands/${standId}/menus/`);
export const addMenuItem = (standId, menuData) => request(`/tenants/stands/${standId}/menus/`, { method: 'POST', body: menuData instanceof FormData ? menuData : JSON.stringify(menuData) });
export const updateMenuItem = (standId, menuId, menuData) => request(`/tenants/stands/${standId}/menus/${menuId}/`, { method: 'PUT', body: menuData instanceof FormData ? menuData : JSON.stringify(menuData) });
export const deleteMenuItem = (standId, menuId) => request(`/tenants/stands/${standId}/menus/${menuId}/`, { method: 'DELETE' });

// === FUNGSI UNTUK ORDERS & REPORTS ===
export const getReportsSummary = () => request('/orders/reports/summary/');

export const getAllOrders = async (params) => {
    const data = await request('/orders/all/', { params });
    return data?.results || data || [];
};

export const confirmCashPayment = (orderUuid) => request(`/orders/${orderUuid}/status/`, {
    method: 'POST',
    body: JSON.stringify({ status: 'PAID' })
});

// === FUNGSI UNTUK USERS ===
export const getUsers = async () => {
    const data = await request('/users/');
    return data?.results || data || [];
};
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

// === MFA SETUP ===
export const generateMfaSetup = () => request('/users/mfa/setup/generate/', { 
    method: 'POST' 
});

export const verifyMfaSetup = (otpCode) => request('/users/mfa/setup/verify/', { 
    method: 'POST', 
    body: JSON.stringify({ otp_code: otpCode }) 
});

export const getTenants = () => request('/tenants/stands/');
export const getTables = async () => {
    const data = await request('/orders/tables/');
    return data?.results || data || [];
};
export const addTable = (tableData) => request('/orders/tables/', { method: 'POST', body: JSON.stringify(tableData) });
export const deleteTable = (id) => request(`/orders/tables/${id}/`, { method: 'DELETE' });

// Helper untuk membangun URL akses QR Code langsung ke API Backend
export const getTableQrUrl = (tableCode) =>`${API_BASE_URL}/orders/tables/${tableCode}/qr/`;
export const getTakeawayQrUrl = (tenantId) =>`${API_BASE_URL}/orders/tenants/${tenantId}/takeaway-qr/`;
export const getSystemSettings = () => request('/tenants/settings/abac/');
export const updateSystemSettings = (data) => request('/tenants/settings/abac/', { 
    method: 'PUT', 
    body: JSON.stringify(data) 
});
