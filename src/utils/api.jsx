// src/api.jsx

const API_BASE_URL = 'http://127.0.0.1:8000'; // Sesuai file Anda

// --- Helper Baru: Ambil token dari localStorage ---
const getAuthToken = () => {
  return localStorage.getItem('authToken');
}

// Fungsi helper untuk request (Dimodifikasi)
async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();

    const headers = {
        // Hapus 'Content-Type' untuk FormData, browser akan mengaturnya
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    const config = {
        ...options,
        headers,
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
            // Coba ambil 'detail' atau 'message' atau serialisasi error
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
export const getAllOrders = () => request('/api/orders/all/');

// --- PERUBAHAN ---
// Menggunakan orderUuid (string) sesuai dengan backend, bukan orderPk (integer)
export const confirmCashPayment = (orderUuid) => request(`/api/orders/${orderUuid}/confirm-cash/`, { method: 'POST' });
// --- AKHIR PERUBAHAN ---