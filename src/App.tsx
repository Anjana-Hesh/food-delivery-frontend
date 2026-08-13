import React, { useState, useEffect } from 'react';
import { Utensils, ShoppingBag, Truck, CreditCard, Settings } from 'lucide-react';
import { MenuScreen } from './components/MenuScreen';
import { OrderScreen } from './components/OrderScreen';
import { DeliveryScreen } from './components/DeliveryScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { ManageItemsScreen } from './components/ManageItemsScreen';
import type { FoodItem } from './types';
import "./App.css";

export default function App() {
  // Preserve active tab state in localStorage so refresh stays on current screen
  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'delivery' | 'payments' | 'manage'>(() => {
    const saved = localStorage.getItem('activeTab');
    return (saved as any) || 'menu';
  });

  const [selectedItemToEdit, setSelectedItemToEdit] = useState<FoodItem | null>(null);

  const handleTabChange = (tab: 'menu' | 'orders' | 'delivery' | 'payments' | 'manage') => {
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
  };

  const handleSelectItemToEdit = (item: FoodItem) => {
    setSelectedItemToEdit(item);
    handleTabChange('manage');
  };

  return (
    <div className="min-h-screen text-slate-100 antialiased relative overflow-hidden bg-slate-950/20">
      {/* Decorative background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-sky-600/5 blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 glass-panel backdrop-blur-md border-b border-white/5 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg shadow-orange-500/25 animate-pulse">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-white tracking-wide flex items-center gap-2">
              ByteBites <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/30 text-glow-orange uppercase tracking-wider">ECA Admin</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">Microservice Orchestration Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950/70 p-1.5 rounded-xl border border-white/5 flex-wrap justify-center">
          {[
            { id: 'menu', label: 'Dashboard & Catalog', icon: Utensils },
            { id: 'manage', label: 'Manage Stock', icon: Settings },
            { id: 'orders', label: 'Live Orders', icon: ShoppingBag },
            { id: 'delivery', label: 'Driver Fleet', icon: Truck },
            { id: 'payments', label: 'Payments', icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 relative ${
                  isActive 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] scale-[1.03] z-10' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Container - Expanded width to fit 4 cards in a row */}
      <main className="max-w-[1600px] mx-auto px-6 py-8 relative z-10">
        {activeTab === 'menu' && <MenuScreen onSelectItemToEdit={handleSelectItemToEdit} />}
        {activeTab === 'manage' && <ManageItemsScreen editingItem={selectedItemToEdit} />}
        {activeTab === 'orders' && <OrderScreen onNavigateToDrivers={() => handleTabChange('delivery')} />}
        {activeTab === 'delivery' && <DeliveryScreen />}
        {activeTab === 'payments' && <PaymentScreen />}
      </main>
    </div>
  );
}