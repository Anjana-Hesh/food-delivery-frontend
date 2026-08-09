import React, { useState } from 'react';
import { Utensils, ShoppingBag, Truck, CreditCard, Settings } from 'lucide-react';
import { MenuScreen } from './components/MenuScreen';
import { OrderScreen } from './components/OrderScreen';
import { DeliveryScreen } from './components/DeliveryScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { ManageItemsScreen } from './components/ManageItemsScreen';
import type { FoodItem } from './types';
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'delivery' | 'payments' | 'manage'>('menu');
  const [selectedItemToEdit, setSelectedItemToEdit] = useState<FoodItem | null>(null);

  const handleSelectItemToEdit = (item: FoodItem) => {
    setSelectedItemToEdit(item);
    setActiveTab('manage'); // Navigate to Manage Stock Screen automatically
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-600 rounded-xl shadow-lg shadow-orange-600/30">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-white tracking-wide">
              ByteBites <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">ECA Admin</span>
            </h1>
            <p className="text-xs text-slate-400">Microservice Orchestration Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex-wrap justify-center">
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
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-orange-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'menu' && <MenuScreen onSelectItemToEdit={handleSelectItemToEdit} />}
        {activeTab === 'manage' && <ManageItemsScreen editingItem={selectedItemToEdit} />}
        {activeTab === 'orders' && <OrderScreen onNavigateToDrivers={() => setActiveTab('delivery')} />}
        {activeTab === 'delivery' && <DeliveryScreen />}
        {activeTab === 'payments' && <PaymentScreen />}
      </main>
    </div>
  );
}