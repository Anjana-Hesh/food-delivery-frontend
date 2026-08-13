import React, { useState, useEffect } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, TrendingUp, Layers, PackageX, AlertTriangle, Flame } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { FoodItem } from "../types";
import { fetchFoodItems } from "../api";

interface MenuScreenProps {
  onSelectItemToEdit: (item: FoodItem) => void;
}

const STATIC_FOOD_ITEMS: FoodItem[] = [
  { id: "1", name: "Pancake Stack with Berries", category: "Desserts", price: 1490.00, stock: 12, imageUrl: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=500&q=80" },
  { id: "2", name: "Classic Caesar Salad", category: "Burgers", price: 1250.00, stock: 15, imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=500&q=80" },
  { id: "3", name: "Margherita Pizza", category: "Pizzas", price: 2850.00, stock: 8, imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=500&q=80" },
  { id: "4", name: "Grilled Beef Steak", category: "Burgers", price: 3450.00, stock: 0, imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=500&q=80" },
  { id: "5", name: "Creamy Carbonara Pasta", category: "Pizzas", price: 1850.00, stock: 10, imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=500&q=80" },
  { id: "6", name: "Club Sandwich Deluxe", category: "Burgers", price: 1650.00, stock: 20, imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=80" },
  { id: "7", name: "Herb Grilled Chicken", category: "Burgers", price: 2200.00, stock: 5, imageUrl: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=500&q=80" },
  { id: "8", name: "Mediterranean Quinoa Bowl", category: "Drinks", price: 1350.00, stock: 14, imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80" },
  { id: "9", name: "Chocolate Lava Cake", category: "Desserts", price: 950.00, stock: 0, imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80" },
  { id: "10", name: "Iced Cappuccino", category: "Drinks", price: 850.00, stock: 25, imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80" }
];

export const MenuScreen: React.FC<MenuScreenProps> = ({ onSelectItemToEdit }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(STATIC_FOOD_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchFoodItems()
      .then((data) => setFoodItems(data))
      .catch(() => {
        // Fallback already configured via static default state
        console.log("Using local static data fallback for Menu Screen");
      });
  }, []);

  const salesData = [
    { day: "Mon", sales: 12000 },
    { day: "Tue", sales: 19000 },
    { day: "Wed", sales: 15000 },
    { day: "Thu", sales: 22000 },
    { day: "Fri", sales: 30000 },
    { day: "Sat", sales: 45000 },
    { day: "Sun", sales: 38000 },
  ];

  const categories = ["All", "Burgers", "Pizzas", "Drinks", "Desserts"];

  const filteredItems = foodItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const outOfStockCount = foodItems.filter(i => i.stock === 0).length;

  return (
    <div className="space-y-8">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" /> Revenue Contribution Trend
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Weekly sales breakdown across catalog items</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
              +18.4% growth
            </span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#090d16", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff" }} />
                <Area type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4 flex flex-col justify-between">
          <div className="glass-panel p-5 rounded-2xl flex items-center justify-between shadow-xl relative overflow-hidden group hover:border-orange-500/20 transition-all duration-300">
            <div className="absolute top-[-50%] right-[-20%] w-24 h-24 bg-orange-500/5 rounded-full blur-xl" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Catalog</p>
              <p className="text-2xl font-black text-white mt-1 text-glow-orange">{foodItems.length} Dishes</p>
            </div>
            <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl border border-orange-500/20">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className={`glass-panel p-5 rounded-2xl flex items-center justify-between shadow-xl relative overflow-hidden transition-all duration-300 ${
            outOfStockCount > 0 ? 'border-rose-500/30 bg-rose-500/5 shadow-[inset_0_1px_20px_rgba(244,63,94,0.02)]' : 'hover:border-rose-500/20'
          }`}>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Out of Stock Alert</p>
              <p className="text-2xl font-black text-rose-400 mt-1">{outOfStockCount} Items</p>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
              <PackageX className="w-5 h-5" />
            </div>
          </div>

          {outOfStockCount > 0 && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" /> Restock urgently to prevent lost sales!
            </div>
          )}
        </div>
      </div>

      {/* Most Sold Dishes Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-panel p-4 rounded-2xl shadow-xl">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-bounce" /> Top 10 Most Sold Dishes
        </h3>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search catalog..."
            className="w-full bg-slate-950/60 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 focus:bg-slate-950 transition-all duration-300"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_4px_15px_rgba(249,115,22,0.3)] scale-[1.05]"
                : "bg-slate-900/50 hover:bg-slate-900 text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            {cat} ({cat === "All" ? foodItems.length : foodItems.filter(i => i.category === cat).length})
          </button>
        ))}
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="glass-panel rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-orange-500/25 hover:shadow-[0_12px_30px_rgba(249,115,22,0.15)] group"
          >
            <div className="relative w-full h-48 overflow-hidden bg-slate-950">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-orange-400 font-extrabold text-[9px] px-3 py-1 rounded-full shadow-md border border-orange-500/20 uppercase tracking-widest">
                {item.category === 'Desserts' ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>
            </div>

            <div className="p-4 space-y-4">
              <h4 className="font-bold text-white text-sm tracking-wide line-clamp-1 group-hover:text-orange-400 transition-colors">
                {item.name}
              </h4>

              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Price</p>
                  <p className="text-base font-extrabold text-white mt-0.5">RS {item.price.toFixed(2)}</p>
                </div>

                <button
                  onClick={() => onSelectItemToEdit(item)}
                  className="bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95 glow-btn-orange border-none cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" /> Edit Item
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center glass-panel p-4 rounded-2xl shadow-xl">
          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-white">{startIndex + 1}</strong> to <strong className="text-white">{Math.min(startIndex + itemsPerPage, filteredItems.length)}</strong> of <strong className="text-white">{filteredItems.length}</strong> Items
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
                    : "bg-slate-950/85 text-slate-400 hover:text-white border border-white/5"
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
  );
};