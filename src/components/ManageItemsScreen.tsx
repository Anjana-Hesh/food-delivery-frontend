import React, { useState, useEffect } from 'react';
import { Plus, Upload, RefreshCw, Save, Image as ImageIcon, Package, Layers, CheckCircle2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Same Names and Data as MenuScreen for 100% Sync
  const [items, setItems] = useState<FoodItem[]>([
    { id: '1', name: 'Pancake Stack with Berries', category: 'Desserts', price: 1490.00, stock: 12, imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=500&q=80' },
    { id: '2', name: 'Classic Caesar Salad', category: 'Burgers', price: 1250.00, stock: 15, imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=500&q=80' },
    { id: '3', name: 'Margherita Pizza', category: 'Pizzas', price: 2850.00, stock: 8, imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=500&q=80' },
    { id: '4', name: 'Grilled Beef Steak', category: 'Burgers', price: 3450.00, stock: 0, imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=500&q=80' },
    { id: '5', name: 'Creamy Carbonara Pasta', category: 'Pizzas', price: 1850.00, stock: 10, imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=500&q=80' },
    { id: '6', name: 'Club Sandwich Deluxe', category: 'Burgers', price: 1650.00, stock: 20, imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=80' },
    { id: '7', name: 'Herb Grilled Chicken', category: 'Burgers', price: 2200.00, stock: 5, imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=500&q=80' },
    { id: '8', name: 'Mediterranean Quinoa Bowl', category: 'Drinks', price: 1350.00, stock: 14, imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80' },
    { id: '9', name: 'Chocolate Lava Cake', category: 'Desserts', price: 950.00, stock: 0, imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80' },
    { id: '10', name: 'Iced Cappuccino', category: 'Drinks', price: 850.00, stock: 25, imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80' },
  ]);

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.name);
      setCategory(editingItem.category);
      setPrice(editingItem.price.toString());
      setStock(editingItem.stock.toString());
      setSearchQuery(editingItem.name);
    }
  }, [editingItem]);

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

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

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
              {editingItem ? `Editing Stock: ${editingItem.name}` : "Inventory & Stock Manager"}
            </h2>
            <p className="text-xs text-slate-400">MongoDB Document Database Operations</p>
          </div>
        </div>

        <span className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-2">
          <Package className="w-4 h-4 text-orange-400" /> Total Managed Items: {items.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Form */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl h-fit space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-orange-400" /> {editingItem ? 'Update Stock Item' : 'Create New Dish'}
          </h3>

          {isSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Item saved successfully!
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSaveItem}>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Item Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSearchQuery(e.target.value);
                }}
                placeholder="e.g. Crispy Chicken Sub" 
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
                placeholder="1490.00" 
                step="0.01" 
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500" 
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Upload Photo (GCP Bucket)</label>
              <label className="border-2 border-dashed border-slate-700 hover:border-orange-500 rounded-xl p-3 text-center cursor-pointer bg-slate-950/50 block">
                <Upload className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                <span className="text-xs text-slate-300">Choose File</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedImage(e.target.files?.[0] || null)} />
                {selectedImage && <p className="text-xs text-orange-400 font-bold mt-1 truncate">{selectedImage.name}</p>}
              </label>
            </div>

            <button type="submit" className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2">
              <ImageIcon className="w-4 h-4" /> {editingItem ? 'Save Stock Changes' : 'Create Item'}
            </button>
          </form>
        </div>

        {/* Right Inventory Grid with Taller Image Height (h-36) */}
        <div className="lg:col-span-3 space-y-5">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-orange-400" /> Active Inventory Stream ({filteredItems.length})
            </h3>

            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search inventory by title..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          {/* Taller Cards (h-36 image) Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {currentItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-[#18181b] border border-slate-800 rounded-2xl p-3 flex flex-col justify-between shadow-lg hover:border-slate-700 transition-all group"
              >
                <div className="space-y-2">
                  <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-950">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md text-orange-400 font-bold text-[9px] px-2 py-0.5 rounded border border-orange-500/30">
                      {item.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-xs line-clamp-1" title={item.name}>{item.name}</h4>
                    <p className="text-xs font-black text-white mt-0.5">RS {item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-2.5 mt-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${item.stock === 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                      {item.stock === 0 ? 'Out of Stock' : `${item.stock} Available`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button 
                      type="button"
                      onClick={() => handleStockChange(item.id, item.stock - 1)} 
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-white">{item.stock}</span>
                    <button 
                      type="button"
                      onClick={() => handleStockChange(item.id, item.stock + 1)} 
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold"
                    >
                      +
                    </button>
                    <button 
                      type="button"
                      className="p-1 bg-slate-800 text-orange-400 hover:bg-orange-600 hover:text-white rounded-lg transition-colors"
                      title="Sync with MongoDB"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-xs text-slate-400 font-medium">
                Showing <strong className="text-white">{startIndex + 1}</strong> to <strong className="text-white">{Math.min(startIndex + itemsPerPage, filteredItems.length)}</strong> of <strong className="text-white">{filteredItems.length}</strong> Managed Items
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed rounded-xl"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      currentPage === idx + 1
                        ? "bg-orange-600 text-white"
                        : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed rounded-xl"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};