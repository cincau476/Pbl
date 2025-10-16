import React, { useState, useEffect } from 'react';

const MenuModal = ({ isOpen, onClose, onSave, menu }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    // 1. State baru untuk kategori
    const [category, setCategory] = useState('FOOD'); 
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (menu) {
            setName(menu.name);
            setDescription(menu.description);
            setPrice(menu.price);
            setStock(menu.stock);
            // Set kategori saat mengedit
            setCategory(menu.category || 'FOOD'); 
            setPreview(menu.image);
        } else {
            // Reset state saat menambah item baru
            setName('');
            setDescription('');
            setPrice(0);
            setStock(0);
            setCategory('FOOD');
            setPreview(null);
        }
        setImageFile(null);
    }, [menu, isOpen]);

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
        formData.append('price', parseFloat(price));
        formData.append('stock', parseInt(stock));
        // 3. Tambahkan kategori ke form data
        formData.append('category', category); 
        if (imageFile) {
            formData.append('image', imageFile);
        }
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{menu ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
                <form onSubmit={handleSubmit}>
                    {/* Input untuk Name, Description, Price, Stock... */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Menu Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" rows="2"></textarea>
                    </div>
                    
                    {/* --- KODE BARU DIMULAI DI SINI --- */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                           <label className="block text-gray-700 text-sm font-bold mb-2">Price (Rp)</label>
                           <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
                        </div>
                        <div>
                           <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                           <select value={category} onChange={(e) => setCategory(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white">
                               <option value="FOOD">Makanan</option>
                               <option value="DRINK">Minuman</option>
                           </select>
                        </div>
                    </div>
                    {/* --- KODE BARU SELESAI DI SINI --- */}

                     <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Stock</label>
                        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
                    </div>
                     <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Menu Image</label>
                        {preview && <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded mb-2" />}
                        <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"/>
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

export default MenuModal;