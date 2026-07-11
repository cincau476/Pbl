// src/utils/api.jsx

const API_BASE_URL = "/api" ;

// Rute dinamis untuk kembali ke aplikasi utama (User/Login App)
const MAIN_APP_URL = window.location.origin;

// ==========================================
// 1. FUNGSI UTILITAS CSRF TOKEN
// ==========================================
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

// ==========================================
// 2. STATE UNTUK MUTEX LOCK (MENCEGAH RACE CONDITION)
// ==========================================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// ==========================================
// 3. CORE REQUEST ENGINE
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

    // PERBAIKAN: Ambil dari sessionStorage dengan nama 'admin_token' (Klop dengan LoginPage)
    const accessToken = sessionStorage.getItem('access_token');
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    if (options.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method.toUpperCase())) {
        const csrftoken = getCookie('csrftoken');
        if (csrftoken) {
            headers['X-CSRFToken'] = csrftoken;
        }
    }

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
            
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(newToken => {
                    options.headers = options.headers || {};
                    options.headers['Authorization'] = `Bearer ${newToken}`;
                    return request(endpoint, options);
                }).catch(err => Promise.reject(err));
            }

            options._retry = true;
            isRefreshing = true;

            try {
                const refreshRes = await fetch(`${API_BASE_URL}/users/token/refresh/`, {
                    method: 'POST',
                    credentials: 'include', 
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                });

                if (!refreshRes.ok) {
                    throw new Error('Gagal memperbarui sesi.');
                }

                const refreshData = await refreshRes.json();
                const newAccessToken = refreshData.access;
                
                // PERBAIKAN: Simpan token baru ke sessionStorage 'admin_token'
                sessionStorage.setItem('access_token', newAccessToken);

                options.headers['Authorization'] = `Bearer ${newAccessToken}`;
                
                processQueue(null, newAccessToken);
                return request(endpoint, options);

            } catch (refreshErr) {
                processQueue(refreshErr, null);
                console.warn("Sesi tidak valid atau expired. Mengarahkan ke login...");
                // PERBAIKAN: Bersihkan session dan arahkan kembali ke app utama
                sessionStorage.removeItem('access_token'); 
                sessionStorage.removeItem('user'); 
                window.location.href = `${MAIN_APP_URL}/login`;
                return null;
            } finally {
                isRefreshing = false;
            }
        }

        // ==========================================
        // 5. PENANGANAN RESPONSE STANDAR
        // ==========================================
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

