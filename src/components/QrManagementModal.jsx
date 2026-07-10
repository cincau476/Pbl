import React, { useState, useEffect, useCallback } from 'react';
import { FiX, FiTrash2, FiDownload, FiPlus } from 'react-icons/fi';
import * as api from '../utils/api';

const QrManagementModal = ({ isOpen, onClose }) => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newTableCode, setNewTableCode] = useState('');
    const [newTableLabel, setNewTableLabel] = useState('');
    const [error, setError] = useState(null);

    const fetchTables = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getTables();
            setTables(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) fetchTables();
    }, [isOpen, fetchTables]);

    const handleAddTable = async (e) => {
        e.preventDefault();
        try {
            await api.addTable({ code: newTableCode, label: newTableLabel });
            setNewTableCode('');
            setNewTableLabel('');
            fetchTables();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteTable = async (id, code) => {
        if (!window.confirm(`Hapus meja ${code} beserta QR Code-nya?`)) return;
        try {
            await api.deleteTable(id);
            setTables(tables.filter(t => t.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    // Fungsi berguna: Download QR Code Image
    const handleDownloadQr = async (url, filename) => {
        try {
            // Fetch blob untuk mengatasi masalah CORS jika langsung dari <a> tag
            const accessToken = sessionStorage.getItem('admin_token');
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (err) {
            alert('Gagal mengunduh QR Code');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">Manajemen QR Code Meja (Dine-In)</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><FiX size={24} /></button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                    {/* Form Tambah Meja / QR Baru */}
                    <form onSubmit={handleAddTable} className="bg-gray-50 p-4 rounded-lg mb-6 flex gap-4 items-end border">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Kode Meja (Unik, misal: A1)</label>
                            <input type="text" required value={newTableCode} onChange={(e) => setNewTableCode(e.target.value.toUpperCase())} className="mt-1 w-full border rounded p-2" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Label (Opsional, misal: Meja Pojok)</label>
                            <input type="text" value={newTableLabel} onChange={(e) => setNewTableLabel(e.target.value)} className="mt-1 w-full border rounded p-2" />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 flex items-center gap-2">
                            <FiPlus /> Buat QR Meja
                        </button>
                    </form>

                    {/* Daftar QR Code yang sudah dibuat */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? <p>Memuat QR Code...</p> : tables.map((table) => {
                            const qrUrl = api.getTableQrUrl(table.code);
                            return (
                                <div key={table.id} className="border rounded-lg p-4 flex flex-col items-center shadow-sm">
                                    <h3 className="font-bold text-lg">{table.code}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{table.label || 'Tidak ada label'}</p>
                                    
                                    <div className="bg-gray-100 p-2 rounded mb-4">
                                        <img src={qrUrl} alt={`QR Meja ${table.code}`} className="w-32 h-32 object-contain" />
                                    </div>

                                    <div className="flex w-full gap-2">
                                        <button onClick={() => handleDownloadQr(qrUrl, `QR_Meja_${table.code}.png`)} className="flex-1 bg-green-500 text-white py-2 rounded text-sm font-medium flex items-center justify-center gap-1 hover:bg-green-600">
                                            <FiDownload /> Unduh
                                        </button>
                                        <button onClick={() => handleDeleteTable(table.id, table.code)} className="flex-1 bg-red-500 text-white py-2 rounded text-sm font-medium flex items-center justify-center gap-1 hover:bg-red-600">
                                            <FiTrash2 /> Hapus
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QrManagementModal;
