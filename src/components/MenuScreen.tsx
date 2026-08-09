import React, { useState } from "react";
import { Search, Tag, AlertTriangle, Layers, PackageX, TrendingUp, Edit3 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { FoodItem } from "../types";

interface MenuScreenProps {
  onSelectItemToEdit: (item: FoodItem) => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ onSelectItemToEdit }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const salesData = [
    { day: "Mon", sales: 12000 },
    { day: "Tue", sales: 19000 },
    { day: "Wed", sales: 15000 },
    { day: "Thu", sales: 22000 },
    { day: "Fri", sales: 30000 },
    { day: "Sat", sales: 45000 },
    { day: "Sun", sales: 38000 },
  ];

  // Compact List of 8 Food Items
  const foodItems: FoodItem[] = [
    { id: "1", name: "Cheese Burger", category: "Burgers", price: 1290.00, stock: 12, imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80" },
    { id: "2", name: "Pepperoni Pizza", category: "Pizzas", price: 2850.00, stock: 0, imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80" },
    { id: "3", name: "Mango Smoothie", category: "Drinks", price: 590.00, stock: 20, imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=500&q=80" },
    { id: "4", name: "Lava Cake", category: "Desserts", price: 850.00, stock: 0, imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80" },
    { id: "5", name: "Zinger Sub", category: "Burgers", price: 980.00, stock: 15, imageUrl: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=500&q=80" },
    { id: "6", name: "Iced Cappuccino", category: "Drinks", price: 720.00, stock: 18, imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80" },
    { id: "7", name: "BBQ Chicken Pizza", category: "Pizzas", price: 3100.00, stock: 5, imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80" },
    { id: "8", name: "Berry Waffle", category: "Desserts", price: 1150.00, stock: 9, imageUrl: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=500&q=80" },
  ];

  const categories = ["All", "Burgers", "Pizzas", "Drinks", "Desserts"];

  const filteredItems = foodItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const outOfStockCount = foodItems.filter(i => i.stock === 0).length;

  return (
    <div className="space-y-8">
      {/* Analytics Chart & Counters Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recharts Analytics Area Chart */}
        <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-2xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" /> Revenue Contribution Trend
              </h3>
              <p className="text-xs text-slate-400">Weekly sales performance & catalog engagement</p>
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

        {/* Stock Status Cards */}
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

      {/* Category Filter & Compact Card Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
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

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Compact Grid Layout (8 Mini Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItemToEdit(item)}
              className="bg-slate-900/90 border border-slate-800 hover:border-orange-500/50 rounded-2xl p-3 flex flex-col justify-between shadow-xl hover:shadow-orange-500/10 cursor-pointer transition-all duration-300 group relative overflow-hidden"
            >
              {/* Image & Category Overlay */}
              <div className="relative w-full h-28 rounded-xl overflow-hidden mb-2.5">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 text-[9px] font-extrabold text-orange-400 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-orange-500/30">
                  {item.category}
                </span>

                {/* Edit Hover Icon */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-2.5 py-1 bg-orange-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-md">
                    <Edit3 className="w-3 h-3" /> Edit Item
                  </span>
                </div>
              </div>

              {/* Title & Price Details Below Image */}
              <div className="space-y-1">
                <h4 className="font-bold text-white text-xs truncate group-hover:text-orange-400 transition-colors">
                  {item.name}
                </h4>

                <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
                  <span className="text-xs font-black text-orange-400">
                    RS {item.price.toFixed(2)}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                    item.stock === 0 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {item.stock === 0 ? 'OUT' : `${item.stock} left`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};