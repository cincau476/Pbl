// src/pages/SystemSettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { getSystemSettings, updateSystemSettings } from '../utils/api';

const SystemSettingsPage = () => {
  const [settings, setSettings] = useState({
    open_time: '07:00',
    close_time: '16:00',
    center_latitude: 1.1187, // Default contoh (Batam)
    center_longitude: 104.0485,
    max_radius_meters: 500,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getSystemSettings();
        if (response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error("Gagal memuat pengaturan sistem:", error);
        setMessage({ type: 'error', text: 'Gagal memuat pengaturan dari server.' });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await updateSystemSettings(settings);
      setMessage({ type: 'success', text: 'Pengaturan ABAC berhasil diperbarui!' });
    } catch (error) {
      console.error("Gagal menyimpan pengaturan:", error);
      setMessage({ type: 'error', text: 'Gagal menyimpan pengaturan.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Memuat pengaturan...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pengaturan Sistem (ABAC)</h1>
      
      {message.text && (
        <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
        
        {/* --- Pengaturan Waktu --- */}
        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Jam Operasional Kantin</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jam Buka (WIB)</label>
            <input 
              type="time" 
              name="open_time" 
              value={settings.open_time} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jam Tutup (WIB)</label>
            <input 
              type="time" 
              name="close_time" 
              value={settings.close_time} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* --- Pengaturan Lokasi --- */}
        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Batasan Lokasi (Geofencing)</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude Pusat</label>
            <input 
              type="number" 
              step="any"
              name="center_latitude" 
              value={settings.center_latitude} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude Pusat</label>
            <input 
              type="number" 
              step="any"
              name="center_longitude" 
              value={settings.center_longitude} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">Radius Maksimal (Meter)</label>
          <input 
            type="number" 
            name="max_radius_meters" 
            value={settings.max_radius_meters} 
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="10"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Pembeli hanya bisa memesan jika berada di dalam radius ini dari titik pusat.</p>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default SystemSettingsPage;
