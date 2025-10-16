const API_BASE_URL = 'http://127.0.0.1:8000';

// Fungsi helper untuk request
async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        // Hapus 'Content-Type' untuk FormData, browser akan mengaturnya
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
    };

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Something went wrong');
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