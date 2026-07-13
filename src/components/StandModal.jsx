import React, { useState, useEffect } from 'react';

const StandModal = ({ isOpen, onClose, onSave, stand }) => {
    // State Informasi Dasar
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [active, setActive] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // State ABAC (Waktu & Lokasi)
    const [openHour, setOpenHour] = useState(7);
    const [closeHour, setCloseHour] = useState(16);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [maxRadius, setMaxRadius] = useState(10000);

    useEffect(() => {
        if (stand) {
            setName(stand.name || '');
            setDescription(stand.description || '');
            setActive(stand.active ?? true);
            setPreview(stand.image || null);
            
            // Set data ABAC
            setOpenHour(stand.open_hour ?? 7);
            setCloseHour(stand.close_hour ?? 16);
            setLatitude(stand.latitude ?? '');
            setLongitude(stand.longitude ?? '');
            setMaxRadius(stand.max_radius_meters ?? 10000);
        } else {
            setName('');
            setDescription('');
            setActive(true);
            setPreview(null);
            
            // Reset data ABAC
            setOpenHour(7);
            setCloseHour(16);
            setLatitude('');
            setLongitude('');
            setMaxRadius(10000);
        }
        setImageFile(null);
    }, [stand, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        // Append Informasi Dasar
        formData.append('name', name);
        formData.append('description', description);
        formData.append('active', active);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        // Append Data ABAC
        formData.append('open_hour', openHour);
        formData.append('close_hour', closeHour);
        formData.append('max_radius_meters', maxRadius);
        
        // Hanya kirim latitude/longitude jika tidak kosong agar tidak error di backend
        if (latitude !== '') formData.append('latitude', latitude);
        if (longitude !== '') formData.append('longitude', longitude);

        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            {/* Modal diperlebar dan diberi max-height agar bisa di-scroll jika layar kecil */}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {stand ? 'Edit Stand' : 'Add New Stand'}
                    </h2>
                </div>

                {/* Body (Scrollable) */}
                <div className="p-6 overflow-y-auto">
                    <form id="stand-form" onSubmit={handleSubmit}>
                        
                        {/* --- BAGIAN 1: INFORMASI DASAR --- */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Informasi Dasar</h3>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Stand Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500" rows="3"></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Stand Image</label>
                                {preview && <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded mb-2 border" />}
                                <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"/>
                            </div>
                            <div className="mb-4 flex items-center bg-gray-50 p-3 rounded border">
                                <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} id="active-stand" className="mr-2 w-4 h-4 text-orange-600 focus:ring-orange-500 rounded"/>
                                <label htmlFor="active-stand" className="text-gray-700 text-sm font-bold cursor-pointer">Active (Ditampilkan di aplikasi)</label>
                            </div>
                        </div>

                        {/* --- BAGIAN 2: ABAC JAM OPERASIONAL --- */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Jam Operasional (0 - 23)</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Jam Buka</label>
                                    <input type="number" min="0" max="23" value={openHour} onChange={(e) => setOpenHour(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Jam Tutup</label>
                                    <input type="number" min="0" max="23" value={closeHour} onChange={(e) => setCloseHour(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                                </div>
                            </div>
                        </div>

                        {/* --- BAGIAN 3: ABAC GEOFENCING --- */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Batasan Lokasi (Geofencing)</h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Latitude</label>
                                    <input type="number" step="any" placeholder="-0.00000" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Longitude</label>
                                    <input type="number" step="any" placeholder="100.00000" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Radius Maksimal (Meter)</label>
                                <input type="number" min="1" value={maxRadius} onChange={(e) => setMaxRadius(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer Modal */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
                    <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors">Cancel</button>
                    <button type="submit" form="stand-form" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded transition-colors">Save Stand</button>
                </div>

            </div>
        </div>
    );
};

export default StandModal;
