import React, { useState, useEffect, useRef } from 'react';
import { FiSave, FiMapPin, FiClock, FiAlertCircle } from 'react-icons/fi';
import { getSystemSettings, updateSystemSettings } from '../utils/api';
// Import komponen peta
import { MapContainer, TileLayer, Marker, useMapEvents, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix untuk icon marker Leaflet di React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Komponen untuk menangkap event klik di Map
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position.lat !== 0 ? (
    <Marker position={position}></Marker>
  ) : null;
}

export default function AbacSettings() {
  const [settings, setSettings] = useState({
    open_hour: 7,
    close_hour: 16,
    canteen_lat: 1.1187, // Default Batam Center
    canteen_lon: 104.0485,
    max_radius_meters: 100
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const data = await getSystemSettings();
      setSettings({
        ...data,
        canteen_lat: data.canteen_lat || 1.1187,
        canteen_lon: data.canteen_lon || 104.0485
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal mengambil pengaturan sistem.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: parseFloat(value) || parseInt(value, 10) || 0
    }));
  };

  // Fungsi untuk update posisi dari Map
  const handleMapClick = (latlng) => {
    setSettings((prev) => ({
      ...prev,
      canteen_lat: latlng.lat,
      canteen_lon: latlng.lng
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await updateSystemSettings(settings);
      setMessage({ type: 'success', text: 'Pengaturan berhasil disimpan!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Gagal menyimpan pengaturan.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 text-orange-500 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const mapCenter = [settings.canteen_lat, settings.canteen_lon];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Pengaturan ABAC</h2>
        <p className="text-sm text-gray-500">Sistem Operasional Kantin</p>
      </div>

      {message.text && (
        <div className={`mx-5 mt-5 p-3 rounded-lg flex items-start gap-2 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <FiAlertCircle className="text-lg shrink-0 mt-0.5" />
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-5 flex-1 flex flex-col">
        {/* Waktu Operasional */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 text-orange-500">
            <FiClock />
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wider">Jam Operasional</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Buka (0-23)</label>
              <input type="number" name="open_hour" min="0" max="23" value={settings.open_hour} onChange={handleChange} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm dark:text-white" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tutup (0-23)</label>
              <input type="number" name="close_hour" min="0" max="23" value={settings.close_hour} onChange={handleChange} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm dark:text-white" required />
            </div>
          </div>
        </div>

        {/* Lokasi Kantin */}
        <div className="mb-6 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-orange-500">
            <FiMapPin />
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wider">Pilih Titik Lokasi Kantin</h3>
          </div>
          
          <p className="text-xs text-gray-500 mb-3">Klik pada peta untuk memindahkan pin lokasi kantin.</p>
          
          {/* Peta Interaktif */}
          <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-4 z-0 relative">
            <MapContainer center={mapCenter} zoom={15} style={{ height: '100%', width: '100%', zIndex: 1 }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker position={{ lat: settings.canteen_lat, lng: settings.canteen_lon }} setPosition={handleMapClick} />
              {/* Lingkaran yang menunjukkan radius toleransi */}
              <Circle center={mapCenter} radius={settings.max_radius_meters} pathOptions={{ color: 'orange', fillColor: 'orange', fillOpacity: 0.2 }} />
            </MapContainer>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Toleransi Radius (Meter)</label>
            <input type="number" name="max_radius_meters" min="10" value={settings.max_radius_meters} onChange={handleChange} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm dark:text-white" required />
          </div>
        </div>

        <div className="mt-auto pt-4">
          <button type="submit" disabled={isSaving} className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-white transition-all ${isSaving ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-500/20'}`}>
            {isSaving ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> : <FiSave />}
            Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
}
