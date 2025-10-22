import React, { useState, useEffect } from 'react';

const StandModal = ({ isOpen, onClose, onSave, stand }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [active, setActive] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (stand) {
            setName(stand.name);
            setDescription(stand.description);
            setActive(stand.active);
            setPreview(stand.image);
        } else {
            setName('');
            setDescription('');
            setActive(true);
            setPreview(null);
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
        formData.append('name', name);
        formData.append('description', description);
        formData.append('active', active);
        if (imageFile) {
            formData.append('image', imageFile);
        }
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{stand ? 'Edit Stand' : 'Add New Stand'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Stand Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" rows="3"></textarea>
                    </div>
                     <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Stand Image</label>
                        {preview && <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded mb-2" />}
                        <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"/>
                    </div>
                     <div className="mb-4 flex items-center">
                        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} id="active-stand" className="mr-2"/>
                        <label htmlFor="active-stand" className="text-gray-700 text-sm font-bold">Active</label>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StandModal;