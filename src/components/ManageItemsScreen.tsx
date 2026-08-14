import React, { useState, useEffect } from 'react';
import { Plus, Upload, RefreshCw, Save, Image as ImageIcon, Package, Layers, CheckCircle2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import type { FoodItem } from '../types';
import { fetchFoodItems, saveFoodItem, uploadFoodItemImage } from '../api';

interface ManageItemsProps {
  editingItem?: FoodItem | null;
}

export const ManageItemsScreen: React.FC<ManageItemsProps> = ({ editingItem }) => {
  const [formItem, setFormItem] = useState<FoodItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Burgers');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [imageUrl, setImageUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [items, setItems] = useState<FoodItem[]>([]);
  const [loadError, setLoadError] = useState('');
  const [stockDrafts, setStockDrafts] = useState<Record<string, number>>({});

  const showApiAlert = (icon: 'success' | 'error', title: string, text: string) => {
    Swal.fire({
      icon,
      title,
      text,
      background: '#0f172a',
      color: '#f8fafc',
      confirmButtonColor: icon === 'success' ? '#f97316' : '#e11d48',
      customClass: {
        popup: 'rounded-2xl border border-white/10',
        confirmButton: 'rounded-xl',
      },
    });
  };

  const loadData = () => {
    fetchFoodItems()
      .then(data => {
        setItems(data);
        setStockDrafts(Object.fromEntries(data.map(item => [item.id, item.stock])));
        setLoadError('');
      })
      .catch(() => setLoadError('Inventory items could not be loaded from the database.'));
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (editingItem) {
      fillFormFromItem(editingItem);
    }
  }, [editingItem]);

  const fillFormFromItem = (item: FoodItem) => {
    setFormItem(item);
    setTitle(item.name);
    setCategory(item.category);
    setPrice(item.price.toString());
    setStock(item.stock.toString());
    setImageUrl(item.imageUrl || '');
    setSelectedImage(null);
    setSelectedImagePreview('');
  };

  const handleImageSelect = (file: File | null) => {
    setSelectedImage(file);
    setSelectedImagePreview(file ? URL.createObjectURL(file) : '');
  };

  const clearForm = () => {
    setTitle('');
    setPrice('');
    setStock('10');
    setImageUrl('');
    setFormItem(null);
    handleImageSelect(null);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    try {
      let finalImageUrl = imageUrl;
      if (selectedImage) {
        finalImageUrl = await uploadFoodItemImage(selectedImage);
      }

      const itemPayload: Partial<FoodItem> = {
        name: title,
        category,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        imageUrl: finalImageUrl,
      };

      if (formItem) {
        itemPayload.id = formItem.id;
      }

      const saved = await saveFoodItem(itemPayload);
      if (formItem) {
        setItems(items.map(i => i.id === formItem.id ? saved : i));
      } else {
        setItems([saved, ...items]);
      }
      setStockDrafts(prev => ({ ...prev, [saved.id]: saved.stock }));

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      clearForm();
      showApiAlert('success', 'Saved successfully', 'Item data was saved to the database.');
    } catch (err) {
      console.error("Error saving item", err);
      showApiAlert('error', 'Save failed', 'Item data could not be saved. Please try again.');
    }
  };

  const handleStockDraftChange = (id: string, newStock: number) => {
    setStockDrafts(prev => ({ ...prev, [id]: Math.max(0, newStock) }));
  };

  const handleStockSave = async (id: string) => {
    const targetItem = items.find(i => i.id === id);
    if (!targetItem) return;

    try {
      const updatedItem = { ...targetItem, stock: stockDrafts[id] ?? targetItem.stock };
      const saved = await saveFoodItem(updatedItem);
      setItems(items.map(i => i.id === id ? saved : i));
      setStockDrafts(prev => ({ ...prev, [id]: saved.stock }));
      fillFormFromItem(saved);
      scrollToTop();
      showApiAlert('success', 'Stock updated', `${saved.name} stock was saved successfully.`);
    } catch (err) {
      console.error("Error updating stock", err);
      showApiAlert('error', 'Stock update failed', 'The stock change could not be saved to the database.');
    }
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-panel p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400">
            <Layers className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-wide">
              {formItem ? `Editing Stock: ${formItem.name}` : "Inventory & Stock Manager"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Control product stock, pricing, and details</p>
          </div>
        </div>

        <span className="px-3.5 py-1.5 bg-slate-950/60 border border-white/5 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-2">
          <Package className="w-4 h-4 text-orange-400" /> Total Managed Items: {items.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Form */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl h-fit space-y-5">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-orange-400" /> {formItem ? 'Update Stock Item' : 'Create New Dish'}
          </h3>

          {isSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse">
              <CheckCircle2 className="w-4 h-4" /> Item saved successfully!
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSaveItem}>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Item Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSearchQuery(e.target.value);
                }}
                placeholder="e.g. Crispy Chicken Sub" 
                className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500 focus:bg-slate-950 transition-all duration-300" 
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-orange-500 focus:bg-slate-950 transition-all duration-300"
                >
                  <option value="Burgers">Burgers</option>
                  <option value="Pizzas">Pizzas</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Desserts">Meals</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Stock Level</label>
                <input 
                  type="number" 
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min="0" 
                  className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-orange-500 focus:bg-slate-950 transition-all duration-300" 
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Price (RS)</label>
              <input 
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1490.00" 
                step="0.01" 
                className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-xs text-white font-bold focus:outline-none focus:border-orange-500 focus:bg-slate-950 transition-all duration-300" 
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Item Photo</label>
              <div className="grid grid-cols-[88px_1fr] gap-3 rounded-xl border border-white/5 bg-slate-950/30 p-2.5">
                <div className="h-20 w-20 overflow-hidden rounded-xl border border-white/10 bg-slate-950">
                  {(selectedImagePreview || imageUrl) ? (
                    <img src={selectedImagePreview || imageUrl} alt="Item preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-600">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 space-y-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Image URL from database"
                    className="w-full bg-slate-950/60 border border-white/5 rounded-xl px-3 py-2 text-[10px] text-slate-300 focus:outline-none focus:border-orange-500 focus:bg-slate-950 transition-all duration-300"
                  />
                  <label className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900/80 px-3 py-2 text-[10px] font-bold text-orange-400 hover:bg-slate-800 cursor-pointer transition-all duration-300">
                    <Upload className="w-3.5 h-3.5" />
                    Choose File
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e.target.files?.[0] || null)} />
                  </label>
                  {selectedImage && <p className="text-[10px] text-orange-400 font-bold truncate">{selectedImage.name}</p>}
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 font-bold text-xs text-white shadow-lg shadow-orange-500/10 transition-all duration-300 flex items-center justify-center gap-2 border-none cursor-pointer glow-btn-orange">
              <ImageIcon className="w-4 h-4" /> {formItem ? 'Save Stock Changes' : 'Create Item'}
            </button>
          </form>
        </div>

        {/* Right Inventory Grid */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-panel p-4 rounded-2xl shadow-xl">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-orange-400" /> Active Inventory Stream ({filteredItems.length})
            </h3>

            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search inventory by title..."
                className="w-full bg-slate-950/60 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 focus:bg-slate-950 transition-all duration-300"
              />
            </div>
          </div>

          {/* Cards Grid */}
          {loadError && (
            <div className="glass-panel rounded-2xl p-6 text-center shadow-xl border-rose-500/20">
              <p className="text-sm font-extrabold text-rose-300">{loadError}</p>
              <p className="text-xs text-slate-400 mt-2">Please check the backend connection and try again.</p>
            </div>
          )}

          {!loadError && currentItems.length === 0 && (
            <div className="glass-panel rounded-2xl p-6 text-center text-sm font-bold text-slate-300 shadow-xl">
              No inventory items found.
            </div>
          )}

          {!loadError && currentItems.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3.5">
            {currentItems.map((item) => (
              <div
                role="button"
                tabIndex={0}
                key={item.id} 
                onClick={() => fillFormFromItem(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') fillFormFromItem(item);
                }}
                className={`glass-panel w-[156px] h-[258px] rounded-2xl p-3 flex flex-col justify-between text-left shadow-lg hover:border-orange-500/25 hover:shadow-[0_8px_25px_rgba(249,115,22,0.1)] transition-all duration-300 group border cursor-pointer ${
                  formItem?.id === item.id ? 'border-orange-500/50 bg-orange-500/5' : 'border-white/5'
                }`}
              >
                <div className="space-y-2">
                  <div className="relative w-full h-[90px] rounded-xl overflow-hidden bg-slate-950">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-2 left-2 max-w-[calc(100%-1rem)] truncate bg-slate-950/80 backdrop-blur-md text-orange-400 font-extrabold text-[8px] px-2 py-0.5 rounded border border-orange-500/20 uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-[11px] min-h-7 leading-snug line-clamp-2 group-hover:text-orange-400 transition-colors" title={item.name}>{item.name}</h4>
                    <p className="text-[10px] font-black text-slate-300 mt-0.5">RS {item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-2.5 mt-2.5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full border tracking-wider uppercase ${
                      item.stock === 0 
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {(stockDrafts[item.id] ?? item.stock) === 0 ? 'Out of Stock' : `${stockDrafts[item.id] ?? item.stock} Available`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/5">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStockDraftChange(item.id, (stockDrafts[item.id] ?? item.stock) - 1);
                      }} 
                      className="px-2 py-1 bg-slate-900/60 hover:bg-slate-800 text-white rounded-lg text-xs font-black cursor-pointer border-none"
                    >
                      -
                    </button>
                    <span className="text-xs font-extrabold text-white px-1.5">{stockDrafts[item.id] ?? item.stock}</span>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStockDraftChange(item.id, (stockDrafts[item.id] ?? item.stock) + 1);
                      }} 
                      className="px-2 py-1 bg-slate-900/60 hover:bg-slate-800 text-white rounded-lg text-xs font-black cursor-pointer border-none"
                    >
                      +
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStockSave(item.id);
                      }}
                      className="p-1 bg-slate-900 hover:bg-orange-600 hover:text-white text-orange-400 rounded-lg transition-colors border-none cursor-pointer"
                      title="Sync with MongoDB"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}

          {/* Pagination Controls */}
          {!loadError && totalPages > 1 && (
            <div className="flex justify-between items-center glass-panel p-4 rounded-2xl shadow-xl">
              <span className="text-xs text-slate-400 font-medium">
                Showing <strong className="text-white">{startIndex + 1}</strong> to <strong className="text-white">{Math.min(startIndex + itemsPerPage, filteredItems.length)}</strong> of <strong className="text-white">{filteredItems.length}</strong> Managed Items
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-2 bg-slate-950/80 border border-white/5 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all duration-300 ${
                      currentPage === idx + 1
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/10"
                        : "bg-slate-950/80 text-slate-400 hover:text-white border border-white/5"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-2 bg-slate-950/80 border border-white/5 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
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
