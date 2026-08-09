import React, { useState, useEffect } from 'react';
import { Plus, Upload, RefreshCw, Save, Image as ImageIcon, Package, Layers, CheckCircle2 } from 'lucide-react';
import type { FoodItem } from '../types';

interface ManageItemsProps {
  editingItem?: FoodItem | null;
}

export const ManageItemsScreen: React.FC<ManageItemsProps> = ({ editingItem }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Burgers');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-fill form when an item is selected from MenuScreen
  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.name);
      setCategory(editingItem.category);
      setPrice(editingItem.price.toString());
      setStock(editingItem.stock.toString());
    }
  }, [editingItem]);

  const [items, setItems] = useState<FoodItem[]>([
    { id: '1', name: 'Cheese Burger', category: 'Burgers', price: 1290.00, stock: 12, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80' },
    { id: '2', name: 'Pepperoni Pizza', category: 'Pizzas', price: 2850.00, stock: 0, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80' },
  ]);

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    const newItem: FoodItem = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      name: title,
      category,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      imageUrl: selectedImage 
        ? URL.createObjectURL(selectedImage) 
        : editingItem ? editingItem.imageUrl : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
    };

    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? newItem : i));
    } else {
      setItems([newItem, ...items]);
    }

    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const handleStockChange = (id: string, newStock: number) => {
    setItems(prevItems => 
      prevItems.map(item => item.id === id ? { ...item, stock: Math.max(0, newStock) } : item)
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              {editingItem ? `Edit Item: ${editingItem.name}` : "Inventory & Stock Manager"}
            </h2>
            <p className="text-xs text-slate-400">MongoDB Document Operations</p>
          </div>
        </div>

        <span className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-2">
          <Package className="w-4 h-4 text-orange-400" /> Total Stock Managed: {items.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Add / Update Form */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl h-fit">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-orange-400" /> {editingItem ? 'Update Existing Item' : 'Create New Item'}
          </h3>

          {isSuccess && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Item saved successfully!
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSaveItem}>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Item Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Crispy Sub" 
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500" 
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Burgers">Burgers</option>
                  <option value="Pizzas">Pizzas</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Desserts">Dessert</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Stock Level</label>
                <input 
                  type="number" 
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min="0" 
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500" 
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Price (RS)</label>
              <input 
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1200.00" 
                step="0.01" 
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500" 
                required
              />
            </div>

            {/* Cloud Storage Image Upload */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Upload Photo (GCP Bucket)[cite: 1]</label>
              <label className="border-2 border-dashed border-slate-700 hover:border-orange-500 rounded-xl p-3 text-center cursor-pointer bg-slate-950/50 block">
                <Upload className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                <span className="text-xs text-slate-300">Choose Image File</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedImage(e.target.files?.[0] || null)} />
                {selectedImage && <p className="text-xs text-orange-400 font-bold mt-1 truncate">{selectedImage.name}</p>}
              </label>
            </div>

            <button type="submit" className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2">
              <ImageIcon className="w-4 h-4" /> {editingItem ? 'Save Updates' : 'Create Item'}
            </button>
          </form>
        </div>

        {/* Right Side: Mini Stock Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-orange-400" /> Active Inventory Grid
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-xl">
                <div className="flex gap-3">
                  <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-xl object-cover border border-slate-700" />
                  <div>
                    <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">{item.category}</span>
                    <h4 className="font-bold text-white text-sm mt-1">{item.name}</h4>
                    <p className="text-xs font-black text-slate-200">RS {item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${item.stock === 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {item.stock === 0 ? 'Out of Stock' : `${item.stock} in Stock`}
                  </span>

                  <div className="flex items-center gap-2">
                    <button onClick={() => handleStockChange(item.id, item.stock - 1)} className="px-2.5 py-1 bg-slate-950 text-white rounded-lg text-xs font-bold">-</button>
                    <span className="text-xs font-bold text-white">{item.stock}</span>
                    <button onClick={() => handleStockChange(item.id, item.stock + 1)} className="px-2.5 py-1 bg-slate-950 text-white rounded-lg text-xs font-bold">+</button>
                    <button className="p-2 bg-slate-800 text-orange-400 rounded-lg"><Save className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};