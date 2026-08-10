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
        <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-2xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" /> Revenue Contribution Trend
              </h3>
              <p className="text-xs text-slate-400">Weekly sales breakdown across catalog items</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl">
              +18.4% growth
            </span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }} />
                <Area type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4 flex flex-col justify-between">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Active Catalog</p>
              <p className="text-2xl font-black text-white mt-1">{foodItems.length} Dishes</p>
            </div>
            <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl border border-orange-500/20">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className={`bg-slate-900/80 backdrop-blur-xl border p-5 rounded-2xl flex items-center justify-between ${
            outOfStockCount > 0 ? 'border-rose-500/40 bg-rose-500/5' : 'border-slate-800'
          }`}>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Out of Stock Alert</p>
              <p className="text-2xl font-black text-rose-400 mt-1">{outOfStockCount} Items</p>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
              <PackageX className="w-6 h-6" />
            </div>
          </div>

          {outOfStockCount > 0 && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" /> Restock urgently to prevent lost sales!
            </div>
          )}
        </div>
      </div>

      {/* Most Sold Dishes Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500 fill-orange-500" /> Top 10 Most Sold Dishes
        </h3>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search catalog..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30 scale-105"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {cat} ({cat === "All" ? foodItems.length : foodItems.filter(i => i.category === cat).length})
          </button>
        ))}
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#18181b] border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-slate-700"
          >
            <div className="relative w-full h-48 overflow-hidden bg-slate-950">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-white/90 text-slate-900 font-semibold text-[11px] px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                {item.category === 'Desserts' ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>
            </div>

            <div className="p-4 space-y-3">
              <h4 className="font-semibold text-white text-base tracking-wide line-clamp-1">
                {item.name}
              </h4>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Price</p>
                  <p className="text-lg font-bold text-white">RS {item.price.toFixed(2)}</p>
                </div>

                <button
                  onClick={() => onSelectItemToEdit(item)}
                  className="bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95"
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
        <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-white">{startIndex + 1}</strong> to <strong className="text-white">{Math.min(startIndex + itemsPerPage, filteredItems.length)}</strong> of <strong className="text-white">{filteredItems.length}</strong> Items
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
  );
};